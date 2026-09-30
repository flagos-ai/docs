# Environment Variables

PyTorch-Plugin-FL has one namespace of its own, `FLAGOS_*`, plus a second set belonging to other projects (torch, FlagGems, FlagCX, TileLang, vendor SDKs) that it reads but does not own. This page documents the variables a user configures; the authoritative, complete list is the `VARIABLES` registry in `torch_fl/_env.py`, checked against the upstream `docs/reference/environment-variables.md` by a unit test.

Nothing here is required to run a wheel: a wheel routes, compiles and runs with an empty environment. These variables select a different build, override a setting for measurement, or turn on a diagnostic.

## How a value is read

- **Booleans**: `1`/`true`/`on`/`yes` (any case) are on; `0`/`false`/`off`/`no` are off. Anything else is not a boolean — a warning is printed once and the variable's default is used instead of treating the value as truthy.
- **Empty means unset**: `FLAGOS_LOG=${EXTRA_LOG}` with `EXTRA_LOG` unset behaves as if `FLAGOS_LOG` were never exported, so a switch that defaults on stays on.
- **Enums**: a switch naming a mode rather than a boolean reports the alternatives and uses the default when given a value outside them.
- **Unknown names**: `import torch_fl` scans the environment once and warns about any `FLAGOS_*` name that is neither declared nor part of the dynamic `FLAGOS_OP_<op>` family — a misspelled switch would otherwise be read by nobody and silently do nothing.

## Build selection

Inputs to `setup.py` and the CMake build; nothing at runtime reads them. The wheel records what it was built with, and that record is what runtime readers consult.

| Variable | Default | Purpose |
|---|---|---|
| `FLAGOS_ACCELERATOR` | `cuda` | Platform the wheel is built for: `cuda`, `ppu`, `metax`, `ascend`, `tsingmicro`, `dcu`, `gcu`, `musa`, `bpu` |
| `FLAGOS_BUILD_VENDOR` | `ON`, `OFF` on `metax` | Compile the vendor's native kernels (no-op where the vendor ships none) |
| `FLAGOS_BUILD_FLAGGEMS` | `ON`, `OFF` on `bpu` | Compile the FlagGems Python kernel wrappers |
| `FLAGOS_BUILD_FLAGGEMS_CPP` | `ON` on `cuda`, `tsingmicro` | Compile the FlagGems C++ wrapper (`liboperators.so`) |
| `FLAGOS_BUILD_BOXING` | `ON`, `OFF` on `ascend`, `gcu`, `musa` | Compile the generated CUDA-boxing kernels |
| `FLAGOS_BUILD_TILEOPS` | `ON` on `cuda` | Compile the TileOps kernel wrappers (TileLang, SM90 NVIDIA) |
| `FLAGOS_BUILD_JOBS` | CPU count | Parallel jobs for the CMake build |
| `FLAGOS_WHEEL_LOCAL` | SDK-derived | Local version label, e.g. `metax3.8.1` |
| `FLAGOS_SKIP_CUDA_ASSETS` | `0` | Do not bundle an external `libtorch_cuda.so` |
| `FLAGOS_CUDA_ASSETS_DIR` | `.libtorch_cuda_assets` | Directory the external `libtorch_cuda.so` is copied from |
| `FLAGOS_DCU_VENDOR_CORE` | `0` | Use DTK's forked core libraries instead of the official PyTorch core (must match at build and import time) |

An explicit value that contradicts a per-platform forced value is rejected with an error naming both, rather than letting whichever flag CMake saw last win.

## Operator routing

Which backend implementation each operator dispatches to. Routing is stated per operator in a generated table, `torch_fl/configs/backends_<platform>.conf`; the variables below override or widen it.

| Variable | Default | Purpose |
|---|---|---|
| `FLAGOS_BACKEND_CONFIG` | none | Absolute path to a `backends_*.conf` file; overrides the table selected from the build record. For testing and debugging |
| `FLAGOS_OP_<name>` | none | Per-operator override, e.g. `FLAGOS_OP_add__Tensor=cuda` (replace `.` with `__`) |
| `FLAGOS_FORCE_BACKEND` | none | Repin every operator onto one backend family (`flaggems`, `vendor`, `tileops`) for A/B measurement |
| `FLAGOS_DISABLE_FLAGGEMS_PY` | `0` | Leave the FlagGems Python layer unregistered (C++ stub-only mode) |

`torch_fl.backend_config_path()` reports the table in use; `FLAGOS_BACKEND_CONFIG` holds only what the user exported, so reading it answers "did I override the table?".

## Runtime diagnostics

