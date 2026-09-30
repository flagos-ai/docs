# Features

## One device, standard PyTorch APIs

Every supported accelerator is programmed through the `flagos` device. Model code, optimizers, and third-party libraries keep using standard PyTorch APIs; moving between accelerators does not require changing tensor device strings, kernel launches, or the model.

The device module is installed at import time with `torch.utils.rename_privateuse1_backend("flagos")` and `torch._register_device_module()`, so `device="flagos"`, `torch.flagos.*` methods, tensor methods, and storage work the same way as a first-class PyTorch device.

## Per-operator backend routing

Each built wheel ships one routing table, `torch_fl/configs/backends_<platform>.conf`, holding `op = backend` entries for the platform it was built for. Routing is decided per operator — not per device or per model — and can mix backends inside one model:

| Route family | Serves the operator with |
|---|---|
| `flagos_python` | FlagGems Triton kernels through the Python dispatcher |
| FlagGems C++ (`kFlagOs`) | FlagGems kernels through the C++ runtime, `liboperators.so` |
| `cuda` | CUDA compatibility-boxing kernels over an external or vendor `libtorch_cuda.so` |
| Vendor native (`ascend`, `gcu`, `musa`, …) | The vendor operator library (ACLNN, topsaten, mudnn, …) |
| `tileops` | TileOps/TileLang kernels (SM90 NVIDIA parts) |
| `cpu_fallback` | A correctness-first CPU implementation, copied back to the device |

Two runtime variables change routing without rebuilding:

- `FLAGOS_BACKEND_CONFIG` — point the process at a different routing table.
- `FLAGOS_OP_<op>` — override one operator, e.g. `FLAGOS_OP_add__Tensor=cuda`.
- `FLAGOS_FORCE_BACKEND` — repin every operator onto one backend family (`flaggems`, `vendor`, `tileops`) for A/B measurement.

Current routing is always queryable: `torch_fl.backend_config_path()` reports the table in use.

## Execution paths

PyTorch-Plugin-FL implements four operator execution strategies, and a platform may combine several of them. These are implementation strategies, not user-selectable product tiers.

- **Native vendor kernels** — direct calls into the vendor runtime and operator libraries (ACLNN for Ascend, topsaten for Enflame GCU, mudnn for Moore Threads MUSA). The plugin generates bindings to each vendor's C/C++ API.
- **Compatibility boxing** — zero-copy metadata conversion into an independent PyTorch dispatch key when the vendor stack exposes one that can coexist with `PrivateUse1`. CUDA boxing reuses NVIDIA kernels through an external `libtorch_cuda.so`; MetaX, PPU and Hygon DCU box their vendor torch builds the same way.
- **Portable compiler kernels** — FlagGems kernels generated through Triton or a compatible compiler backend (FlagTree), targeting multiple accelerator families without per-platform rewrites.
- **Explicit CPU fallback** — operators without a device kernel run on the CPU where PyTorch semantics permit. Coverage is documented per platform rather than presented as complete native support.

## Device runtime and management API

The `torch.flagos` module exposes a complete device interface:

- Streams (`Stream`, `current_stream`, `stream`) and events (`Event`)
- Device queries: `device_count`, `current_device`, `set_device`, `get_device_properties`
- Synchronization: `synchronize`
- RNG: `manual_seed`, `manual_seed_all`, `get_rng_state`, `set_rng_state`, `initial_seed`
- Autocast: `get_amp_supported_dtype`
- Memory: `memory_allocated`, `memory_reserved`, `memory_stats`, `reset_peak_memory_stats`, `empty_cache`

Device memory uses the rental/caching allocator by default (`FLAGOS_USE_CACHING_ALLOCATOR`, on by default), with `FLAGOS_USE_CACHING_ALLOCATOR=0` handing every allocation straight to the vendor runtime.

## Training stack

- **Eager execution and autograd** — forward and backward paths run on the device; `AutogradPrivateUse1` fallbacks are registered by the native extension.
- **`torch.autocast("flagos")` and `torch.amp.GradScaler("flagos")`** — FP16 and BF16 targets, with the standard PyTorch autocast policy groups.
- **`torch.compile`** — Inductor integration registering `flagos` as a first-class GPU device; see {doc}`torch.compile integration <../architecture/torch-compile>`.
- **Distributed** — `ProcessGroupFlagOS`, DDP, DataParallel and FSDP2 support; see {doc}`Distributed collectives <../architecture/distributed>`.

