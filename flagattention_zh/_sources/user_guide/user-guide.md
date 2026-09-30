# 用户指南

## 稠密注意力

### FlashAttention

```python
import torch
from flag_attn import flash_attention

B, Hq, Hkv, M, N, D = 2, 16, 4, 2048, 4096, 128
q = torch.randn(B, Hq, M, D, device="cuda", dtype=torch.float16, requires_grad=True)
k = torch.randn(B, Hkv, N, D, device="cuda", dtype=torch.float16, requires_grad=True)
v = torch.randn(B, Hkv, N, D, device="cuda", dtype=torch.float16, requires_grad=True)

out = flash_attention(q, k, v, causal=True)
out.sum().backward()
```

完整接口如下：

```python
flash_attention(
    q, k, v,
    causal=False,
    sm_scale=None,
    dropout_p=0.0,
    return_log_normalizer=False,
    return_total_attention=False,
    return_seed_offset=False,
)
```

`Hq` 必须能被 `Hkv` 整除，`D` 取值为 `16`、`32`、`64` 或 `128`。矩形 causal attention 采用右下对齐。实现会根据 GPU 占用情况自动选择常规或 split-KV 前向路径。

开启任一辅助返回标志时，函数固定返回五个值，未启用的字段为 `None`：

```python
out, lse, total, seed, offset = flash_attention(
    q, k, v,
    return_log_normalizer=True,
    return_total_attention=True,
)
```

- `lse`：`[B, Hq, M]`，逐行的 log-normalizer。
- `total`：`[B, Hq, N]`，沿 query 轴求和的 attention 概率。
- `seed` 与 `offset`：dropout 生效且被请求时的 Philox 状态。

当占用启发式选中 split-KV 路径时不支持 dropout；此类场景请使用非 split 形状或 `dropout_p=0`。

### Piecewise Attention

```python
import torch
from flag_attn import piecewise_attention

B, H, M, N, D = 1, 2, 128, 128, 64
q1 = torch.randn(B, H, M, D, device="cuda", dtype=torch.float16)
q2 = torch.randn_like(q1)
k1 = torch.randn(B, H, N, D, device="cuda", dtype=torch.float16)
k2 = torch.randn_like(k1)
v = torch.randn_like(k1)

out = piecewise_attention(q1, k1, q2, k2, v, dist_threshold=32, causal=True)
```

对于 query 行 `m` 与 key 列 `n`，当右下对齐的有符号偏移 `N - M + m - n >= dist_threshold` 时算子使用 `q2 @ k2`，否则使用 `q1 @ k1`。反向会把 `dScore` 拆分到两套 Q/K 上。所有输入的 head 数一致（不支持 GQA），`D` 取值为 `16`、`32`、`64` 或 `128`。

Piecewise Attention 为 NLPE（Non-Linearized Position Embedding）引入，Aquila-2-34B 用它在线性位置表示之外按距离阈值切换位置表示。

## 推理与稀疏注意力

### Split-KV 与 paged attention

```python
from flag_attn import flash_attention_split_kv, paged_attention
```

`flash_attention_split_kv` 是面向长 KV 场景的显式前向 API，接受 `q: [B,Hq,M,D]` 与 `k/v: [B,Hkv,N,D]`，要求 `Hq % Hkv == 0`，并支持 `D` 取 `{16,32,64,128}`。选择多个 split 时，各 split 计算局部输出与 log-normalizer，再由第二个 kernel 通过全局 logsumexp 合并。

`paged_attention` 接受 paged KV cache 与逐序列元数据：

```text
query:        [num_sequences, num_query_heads, head_size]
key_cache:    [num_blocks, num_kv_heads, block_size, head_size]
value_cache:  [num_blocks, num_kv_heads, block_size, head_size]
context_lens: [num_sequences]
block_tables: [num_sequences, max_blocks_per_sequence]
```

实现会自动在单次遍历与分块归约两种方案之间选择，也可用 `num_splits` 覆盖。支持的 head size 为 `{16,32,64,128,256,512}`；当 `num_query_heads > num_kv_heads` 时，cache block size 至少为 16 个 token。

