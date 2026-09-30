# Arm64

## 概述

Arm64 是 TLE-CPU 首个完整实现的后端，目标平台为 Arm v9-A（NEON / SVE2 + i8mm + bf16），参考硬件为 CIX P1（CD8180，8× Cortex-A720 大核 + 4× A520 小核）。

软件基线：Triton 3.3 / LLVM a66376b0 / PyTorch 2.10 (CPU) / Python 3.11。

- **编译器层**：Arm 指令选择和线程管理优化可向上游 Triton-CPU 贡献，使普通 `tl.dot` 在 Arm 上正确且高效。

- **算子层**：将解码热点封装为 6 个 TLE 扩展操作 `create_cpu_*`。

### Arm64 lowering 路径

扩展操作经过 TritonCPU 方言后，根据 lowering 方式分为两条路径：

```Plain Text
flagtree-cpu  （TritonCPU MLIR 方言，分为两条 lowering 路径 ↓）
             ┌───────────┴───────────┐
    融合 / GEMV 类型（6 个扩展操作）           通用 Triton 算子
    → 调用 libTritonCPURuntime.so                (tl.load / tl.dot / …)
      （预编译的 NEON/SVE2 C 内核）                → LLVM codegen → ISA 指令
```

- 融合 / GEMV 类型（6 个）：lowering 为对预编译的 `libTritonCPURuntime.so`（NEON/SVE2 C 内核）的调用

- 通用 Triton 算子（`tl.load / tl.dot / …`）：通过 LLVM codegen 生成 ISA 指令；i8mm / SVE2 等的指令选择由编译器层优化处理。

- Arm64 CPU 后端还包括启用 TLE 所需的后端工作：可向上游贡献的 Triton-CPU i8mm/BF16 指令选择、OMP 线程调优、codegen 修复。这些与 TLE 扩展操作是正交的（后者通过运行时库而非编译器 codegen）。

## TLE 扩展操作

Arm64 后端注册了 6 个扩展操作，覆盖 GEMV / 归一化 / 激活 / 注意力等解码热点，每个对应一个命名的张量操作。在 `@triton.jit` 中通过 `triton.language.extra.cpu.tle_ops` 调用。

### 扩展操作汇总

| 类别 | 扩展操作（签名） | 用途 / 语义 |
|---|---|---|
| 打包 | `sdot_pack_weights(b_ptr, b_packed_ptr, K, N)` | INT8 权重 `[K,N]` 行主序 → SDOT 格式 `[K//4,N//4,4,4]`；离线/加载时一次性完成，供 GEMV 复用 |
| GEMV | `sdot_gemv(a_ptr, b_packed_ptr, c_ptr, K, N)` | M=1 INT8 GEMV（K 外层 + NEON SDOT，N 维 OMP）；`C[N]=A[K]@B_packed`（int32 累加）；调用运行时 `sdot_gemv_m1_prepacked()` |
| GEMV | `sdot_gemv_fused_bf16(x_ptr, b_packed_ptr, w_scale_ptr, out_ptr, K, N)` | BF16 动态量化 → SDOT GEMV → 反量化回 BF16，一次完成；W8A8 动态量化解码主路径 |
| 归一化 | `rms_norm(x_ptr, weight_ptr, out_ptr, D, eps)` | `out = x/√(mean(x²)+eps)·weight`；单个 NEON 内核替代 5 个分解的 ATen 操作 |
| 激活 | `swiglu(gate_ptr, up_ptr, out_ptr, N)` | `out = silu(gate)·up`；替代 2 个 ATen 调用 |
| 融合 | `flash_attn_decode(q_ptr, k_ptr, v_ptr, out_ptr, seq_len, head_dim, sm_scale, num_heads, num_kv_heads, stride_kn, stride_vn)` | M=1 Flash Attention，在线 softmax，head 维 OMP，GQA；替代 ATen SDPA 回退 |

### 数据约定

- **激活 / 输出**：bf16；例外：`sdot_gemv` 输出 `c_ptr` 为 int32。

- **打包权重**：int8，SDOT 格式 `[K//4,N//4,4,4]`

- **逐通道权重缩放因子**：fp32 `[N]`。

- **单线程最优阈值**：`rms_norm` D ≤ 4096，`swiglu` N ≤ 6144（典型解码维度）。

- **flash_attn 形状**：`q [num_heads, head_dim]`，`k/v [num_kv_heads, seq_len, head_dim]`，

`sm_scale` 通常为 `head_dim^-0.5`。

