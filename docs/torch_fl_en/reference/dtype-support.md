# Dtype support

Torch-FL preserves the requested dtype for tensor **storage** and follows PyTorch's promotion rules for tensor-tensor operations. Compute coverage is bounded by the vendor library each backend uses, and AMP target support is a separate question from eager dtype support: a dtype the storage layer accepts is not automatically accepted by every operator.

## Storage and compute

| Backend | Storage and copies | Eager elementwise | Matmul family |
|---|---|---|---|
| NVIDIA CUDA | Native PyTorch CUDA dtype support | Native CUDA coverage | Native CUDA coverage |
| MetaX (boxing) | MACA libtorch CUDA-compatible coverage; FP8 and packed FP4 storage | MACA libtorch CUDA-compatible coverage | MACA coverage, plus software-emulated FP8 / packed FP4 `mm`/`bmm`/`addmm` |
| Hygon DCU | Vendor library coverage | Vendor library coverage | Vendor library coverage |
| Ascend | float16, bfloat16, float32, float64, integer, uint8, bool | Vendor coverage; unsupported ACLNN combinations use the CPU fallback | float16, bfloat16, float32 natively; float64 and unsupported types use the CPU fallback |
| Enflame GCU | float16, bfloat16, float32, float64, integer, bool | topsaten coverage; int64, float64 and unrouted operations use the CPU fallback | float16, bfloat16, float32 |
| Moore Threads MUSA | float16, bfloat16, float32, float64, integer, bool | mudnn coverage; unrouted operations use the CPU fallback | float16, bfloat16, float32 |

## AMP targets

`torch.autocast("flagos")` supports `torch.float16` and `torch.bfloat16` as lower-precision targets, using the standard PyTorch autocast policy groups: matmul and convolution prefer the selected lower-precision dtype, numerically sensitive operations (logarithm, normalization) use float32, and mixed inputs follow the promote policy. **Float32 and float64 are not valid autocast targets.**

| Backend | AMP targets | Notes |
|---|---|---|
| NVIDIA CUDA | float16, bfloat16 | |
| MetaX (boxing) | float16, bfloat16 | Measured in CUDA-boxing mode; the legacy handwritten kernel mode is not covered |
| Hygon DCU | Backend-dependent | |
| Ascend | float16, bfloat16 | float64 is storable and works elementwise, but is neither an AMP target nor accepted by the native matmul API |
| Enflame GCU | float16, bfloat16 | |
| Moore Threads MUSA | float16, bfloat16 | |

## Boundaries

Where a vendor operator does not accept a dtype, the operator is served by the correctness-first CPU fallback, which computes on the host and copies the correctly typed result back to the device. The fallback is correctness-oriented and may be slower than a native kernel — it is a documented coverage boundary, not a failure.

- **Ascend** — `aclnnMatmul`, `aclnnMm` and `aclnnBatchMatMul` reject float64 and integer inputs; those go through the fallback. `aclnnNeg` rejects int16, uint8 and bool. float64 storage, device copies, casts and elementwise operations stay float64 end to end. Complex and quantized dtypes are outside the supported contract.
- **Enflame GCU** — topsaten has no float64 and no int64 kernels, so both are stored natively but computed on the CPU. `topsatenNeg` additionally rejects uint8 and bool. Convolution follows the native topsaten path forward and the CPU fallback backward.
- **Moore Threads MUSA** — `GradScaler`'s unscale operation uses the correctness-oriented fallback (list and scalar operands are moved to CPU, the reference kernel runs, and the mutated values plus `found_inf` are copied back) rather than a native foreach kernel.
- **MetaX** — the low-precision matrix path is software emulation of *scalar* FP8 (`float8_e4m3fn`, `float8_e5m2`, `float8_e4m3fnuz`, `float8_e5m2fnuz`, `float8_e8m0fnu`) and packed FP4 (`float4_e2m1fn_x2`) for `mm`, `bmm` and `addmm`, including the `dtype`/`out` variants. Values decode and accumulate in BF16, so an unspecified output dtype defaults to BF16 and an explicit one is honored. Block-scaled metadata formats (MXFP4, NVFP4, block FP4) and the `_scaled_mm` families are **not** included.

## What a passing test means

The integration suites compare results against CPU references where a native kernel is unavailable, so a passing test means the operation follows the documented PyTorch contract — not necessarily that it used a native vendor kernel.
