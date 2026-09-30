# Arm64

## Overview

Arm64 is the first fully implemented backend for TLE-CPU, targeting the Arm v9-A platform (NEON / SVE2 + i8mm + bf16), with reference hardware CIX P1 (CD8180, 8× Cortex-A720 big cores + 4× A520 little cores).

Software baseline: Triton 3.3 / LLVM a66376b0 / PyTorch 2.10 (CPU) / Python 3.11.

- **Compiler layer**: Arm instruction selection and thread management optimizations upstreamable to Triton-CPU, making plain `tl.dot` correct and efficient on Arm.

- **Operator layer**: Encapsulating decode hotspots into 6 TLE extension operations `create_cpu_*`.

### Arm64 lowering path

Extension operations, after passing through the TritonCPU dialect, split into two paths based on lowering:

```Plain Text
flagtree-cpu  (TritonCPU MLIR dialect, splits into two lowering paths ↓)
             ┌───────────┴───────────┐
    Fused / GEMV type (6 extension ops)           General Triton Ops
    → Call libTritonCPURuntime.so                (tl.load / tl.dot / …)
      (precompiled NEON/SVE2 C kernels)           → LLVM codegen → ISA instructions
```

- Fused / GEMV type (6): Lowered to calls into the precompiled `libTritonCPURuntime.so` (NEON/SVE2 C kernels)

- General Triton ops (`tl.load / tl.dot / …`): Generate ISA instructions via LLVM codegen; instruction selection for i8mm / SVE2 etc. is handled by compiler layer optimizations.

- The Arm64 CPU backend also includes backend work to enable TLE: upstreamable Triton-CPU i8mm/BF16 instruction selection, OMP thread tuning, codegen fixes. These are orthogonal to TLE extension ops (the latter go through the runtime library, not compiler codegen).

## TLE extension operations

The Arm64 backend registers 6 extension operations covering decode hotspots such as GEMV / normalization / activation / attention, each corresponding to a named tensor operation. Called within `@triton.jit` via `triton.language.extra.cpu.tle_ops`.

### Extension Operations Summary

| Category | Extension Operation (Signature) | Purpose / Semantics |
|---|---|---|
| Packing | `sdot_pack_weights(b_ptr, b_packed_ptr, K, N)` | INT8 weights `[K,N]` row-major → SDOT format `[K//4,N//4,4,4]`; done once offline/at load time, reused by GEMV |
| GEMV | `sdot_gemv(a_ptr, b_packed_ptr, c_ptr, K, N)` | M=1 INT8 GEMV (K-outer + NEON SDOT, N-dim OMP); `C[N]=A[K]@B_packed` (int32 accumulation); calls runtime `sdot_gemv_m1_prepacked()` |
| GEMV | `sdot_gemv_fused_bf16(x_ptr, b_packed_ptr, w_scale_ptr, out_ptr, K, N)` | BF16 dynamic quantization → SDOT GEMV → dequantize back to BF16 in one pass; W8A8-dynamic decode main path |
| Normalization | `rms_norm(x_ptr, weight_ptr, out_ptr, D, eps)` | `out = x/√(mean(x²)+eps)·weight`; single NEON kernel replaces 5 decomposed ATen ops |
| Activation | `swiglu(gate_ptr, up_ptr, out_ptr, N)` | `out = silu(gate)·up`; replaces 2 ATen calls |
| Fusion | `flash_attn_decode(q_ptr, k_ptr, v_ptr, out_ptr, seq_len, head_dim, sm_scale, num_heads, num_kv_heads, stride_kn, stride_vn)` | M=1 Flash Attention, online softmax, head-dim OMP, GQA; replaces ATen SDPA fallback |

### Data conventions

- **Activation / Output**: bf16; exception: `sdot_gemv` output `c_ptr` is int32.

- **Packed Weights**: int8, SDOT format `[K//4,N//4,4,4]`

- **Per-channel Weight Scale**: fp32 `[N]`.

- **Single-thread Optimal Threshold**: `rms_norm` D ≤ 4096, `swiglu` N ≤ 6144 (typical decode dimensions).