- **精度**：GEMV 扩展操作实现 W8A8-dynamic（逐通道 int8 权重 + fp32 缩放因子 + 激活动态量化），量化逻辑内联在 `sdot_gemv_fused_bf16` 中，全程使用 i8mm SDOT。

## 使用示例

`rms_norm` 端到端（`@triton.jit` → `create_cpu_rms_norm` → NEON 运行时）：

```Python
import torch, triton, triton.language as tl
from triton.language.extra.cpu import tle_ops as tle_cpu

@triton.jit
def rms_kernel(x_ptr, w_ptr, out_ptr, D: tl.constexpr, eps: tl.constexpr):
    tle_cpu.rms_norm(x_ptr, w_ptr, out_ptr, D, eps)

D = 128
torch.manual_seed(0)
x = torch.randn(D, dtype=torch.bfloat16)
w = torch.randn(D, dtype=torch.bfloat16)
out = torch.empty(D, dtype=torch.bfloat16)
rms_kernel[(1,)](x, w, out, D, 1e-6)
# 预期最大误差 ≈ 0.0143（bf16 精度，确定性）
```

W8A8 解码主路径 `sdot_gemv_fused_bf16`：

```Python
@triton.jit
def mlp_down_kernel(x_ptr, w_packed_ptr, w_scale_ptr, out_ptr,
                    K: tl.constexpr, N: tl.constexpr):
    tle_cpu.sdot_gemv_fused_bf16(x_ptr, w_packed_ptr, w_scale_ptr, out_ptr, K, N)
```

## 设计要点：调度即性能

解码瓶颈往往不是算力，而是算子调度次数（纯 ATen 基线约每个 token 数千次调度）。加速有两个正交的维度：

| 维度 | 方法 | 收益 | 状态 |
|---|---|---|---|
| 每次调用更快 | 算子级扩展操作（`rms_norm` / `swiglu` / `sdot_gemv*` / `flash_attn_decode`） | NEON/i8mm 加速每次调用，每个替代多个 ATen 操作 | 已实现（本页 6 个） |
| 调用次数更少 | 将整个层/步骤融合为一个，调度 → ≈层数 → 1 | 消除调度开销 | 应由 CPU 融合 pass 完成，而非单体 C 操作 |

### 线程模型与调优

**线程模型**：并行由 TLE 运行时自行管理。在通过 torch 执行推理的场景中（如 HF Transformers），

计算密集型部分的线程级并行在 TLE 运行时内核内部启动——`runtime_*.cpp` 中的 `#pragma omp parallel`，沿 N 维度 / head 维度分区——而非通过 torch 的 `at::parallel_for` 或其 intra-op 线程池。两项配置确保 TLE 的 OMP 不与 torch 争抢核心：

- **`TORCH_NUM_THREADS=1`**：禁用 torch 自身的 intra-op 并行，将所有物理核心交给 TLE 运行时的 OMP。

- **单一 OMP 运行时**：`build.py` 显式链接 torch 自带的 `libgomp`，确保进程内只有一个 OMP 运行时，避免"torch 和运行时各自派生 N 个 OMP 线程，总共 2N 个线程争抢核心"的过度订阅场景。

- **线程级并行的启动和控制完全由 TLE 负责**：基于以上原因，线程级并行的启动和控制完全由 TLE 负责（运行时内核中的 OMP 区域）；torch 仅处理模型编排（Python 前向传播、算子调度）和张量管理，不涉及线程级并行。

**调优（环境变量 / 核心绑定）：**

- **`GOMP_SPINCOUNT=infinity`**（OMP 线程忙等，不休眠）：单条解码端到端最大增益（实测 Qwen3.5 2B/4B +33% / +39%）。

- **big.LITTLE 仅绑定大核**（`taskset -c 0,1,6,7,8,9,10,11`）：小核混入 OMP 线程池会在屏障处停滞，整体性能最多受限 2 倍。

- **内存分配器与线程亲和性**（纯性能项，不改变计算结果）：`LD_PRELOAD` jemalloc 减少多线程内存分配中的锁竞争和碎片；`OMP_PLACES=cores` + `OMP_PROC_BIND=close` 将 OMP 线程绑定到物理核心，防止线程迁移并保持缓存亲和性。

- **并发上限（CIX P1 平台）**：解码存在不可并行的串行段（实测约 30%）。根据阿姆达尔定律，当线程数 N→∞ 时加速比上限 ≈ 1/0.3 ≈ 3.3×，因此增加线程的边际收益迅速递减；叠加 big.LITTLE 小核屏障惩罚（见上文），最优并发 ≈ 大核数量（8），超过则会降低性能。