### MiniMax M3 稀疏注意力

M3 路径使用 vLLM 兼容的 paged cache，稀疏 block 固定为 128 个 token：

```text
Prefill: minimax_m3_index_score
      -> minimax_m3_index_topk
      -> minimax_m3_sparse_attn

Decode: minimax_m3_index_decode（打分 + top-k）
     -> minimax_m3_sparse_attn_decode

仅打分 decode API: minimax_m3_index_decode_score
```

稀疏 attention kernel 支持 GQA 与 BF16 KV cache，在支持的硬件上支持 FP8 cache scaling。这些函数仅用于推理，使用调用方提供的 paged cache、序列元数据与 block tables。

### SageAttention

```python
import torch
from flag_attn.sage_attention import forward as sage_attention
from flag_attn.sage_attention import per_block_int8

B, H, N, D = 1, 2, 128, 64
q = torch.randn(B, H, N, D, device="cuda", dtype=torch.float16)
k = torch.randn_like(q)
v = torch.randn_like(q)

q_int8, q_scale, k_int8, k_scale = per_block_int8(q, k, tensor_layout="HND")
out, lse = sage_attention(q_int8, k_int8, v, q_scale, k_scale, tensor_layout="HND", return_lse=True)
```

同时支持 `HND`（`[B,H,N,D]`）与 `NHD`（`[B,N,H,D]`）布局。默认情况下 Q 按 128 个 token 分块量化，K 按 64 个 token 分块量化。前向 kernel 接受布尔或加性 attention mask。

## 递归与线性注意力

GLA、GDN2 与 KDA 使用 sequence-first 的 `[B,T,H,D]`。Gated Delta Rule 默认 `head_first=True`，即 head-first 的 `[B,H,T,D]`，同时接受 sequence-first 输入。多数递归 API 返回 `(output, final_state)`，并通过 `cu_seqlens` 支持 packed 变长序列。

- `chunk_gla` 实现带 autograd、可选初始/最终递归状态的分块 gated linear attention。
- `chunk_gated_delta_rule` 提供仅前向的 delta-rule 实现；`BT` 当前固定为 64。
- `chunk_gdn2` 在原生 Triton、TLE 与厂商特定 GDN2 前向路径之间分派。
- `chunk_kda` 是推理 API；通用 CUDA 路径要求 Triton TLE 3.6 或更高版本、推理模式、BF16 输入、`K=V=128`、chunk size 16、V-first 状态与 gate 参数，各厂商实现可能不同。
- `parallel_nsa` 包含 Native Sparse Attention 的选择与压缩算子，支持定长与 packed 变长输入。

以上 alpha API 针对特定模型布局做过优化。集成前请阅读各算子的 docstring 与测试；参数与后端约束可能变化。

## 设备选择

```python
import flag_attn

print(flag_attn.vendor_name)  # 例如 "nvidia"、"metax"、"enflame"
print(flag_attn.device)       # 例如 "cuda"、"gcu"、"npu"
print(flag_attn.backend_info) # 结构化的 DeviceDetector 对象
```

后端路由是逐算子的：顶层 GDN2/KDA API 会选择燧原、MetaX 与摩尔线程的专用实现，MiniMax M3 会选择其 MetaX 实现。能够识别后端并不表示每个算子都已在该后端实现或验证。

## 测试与基准

安装开发依赖后，无需探测加速器即可列出算子清单：

```sh
python tools/run_tests.py --list-ops --stages all
```

运行精度测试与 benchmark：

```sh
pytest tests
python tools/run_tests.py --stages stable --gpus 0 --skip-benchmarks
python tools/run_tests.py --stages all --gpus all --dump-output
```

稠密算子与 FP32 PyTorch 参考实现对比。精度判定要求 Triton 结果相对 FP32 参考的误差不超过同精度 PyTorch 误差的约两倍，并留有小量绝对余量。
