# Installation

## Choose a platform

Each platform is selected by a single build variable, `FLAGOS_ACCELERATOR`, and each platform has its own execution path:

| Platform | `FLAGOS_ACCELERATOR` | Execution path | Status |
|---|---|---|---|
| NVIDIA CUDA | `cuda` (default) | CUDA boxing over an external `libtorch_cuda.so` | Stable |
| MetaX | `metax` | CUDA boxing via `cu-bridge` against the vendor libtorch | Stable |
| Ascend | `ascend` | Native ACLNN operator backend, FlagGems via FlagTree (Triton 3.5) | Beta |
| PPU | `ppu` | Same CUDA-boxing path as NVIDIA CUDA, against the PPU CUDA-13-compatible SDK, bundling its own libtorch | Experimental |
| Hygon DCU | `dcu` | CUDA boxing over the hipified DTK torch build | Beta |
| Enflame GCU | `gcu` | Native `libtopsaten.so` operator backend, with CPU fallback for unrouted/int64/float64 ops | Beta |
| Moore Threads MUSA | `musa` | FlagGems-first Triton kernels, native `mudnn` backend as fallback, CPU fallback for unrouted ops | Experimental |
| D-Robotics BPU | `bpu` | No eager kernel sets are built; eager ops run on CPU, acceleration comes from the graph path | Runtime only |
| TsingMicro | `tsingmicro` | Runtime/build selector present; no per-operator kernel set documented | Runtime only |

## Common requirements

All platforms require:

- **Python**: 3.8 or later (platform SDKs and available wheels may impose a narrower range)
- **PyTorch**: 2.10.x (`>=2.10,<2.11`) — the generated ATen bindings are tied to this minor line
- **CMake**: 3.18 or later
- **C++ toolchain**: a working C++17 compiler (GCC 7+, Clang 5+, or MSVC 2017+)
- **Platform SDK/runtime**: the vendor-specific SDK, compiler and runtime libraries for your accelerator

Patch releases inside the same PyTorch minor line (for example 2.10.0 to 2.10.1) are compatible. A different minor line (for example 2.11.x) fails at build or run time, because the generated bindings are sensitive to C++ ABI and operator schema changes.

## Source installation contract

Every platform installation follows the same pattern:

```bash
FLAGOS_ACCELERATOR=<platform> pip install --no-build-isolation -e .
```

`--no-build-isolation` is required: without it, pip creates an isolated build environment that cannot see the PyTorch installation and platform SDK in your current environment, and the generated native bindings then link against the wrong torch or fail to find the vendor SDK.

Each platform directory in the upstream repository (`docs/vendors/<platform>/installation.md`) defines the platform's SDK environment variables and any extra build flags. Platform summaries:

### NVIDIA CUDA

```bash
git clone https://github.com/flagos-ai/Torch-FL.git && cd Torch-FL

pip install torch==2.10.0+cpu --index-url https://download.pytorch.org/whl/cpu

FLAGOS_ACCELERATOR=cuda pip install --no-build-isolation -vvv -e .
```

This generates the CUDA-boxing kernels from PyTorch's ATen schema, bundles `libtorch_cuda.so` and the related CUDA dispatcher libraries into `torch_fl/lib/`, and pins matching `nvidia-*-cu12` runtime dependencies. Requirements: an NVIDIA GPU with compute capability 7.0 or later, driver 470 or later, a CUDA 12.x toolkit for the build, plus `cmake`, `ninja` and `patchelf`.

Optional FlagGems C++ dispatch (lowest-overhead FlagGems route):

```bash
FLAGOS_ACCELERATOR=cuda \
  FLAGOS_BUILD_FLAGGEMS_CPP=1 \
  FLAGGEMS_DIR=<path-to-FlagGems>/lib/cmake/FlagGems \
  pip install --no-build-isolation -vvv -e .
```

### MetaX

MetaX ships a self-contained boxing wheel: CUDA-boxing kernels compiled with the host `g++`, plus the MetaX-forked libtorch C++ runtime bundled inside the wheel. The target machine needs only the stock `torch==2.10.0+cpu` wheel, the `torch_fl` wheel, and the `/opt/maca` driver runtime.