## Low-precision and quantization

`torch_fl.quantization` provides low-precision conversion helpers and modules:

- `convert`, `FormatSpec`, `LowPrecisionFormat`, `get_format_spec`, `normalize_format`, `supported_formats`
- `SoftLowpLinear` — a linear layer that decodes low-precision weights before the matrix multiply

On CUDA-boxing vendors shared by DCU and MetaX, the software low-precision matrix path (`soft_lowp`) serves `mm`, `bmm` and `addmm` for scalar FP8 formats (`float8_e4m3fn`, `float8_e5m2`, `float8_e4m3fnuz`, `float8_e5m2fnuz`, `float8_e8m0fnu`) and packed FP4 (`float4_e2m1fn_x2`). Values are decoded and accumulated in BF16: an unspecified output dtype defaults to BF16, an explicit one is honored. Block-scaled metadata formats (MXFP4, NVFP4, block FP4) and `_scaled_mm` families are outside that path.

## Framework and ecosystem compatibility

Import-time shims adapt other projects' assumptions about the device, all of them optional and measurable through their own switch:

- **Apex** — the common `MultiTensorApply` entry point is patched so Apex's `amp_C` kernels receive zero-copy CUDA views of flagos tensors.
- **`torch.nn.attention.flex_attention`** — the hard-coded `{cuda, cpu, xpu, hpu}` device gate is relaxed for the `flagos` device; the fused template is reachable through the `flagos` compile backend.
- **`diffusers` Qwen-Image rotary embedding** — the `flagos` device is registered on both halves of the per-device RoPE table, keeping the rotation off the complex-exponential path `diffusers` would otherwise take on GCU and Ascend.
- **CUDA alias** — with `FLAGOS_ALIAS_CUDA` on by default, a `cuda` device string is accepted as `flagos`, so unmodified CUDA scripts run against the `flagos` device.

## Observability

- **Dispatch and fallback logging** — `FLAGOS_LOG=dispatch,fallback` prints the backend chosen per operator and every CPU-fallback dispatch.
- **Profiler** — `torch.profiler` collects a device timeline with flow arrows, per-operator device time, kernel metadata and runtime event names; see {doc}`Profiler integration <../architecture/profiler>`.
- **Wheel compatibility manifest** — every wheel carries `torch_fl/compatibility.json` recording the platform, kernel sets, bundled libtorch, build-time PyTorch and ABI, and observed FlagTree/FlagGems/FlagCX versions. The `torch-fl-preflight` CLI inspects it before a native extension is imported.
- **Unknown-variable warning** — `import torch_fl` scans the environment once and warns about misspelled `FLAGOS_*` names instead of silently ignoring them.

## Hardware support

| Platform | Execution path | Validated capabilities | Status |
|---|---|---|---|
| NVIDIA CUDA | CUDA boxing over an external `libtorch_cuda.so` | Eager, autograd, distributed (FlagCX/NCCL), profiler (CUPTI), FlagGems (Python + C++) | Stable |
| MetaX | CUDA boxing via cu-bridge against the vendor libtorch | Eager, autograd, AMP, low-precision matrix ops | Stable |
| Ascend | Native ACLNN backend, FlagGems via FlagTree (Triton 3.5) | Eager, autograd, RNG suite, profiler (MSPTI) | Beta |
| PPU | CUDA boxing against the PPU CUDA-13-compatible SDK | Eager, autograd, AMP | Experimental |
| Hygon DCU | CUDA boxing over the hipified DTK torch | Eager, autograd, FP16/BF16 AMP, profiler | Beta |
| Enflame GCU | Native topsaten backend, CPU fallback for unrouted/int64/float64 ops | Eager, AMP | Beta |
| Moore Threads MUSA | FlagGems-first Triton kernels, native mudnn fallback, CPU fallback | Eager, FP16/BF16 AMP | Experimental |
| D-Robotics BPU | No eager kernels; `torch.compile` graph path via hbdk4 | Graph compilation only | Runtime only |
| TsingMicro | Runtime build selector exists | No per-operator kernel set documented | Runtime only |

Per-capability detail — including `torch.compile`, distributed and profiler status per platform — is in the {doc}`compatibility matrix <../reference/compatibility>`.
