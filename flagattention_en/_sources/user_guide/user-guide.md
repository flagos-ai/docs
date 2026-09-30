# User Guide

## Dense attention

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

The complete interface is:

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

`Hq` must be divisible by `Hkv`, and `D` must be one of `16`, `32`, `64` or `128`. Rectangular causal attention is bottom-right aligned. The implementation automatically selects the regular or split-KV forward path according to GPU occupancy.

When any auxiliary-return flag is enabled, the function always returns five values; disabled fields are `None`:

```python
out, lse, total, seed, offset = flash_attention(
    q, k, v,
    return_log_normalizer=True,
    return_total_attention=True,
)
```

- `lse`: `[B, Hq, M]`, the row log-normalizer.
- `total`: `[B, Hq, N]`, attention probabilities summed over the query axis.
- `seed` and `offset`: Philox state when dropout is active and requested.

Dropout is not supported when the occupancy heuristic selects the split-KV path. Use a non-split shape or `dropout_p=0` for those workloads.

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

For query row `m` and key column `n`, the operator uses `q2 @ k2` when the signed, bottom-right-aligned offset `N - M + m - n >= dist_threshold`; otherwise it uses `q1 @ k1`. Backward splits `dScore` across both Q/K pairs. All inputs have the same head count (no GQA), and `D` is one of `16`, `32`, `64` or `128`.

Piecewise Attention was introduced for NLPE (Non-Linearized Position Embedding), used by Aquila-2-34B to switch positional representations beyond a distance threshold.

## Inference and sparse attention

### Split-KV and paged attention

```python
from flag_attn import flash_attention_split_kv, paged_attention
```

`flash_attention_split_kv` is an explicit forward-only API for long-KV workloads. It accepts `q: [B,Hq,M,D]` and `k/v: [B,Hkv,N,D]`, requires `Hq % Hkv == 0`, and supports `D` in `{16,32,64,128}`. When multiple splits are selected, each computes a partial output and log-normalizer, and a second kernel combines them with a global logsumexp.

`paged_attention` accepts a paged KV cache and per-sequence metadata:

```text
query:        [num_sequences, num_query_heads, head_size]
key_cache:    [num_blocks, num_kv_heads, block_size, head_size]
value_cache:  [num_blocks, num_kv_heads, block_size, head_size]
context_lens: [num_sequences]
block_tables: [num_sequences, max_blocks_per_sequence]
```

It selects a one-pass or partitioned/reduced implementation automatically; `num_splits` can override that choice. Supported head sizes are `{16,32,64,128,256,512}`; when `num_query_heads > num_kv_heads`, the cache block size must be at least 16 tokens.

### MiniMax M3 sparse attention

The M3 path uses a vLLM-compatible paged cache with a fixed sparse block size of 128 tokens:

```text
Prefill: minimax_m3_index_score
      -> minimax_m3_index_topk
      -> minimax_m3_sparse_attn

Decode: minimax_m3_index_decode (score + top-k)
     -> minimax_m3_sparse_attn_decode

Score-only decode API: minimax_m3_index_decode_score
```

The sparse attention kernels support GQA and BF16 KV caches, with FP8 cache scaling on supported hardware. These functions are inference-only and use caller-provided paged caches, sequence metadata and block tables.

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

Both `HND` (`[B,H,N,D]`) and `NHD` (`[B,N,H,D]`) layouts are supported. Q is quantized in 128-token blocks and K in 64-token blocks by default. The forward kernel accepts boolean or additive attention masks.

## Recurrent and linear attention

GLA, GDN2 and KDA use sequence-first `[B,T,H,D]`. Gated Delta Rule defaults to head-first `[B,H,T,D]` with `head_first=True`, and also accepts sequence-first input. Most recurrent APIs return `(output, final_state)` and support packed variable-length sequences through `cu_seqlens`.

- `chunk_gla` implements chunked gated linear attention with autograd and optional initial/final recurrent states.
- `chunk_gated_delta_rule` provides a forward-only delta-rule implementation; `BT` is currently fixed at 64.
- `chunk_gdn2` dispatches between native Triton, TLE and vendor-specific GDN2 forward paths.
- `chunk_kda` is an inference API; the generic CUDA path requires Triton TLE 3.6 or newer, inference mode, BF16 inputs, `K=V=128`, chunk size 16, V-first state and gate parameters, while vendor implementations may differ.
- `parallel_nsa` contains Native Sparse Attention selection and compression operators with fixed-length and packed-variable-length support.

These alpha APIs are optimized for specific model layouts. Read their docstrings and tests before integrating them; arguments and backend constraints may change.

## Device selection

```python
import flag_attn

print(flag_attn.vendor_name)  # for example: "nvidia", "metax", "enflame"
print(flag_attn.device)       # for example: "cuda", "gcu", "npu"
print(flag_attn.backend_info) # structured DeviceDetector object
```

Backend routing is operator-specific. The top-level GDN2/KDA APIs select specialized Enflame, MetaX and Moore Threads implementations; MiniMax M3 selects its MetaX implementation. Recognition does not mean that every operator is implemented or tested on every backend.

## Tests and benchmarks

Install the development dependencies and list the operator inventory without probing an accelerator:

```sh
python tools/run_tests.py --list-ops --stages all
```

Run the accuracy suite and the benchmarks:

```sh
pytest tests
python tools/run_tests.py --stages stable --gpus 0 --skip-benchmarks
python tools/run_tests.py --stages all --gpus all --dump-output
```

The dense operators are compared against FP32 PyTorch references. Accuracy checks require the Triton error relative to the FP32 reference to be no greater than roughly twice the same-precision PyTorch error, with a small absolute allowance.