| Variable | Default | Purpose |
|---|---|---|
| `FLAGOS_LOG` | none | Comma-separated stderr diagnostics: `dispatch` (backend chosen per operator), `fallback` (each CPU-fallback dispatch), `op_cache` (Ascend operator-cache statistics) |
| `FLAGOS_TRACE` | `0` | Verbose logging in the device profiler shim |
| `FLAGOS_TRACER_LIBRARY` | auto-discovered | Override the tracer library the profiler shim loads |

## Distributed

| Variable | Default | Purpose |
|---|---|---|
| `FLAGOS_DIST_REDIRECT_GLOO` | `1` | Answer a plain `init_process_group(backend="gloo")` or `new_group` request with the flagos backend when the process accelerator is the flagos device |
| `FLAGOS_DIST_STAGED_GLOO` | `1` | Allow the host-staged gloo inner backend, the last fallback tier when no vendor communicator is available. Set `0` to fail loudly instead of staging |
| `FLAGOS_DIST_FORCE_NCCL` | `0` | In the manual MetaX distributed tests, skip FlagCX and use NCCL |

## Vendor and framework compatibility

Import-time shims that adapt a vendor runtime or another framework to the `flagos` device. None is needed on a stock CUDA box.

| Variable | Default | Purpose |
|---|---|---|
| `FLAGOS_ALIAS_CUDA` | `1` | Alias the `cuda` device string to `flagos` for drop-in compatibility. Set `0` to opt out |
| `FLAGOS_DISABLE_CUDA_SHIM` | `0` | Skip registering the `torch.cuda` compatibility shim for generic GPU operations |
| `FLAGOS_METAX_CUDART_SHIM` | `0` | Preload the `libcudart` version-tag shim before `import torch`; needed on MetaX with generic PyTorch wheels |
| `FLAGOS_METAX_COMPAT` | `0` | Patch FlagGems `torch.cuda` device queries for MetaX compatibility |
| `FLAGOS_DCU_HIP_VERSION` | none | Override HIP version detection for the DCU runtime |
| `FLAGOS_DCU_SKIP_RUNTIME_CHECK` | `0` | Skip the DCU post-import checks, for deliberately testing a non-matching wheel pair |
| `FLAGOS_DCU_SDPA_FLASH` | `1` | On DCU, point DTK's SDPA selector at its CUTLASS flash adapter instead of the math decomposition |
| `FLAGOS_DISABLE_APEX_COMPAT` | `0` | Disable the optional Apex multi-tensor compatibility layer |
| `FLAGOS_DISABLE_QWENIMAGE_ROPE` | `0` | Leave `diffusers`' Qwen-Image rotary-embedding table alone, to measure the difference |
| `FLAGOS_DISABLE_FLEX_ATTENTION_COMPAT` | `0` | Leave flex-attention's hard-coded `{cuda, cpu, xpu, hpu}` device gate in place |

## Assets, libraries and compilation

| Variable | Default | Purpose |
|---|---|---|
| `FLAGOS_DISABLE_CUDA_ASSETS` | `0` | Skip preloading the bundled `libtorch_cuda.so` and CUDA libraries (for in-tree builds and for PPU) |
| `FLAGOS_VENDOR_TORCH_LIB` | auto-discovered | Path to the vendor torch's `lib` directory when no bundled vendor libtorch is present |
| `FLAGOS_USE_CACHING_ALLOCATOR` | `1` | Caching device allocator; set `0` to hand every allocation to the vendor runtime |
| `FLAGOS_USE_FLAGTREE` | `0` | Assert that a FlagTree build is the active Triton (required on Ascend when the compiler is FlagTree) |
| `FLAGOS_COMPILE_FALLBACK_EAGER` | `0` | Fall back to eager mode when `torch.compile` meets unsupported operations |
| `FLAGOS_TILEOPS_USE_L2` | `0` | Use the TileOps L2-cache tier |
| `FLAGOS_TILEOPS_CACHE_MAX` | `512` | TileOps instance-cache capacity |
| `FLAGOS_TILEOPS_DISABLE_ALL_CACHE` | `0` | Neutralize every TileLang cache (correct but slow; set before `tileops` is imported) |

## BPU compiler

The BPU graph path compiles through `hbdk4` on an x86 host. `FLAGOS_BPU_MARCH` selects the micro-architecture (`nash-p`, `nash-e`, `nash-m`), `FLAGOS_BPU_QUANTIZE` (on by default) keeps convolution on the device by inserting int8 quantization, `FLAGOS_BPU_CACHE` sets the compiler cache directory, and `FLAGOS_BPU_X86_PYTHON` / `FLAGOS_BPU_X86_EMULATOR` / `FLAGOS_BPU_X86_STUBS` describe the x86 host and emulator used for on-board compilation.

The complete variable list — including the interoperability names owned by other projects, the codegen-only inputs, and retired names kept inert — is maintained in the upstream repository at `docs/reference/environment-variables.md`, alongside the registry in `torch_fl/_env.py` that the documentation is checked against.