The wheel is built on a machine with the full MACA SDK and a `torch+metax` wheel (both from the MetaX developer portal), in three steps: build the boxing artifacts, bundle the forked libtorch with `scripts/vendor/bundle_maca_libtorch.sh`, then repackage the wheel. The result is a large wheel (the bundled libtorch puts it above PyPI's size limit), distributed through a private index or a direct transfer.

On the target host:

```bash
pip install torch==2.10.0+cpu --index-url https://download.pytorch.org/whl/cpu
pip install torch_fl-<version>+<sdk>.whl
```

`FLAGOS_WHEEL_LOCAL` records the target SDK in the wheel's local version label (for example `0.1.0+metax3.8.1`), which keeps two SDK-incompatible wheels from being indistinguishable by filename.

**Import order matters on MetaX**: import `torch_fl` before `import torch`, because PyTorch's bundled CUDA 12.x runtime is ABI-incompatible with MACA's `cu-bridge` and `torch_fl` preloads a shim that supplies the required symbol versions.

### Ascend

```bash
pip install torch==2.10.0 --index-url https://download.pytorch.org/whl/cpu
source /usr/local/Ascend/ascend-toolkit/set_env.sh

FLAGOS_ACCELERATOR=ascend pip install --no-build-isolation -v -e .
```

Requirements: an Ascend 910 with CANN 9.0.0 or compatible, accessible `/dev/davinci*` device nodes, and Python 3.11 if you use the FlagTree Ascend 3.5 wheel (it is cp311-only; Python 3.8+ works for an ACLNN-only build).

The default configuration enables the FlagGems Python route for measured operators, with native ACLNN kernels as the fallback. `scripts/codegen/codegen_ascend.py` generates the ACLNN kernels; operators without an ACLNN mapping fall back to CPU.

FlagGems on Ascend runs on **FlagTree** (the FlagOS Triton fork) on its Ascend 3.5 line. FlagTree installs the module named `triton`, so remove any stock or vendor Triton first, then install FlagTree and FlagGems from the FlagOS index. Nothing in this path imports or links `torch_npu`: the backend installs a lightweight `torch_npu` stub and registers its own `flagos` policy on FlagTree's strategy registry.

**Import order matters on Ascend** too: import `torch_fl` before packages that might register a device backend.

### PPU

PPU presents itself as a CUDA-compatible device: its torch wheel is a full CUDA 13 build and it registers operators under the `CUDA` dispatch key, so no stock `+cpu` wheel and no external `libtorch_cuda.so` are needed.

```bash
FLAGOS_ACCELERATOR=ppu \
  CUDA_HOME=/usr/local/PPU_SDK/CUDA_SDK \
  FLAGOS_BUILD_FLAGGEMS_CPP=OFF \
  FLAGOS_BUILD_FLAGGEMS=OFF \
  FLAGOS_SKIP_CUDA_ASSETS=1 \
  pip install --no-build-isolation -vvv -e .
```

At runtime, export `FLAGOS_DISABLE_CUDA_ASSETS=1` so the import-time preload of a bundled `libtorch_cuda.so` is a no-op (PPU torch provides the runtime itself).

### Hygon DCU

```bash
source /opt/dtk/env.sh

FLAGOS_ACCELERATOR=dcu pip install --no-build-isolation -vvv -e .
```

The build is pure boxing: the DTK torch wheel registers HIP kernels under the `CUDA` dispatch key, generated boxing kernels dispatch into `libtorch_hip.so` unchanged, and runtime sources compile with plain host `g++` — no `nvcc`, `hipcc` or hipify pass. FlagGems Python is on by default; the FlagGems C++ path stays off because DTK ships no `liboperators.so`.

### Enflame GCU

```bash
pip install torch==2.10.0 --index-url https://download.pytorch.org/whl/cpu

FLAGOS_ACCELERATOR=gcu pip install --no-build-isolation -v -e .
```

Requires the TopsRider SDK (`libtopsrt.so` runtime and `libtopsaten.so` operator library). The build runs `scripts/codegen/codegen_gcu.py`, validating each operator against the `topsaten` symbols actually present in the installed `libtopsaten.so`; operators missing from the SDK are skipped with a warning. The `torch-gcu` wheel cannot be used alongside PyTorch-Plugin-FL, because it claims `PrivateUse1` for itself.

### Moore Threads MUSA

```bash
pip install torch==2.10.0 --index-url https://download.pytorch.org/whl/cpu

FLAGOS_ACCELERATOR=musa pip install --no-build-isolation -v -e .
```

Requires the MUSA toolkit under `/usr/local/musa`: `musart` (runtime), `mudnn` (operator library) and `murand` (device RNG). The build runs `scripts/codegen/codegen_mudnn.py`; coverage is the generated operator set plus handwritten convolution kernels, with native RNG kernels and CPU fallback for everything else. `--no-build-isolation` is mandatory here: without it, pip's build overlay resolves its own torch and `import torch_fl` then fails with an undefined `c10` symbol.

### D-Robotics BPU

```bash
pip install torch==2.10.0+cpu --index-url https://download.pytorch.org/whl/cpu
FLAGOS_ACCELERATOR=bpu pip install --no-build-isolation -e .
```

The BPU platform provides runtime acceleration only: no per-operator BPU kernels exist, eager operators run on the CPU via fallback, and acceleration comes from whole-graph compilation (`torch.compile(backend="bpu")`) or from the prebuilt-HBM LLM runtime. Graph compilation needs `hbdk4`, which ships x86_64-only wheels.

## Build-time switches

`setup.py` forces a per-accelerator value for the kernel-set switches and rejects an explicit environment value that contradicts it:

| Variable | Default | Purpose |
|---|---|---|
| `FLAGOS_ACCELERATOR` | `cuda` | Hardware platform the wheel is built for |
| `FLAGOS_BUILD_VENDOR` | `ON`, `OFF` on `metax` | Compile the vendor's native kernels (a no-op where the vendor ships none) |
| `FLAGOS_BUILD_FLAGGEMS` | `ON`, `OFF` on `bpu` | Compile the FlagGems Python kernel wrappers |
| `FLAGOS_BUILD_FLAGGEMS_CPP` | `ON` on `cuda`/`tsingmicro` | Compile the FlagGems C++ wrapper (`liboperators.so`) |
| `FLAGOS_BUILD_BOXING` | `ON`, `OFF` on `ascend`/`gcu`/`musa` | Compile the generated CUDA-boxing kernels |
| `FLAGOS_BUILD_TILEOPS` | `ON` on `cuda` | Compile the TileOps kernel wrappers (SM90 NVIDIA parts) |
| `FLAGOS_BUILD_JOBS` | CPU count | Parallel jobs for the CMake build |
| `FLAGOS_SKIP_CUDA_ASSETS` | `0` | Do not bundle an external `libtorch_cuda.so` |
| `FLAGOS_WHEEL_LOCAL` | SDK-derived | Local version label for the wheel |

The wheel records the accelerator and kernel sets it was built with in `torch_fl/_build_config.py`, and every runtime reader consults that record — a stale exported variable cannot make a wheel describe itself wrongly. Full details of every variable are in the {doc}`environment variable reference <../reference/environment-variables>`.

## Verification

```bash
python -c "
import torch_fl
import torch

print(f'PyTorch version: {torch.__version__}')
print(f'flagos devices: {torch.flagos.device_count()}')
print(f'flagos available: {torch.flagos.is_available()}')

x = torch.randn(4, 4, device='flagos:0')
y = (x @ x).sum()
print(f'Sample result: {y.cpu().item():.4f}')
"
```

A working installation reports the device count of the current machine and a floating-point result. If the count is 0, check the vendor SDK installation, the driver, the device nodes, and the import order rules above.

## Tests

```bash
# Unit tests: no hardware dependency
pytest tests/unit -q

# Operator correctness on the active backend
pytest tests/integration/ops/ -m main_ops -v --tb=short

# Factory operators respect device placement
pytest tests/integration/test_factory_ops.py -v --tb=short
```

Operator tests are selected by markers registered in `tests/integration/ops/conftest.py`:

| Marker | Meaning |
|---|---|
| `main_ops` | Representative operator in the CI smoke subset |
| `anyplatform` | Runs on any accelerator backend |
| `cuda`, `metax`, `ascend`, `musa` | Requires that backend's kernels or hardware |
| `flaggems` | Asserts the FlagGems route from `backends_<platform>.conf` |
| `flaggems_python` | Requires the FlagGems Python wrapper backend |
| `flaggems_cpp` | Requires a wheel built with `FLAGOS_BUILD_FLAGGEMS_CPP=ON` |

Cross-backend contracts (profiler, AMP) are selected with the `profiler*` and `amp*` markers from `tests/integration/conftest.py`; a test needing a capability the active platform does not provide skips with a reason naming the platform.

Test filtering is automatic: the conftest detects the platform from the wheel's build record, the installed platform marker, or the routing table name, and skips tests marked for unavailable backends. Unit tests, model tests and the manual suites are documented in the upstream `docs/development/testing.md`.

## Next steps

- {doc}`Compatibility matrix <../reference/compatibility>` — per-platform capability validation
- {doc}`Environment variables <../reference/environment-variables>` — build and runtime configuration
- {doc}`Distributed collectives <../architecture/distributed>` — `ProcessGroupFlagOS` and FlagCX
- {doc}`Profiler <../architecture/profiler>` — `torch.profiler` integration
- {doc}`torch.compile <../architecture/torch-compile>` — Inductor and FlagTree integration
