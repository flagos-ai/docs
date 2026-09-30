# Architecture

PyTorch-Plugin-FL registers one PyTorch device and routes every operator that reaches it.

![PyTorch-Plugin-FL architecture](../assets/images/pytorch-plugin-fl.png)

```text
PyTorch API
    |
flagos device (PrivateUse1)
    |
device runtime + per-operator routing
    |
FlagGems/compiler kernels | compatibility boxing | vendor-native kernels | CPU fallback
    |
accelerator runtime
```

## Device registration

At import, PyTorch-Plugin-FL claims the `PrivateUse1` dispatch key and publishes it under the name `flagos`:

1. `torch.utils.rename_privateuse1_backend("flagos")` names the key.
2. `torch._register_device_module("flagos", flagos)` installs the device module, so `torch.flagos.*` works.
3. `torch.utils.generate_methods_for_privateuse1_backend(for_storage=True)` generates tensor and storage methods such as `.to("flagos")`.
4. The device module is also published as `torch_flagos` in `sys.modules`, satisfying `torch::utils::device_lazy_init`'s lookup by module name on platforms that trigger lazy init.

The native extension (`torch_fl._C`) registers the `AutogradPrivateUse1` fallback and the operator implementations when it is loaded. Because that registration happens at `dlopen` time, the plugin checks that `PrivateUse1` is still unclaimed *before* loading it, and fails with an actionable message instead of an uncatchable abort when another vendor plugin has already claimed the key.

## Import-time phases

`import torch_fl` runs a fixed sequence of side effects. The order is load-bearing — a wrong order produces a `dlopen` abort or a wrong-vendor build rather than a Python exception — so it lives in one place:

| Phase | What it does |
|---|---|
| 1. conf | Selects the operator-routing table for this build; stages the MetaX `libcudart` shim when enabled |
| 2. preload | Selects and preloads the vendor libtorch and CUDA assets before `import torch` |
| 3. claim | Imports `torch`, verifies the vendor runtime, claims `PrivateUse1`, loads `_C`, installs the device module |
| 4. vendor_compat | Installs vendor runtime shims and resolves the FlagGems vendor (`GEMS_VENDOR`) |
| 5. ecosystem | FlagGems registration prep, CUDA alias, distributed/DDP/DataParallel, compile backends |

Two constraints are worth knowing when debugging an import: the vendor libtorch must be in place before `import torch`, and the `PrivateUse1` ownership check must precede the `_C` load.

## Component layout

| Path | Responsibility |
|---|---|
| `torch_fl/__init__.py` | Import-time phase pipeline, device module installation, ecosystem patches |
| `torch_fl/_env.py` | Single registry and reader for every `FLAGOS_*` variable |
| `torch_fl/flagos/` | Device module: streams, events, RNG, AMP, memory, meta kernels for tracing |
| `torch_fl/configs/` | Per-platform routing tables, `backends_<platform>.conf` |
| `torch_fl/accelerator/` | Per-vendor compatibility shims and runtime glue |
| `torch_fl/compile/` | Inductor backend, FlagTree shims, platform profiles, Triton guards |
| `torch_fl/comm/` | `ProcessGroupFlagOS` |
| `torch_fl/distributed.py` | `init_process_group`, `DistributedDataParallel`, buffer movement helpers |
| `torch_fl/quantization/` | Low-precision formats, conversion and modules |
| `torch_fl/tileops/` | Python side of the TileOps operator library (lazy import) |
| `torch_fl/compat/` | Apex and flex-attention compatibility layers |
| `csrc/aten/` | ATen layer: dispatcher, boxing, generated bindings, vendor backends |
| `csrc/runtime/` | Device runtime: allocators, guard, generator, per-accelerator sources |
| `csrc/profiler/` | Vendor-agnostic device tracer interface and per-vendor tracers |
| `csrc/include/flagos.h` | Unified runtime ABI (memory, stream, device, current-stream registry) |
| `scripts/codegen/` | Operator-binding generators (CUDA boxing, ACLNN, topsaten, mudnn, TileOps) |
| `scripts/tools/` | Preflight/validation tooling, including `torch-fl-preflight` |
| `tests/unit`, `tests/integration`, `tests/manual`, `tests/perf` | Unit, hardware, manual and benchmark suites |

## Operator dispatch

Operator implementations are reached through one dispatch key and one routing table:

- The generated bindings under `csrc/aten/generated/` provide the CUDA-boxing kernels, the FlagGems Python and C++ callers, and the TileOps stubs, all registered against `PrivateUse1`.
- `csrc/aten/common.cc` reads the routing table at first dispatch: the table PyTorch-Plugin-FL selected for its build, or the file named by `FLAGOS_BACKEND_CONFIG`.
- Vendor-native kernels live under `csrc/aten/backends/<vendor>/` and are generated for the operator surface that vendor library actually exports; operations the generator cannot match are skipped with a warning and fall through to routing or CPU fallback.
- Unrouted operators reach `cpu_fallback`, which runs the CPU reference implementation and copies the result back to the device.

Routing decisions are reported per operator with `FLAGOS_LOG=dispatch`, and the table actually in use is reported by `torch_fl.backend_config_path()`.