- **flash_attn Shapes**: `q [num_heads, head_dim]`, `k/v [num_kv_heads, seq_len, head_dim]`,

`sm_scale` typically `head_dim^-0.5`.

- **Precision**: GEMV extension ops implement W8A8-dynamic (per-channel int8 weights + fp32 scale + activation dynamic quantization), quantization logic inlined in `sdot_gemv_fused_bf16`, using i8mm SDOT throughout.

## Usage examples

`rms_norm` end-to-end (`@triton.jit` → `create_cpu_rms_norm` → NEON runtime):

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
# Expected max err ≈ 0.0143 (bf16 precision, deterministic)
```

W8A8 decode main path `sdot_gemv_fused_bf16`:

```Python
@triton.jit
def mlp_down_kernel(x_ptr, w_packed_ptr, w_scale_ptr, out_ptr,
                    K: tl.constexpr, N: tl.constexpr):
    tle_cpu.sdot_gemv_fused_bf16(x_ptr, w_packed_ptr, w_scale_ptr, out_ptr, K, N)
```

## Design essentials: Dispatch is performance

The decode bottleneck is often not compute power but operator dispatch count (pure ATen baseline ~ thousands of dispatches per token). Acceleration has two orthogonal axes:

| Axis | Approach | Benefit | Status |
|---|---|---|---|
| Faster per call | Op-level extension ops (`rms_norm` / `swiglu` / `sdot_gemv*` / `flash_attn_decode`) | NEON/i8mm accelerates each call, each replaces several ATen ops | Implemented (6 in this page) |
| Fewer calls | Fuse entire layers/steps into one, dispatch → ≈layers → 1 | Eliminates dispatch overhead | Should be done by CPU fusion pass, not monolithic C ops |

### Thread model and tuning

**Thread Model**: Parallelism is self-managed by the TLE runtime. In scenarios where inference is executed through torch (e.g., HF Transformers),

multi-threaded parallelism for compute-intensive parts is initiated inside the TLE runtime kernel — `#pragma omp parallel` in `runtime_*.cpp`, partitioned along the N dimension / head dimension — not through torch's `at::parallel_for` or its intra-op thread pool. Two configurations ensure TLE's OMP does not contend for cores with torch:

- **`TORCH_NUM_THREADS=1`**: Disables torch's own intra-op parallelism, giving all physical cores to the TLE runtime's OMP.

- **Single OMP runtime**: `build.py` explicitly links torch's bundled `libgomp`, ensuring only one OMP runtime exists within the process, avoiding the oversubscription scenario where "torch and runtime each spawn N OMP threads, totaling 2N contending for cores."

- **initiation and control of thread-level parallelism rests entirely with TLE**：Because above, the initiation and control of thread-level parallelism rests entirely with TLE (the OMP regions in runtime kernels); torch only handles model orchestration (Python forward pass, operator scheduling) and tensor management, not thread-level parallelism.

**Tuning (env / core binding):**

- **`GOMP_SPINCOUNT=infinity`** (OMP threads busy-wait, no sleeping): Largest single-item decode E2E gain (measured Qwen3.5 2B/4B +33% / +39%).

- **big.LITTLE bind big cores only** (`taskset -c 0,1,6,7,8,9,10,11`): Little cores mixed into the OMP thread pool stall at barriers, constraining overall performance by up to 2×.

- **Memory allocator and thread affinity** (pure performance items that do not change computation results): `LD_PRELOAD` jemalloc reduces lock contention and fragmentation in multi-threaded memory allocation; `OMP_PLACES=cores` + `OMP_PROC_BIND=close` binds OMP threads to physical cores, preventing thread migration and maintaining cache affinity.

- **Concurrency ceiling (CIX P1 platform)**: Decode has non-parallelizable serial segments (measured at ~30%). By Amdahl's Law, as thread count N→∞ the speedup ceiling ≈ 1/0.3 ≈ 3.3×, so marginal benefit of adding threads diminishes rapidly; compounded by big.LITTLE little-core barrier penalty (see above), optimal concurrency ≈ big core count (8), exceeding it degrades performance.