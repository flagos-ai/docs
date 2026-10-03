# Platform capability matrix

What each `FLAGOS_ACCELERATOR` value actually provides: which operator path its wheels build, where its device runtime comes from, and which routing decisions it makes by default. This is the per-platform answer to "does my accelerator support X at all", one level below the {doc}`compatibility matrix <compatibility>` (which reports validation status per capability).

## Operator path

| Platform | `FLAGOS_ACCELERATOR` | Operator path | Device runtime sources | Native vendor kernel tree | Status |
|---|---|---|---|---|---|
| NVIDIA CUDA | `cuda` (default) | Native CUDA, FlagGems, generated CUDA boxing | `cuda` | — (uses CUDA/FlagGems paths) | Stable |
| PPU | `ppu` | CUDA-ABI boxing against the bundled PPU libtorch | `cuda` + bundled `lib_ppu/` | — (boxing only) | Experimental |
| MetaX | `metax` | CUDA-ABI boxing against the bundled MACA libtorch | `metax` | — (handwritten MetaX kernels retired) | Stable |
| Hygon DCU | `dcu` | CUDA-ABI boxing over the hipified DTK torch | `cuda` + DCU DTK-core ABI shim | — (boxing only) | Beta |
| Ascend | `ascend` | Vendor-native (ACLNN) with FlagGems via FlagTree | `ascend` | `ascend` | Beta |
| Enflame GCU | `gcu` | Vendor-native (topsaten) | `gcu` | `gcu` | Beta |
| Moore Threads MUSA | `musa` | Vendor-native (mudnn) | `musa` | `musa` | Experimental |
| TsingMicro | `tsingmicro` | CUDA-ABI boxing (Kuiper SDK) | `tsingmicro` | — | Runtime only |
| D-Robotics BPU | `bpu` | No per-operator kernels; whole-graph compilation | `bpu` | — | Runtime only |

## Kernel sets

`FLAGOS_BUILD_*` switches decide which kernel sets a wheel compiles. Which are on by default is a property of the platform, not a per-build choice:

| Kernel set | What it provides |
|---|---|
| `vendor` | The platform's native operator tree, where one exists |
| `flaggems` | The FlagGems Python (Triton) dispatch path |
| `flaggems_cpp` | The FlagGems C++ path (`liboperators.so`) |
| `boxing` | Generated CUDA-boxing kernels for CUDA-ABI platforms |
| `tileops` | TileOps/TileLang kernels for SM90 NVIDIA parts |

A wheel records the sets it was built with; runtime readers consult that record rather than the environment, so an exported `FLAGOS_BUILD_*` cannot make a wheel describe itself wrongly. See the {doc}`environment variable reference <environment-variables>` for the per-platform defaults.

## Intentional asymmetries

These are design decisions, not gaps waiting to be filled:

- **BPU** has no per-operator kernels at all: eager operators reach the CPU fallback, and acceleration comes from `torch.compile(backend="bpu")`, which compiles a whole graph.
- **TsingMicro** is a build target with a runtime selector but no documented per-operator kernel set and no install guide.
- **MUSA** exposes its own accelerator directory for stream/event wrappers only — it has no `torch.cuda`-style compatibility module, so code that reaches for `torch.cuda.*` device queries on MUSA does not get a translation layer.
- **PPU** profiles through CUPTI but emits no `gpu_memset` activity, so its memset-related profiler parity cases are out of scope rather than failing.
- **CUDA boxing is shared** by CUDA, MetaX, PPU and DCU: one generated kernel set, four vendor runtime sources.

## Device runtime and Python layers

| Layer | Where it lives | Note |
|---|---|---|
| Generated ATen bindings | `csrc/aten/generated/` | Registered against `PrivateUse1`; the CUDA/boxing and FlagGems callers |
| Vendor-native kernels | `csrc/aten/backends/<vendor>/` | Generated per the operator surface the vendor library actually exports |
| Device runtime | `csrc/runtime/accelerator/<dir>/` | DCU and PPU reuse the CUDA runtime tree and add their own pieces |
| Python device module | `torch_fl/flagos/` | Streams, events, RNG, AMP, memory, meta kernels |
| Routing tables | `torch_fl/configs/backends_<platform>.conf` | One `op = backend` entry per operator |
