# Installation

FlagPrism is built as part of the FlagTree wheel via the `third_party/FlagPrism` submodule. It is not published as a standalone package.

## Prerequisites

- A FlagTree source checkout with the FlagPrism submodule.
- A supported backend toolchain:
  - Debugger dynamic collection: Ascend/CANN, Tianshu/CoreX, Moore Threads MUSA, or NVIDIA CUDA.
  - Profiler: NVIDIA CUDA, AMD ROCm, Ascend CANN, Moore Threads MUSA, or Tianshu CoreX.
- Build dependencies required by FlagTree (LLVM/MLIR, Python build tooling).

## Build with FlagTree

From the FlagTree repository root:

```bash
git submodule update --init --recursive
python -m pip wheel . --no-build-isolation
```

This builds the FlagTree core, Debugger, and Profiler in one CMake graph and packages them into a single FlagTree wheel.

Build examples for each vendor:

```bash
# Ascend
FLAGTREE_BACKEND=ascend TRITON_BUILD_FLAGPRISM=ON MAX_JOBS=16 \
python -m pip install . --no-build-isolation

# Tianshu-only (excludes Ascend/CANN sources, uses the Tianshu/CoreX runtime path)
FLAGPRISM_BACKEND=tianshu TRITON_BUILD_FLAGPRISM=ON \
python -m pip install . --no-build-isolation

# Moore Threads
FLAGTREE_BACKEND=mthreads FLAGPRISM_BACKEND=mthreads \
TRITON_BUILD_FLAGPRISM=ON python -m pip install . --no-build-isolation

# NVIDIA-only (CUDA/CUPTI path, no ROCm headers or libraries required)
FLAGTREE_BACKEND=nvidia FLAGPRISM_BACKEND=nvidia \
TRITON_BUILD_FLAGPRISM=ON python -m pip install . --no-build-isolation
```

For development, an editable install is supported:

```bash
python3 -m pip install -e . --no-build-isolation --no-deps
```

## Build switches

| Variable | Values | Effect |
| --- | --- | --- |
| `TRITON_BUILD_FLAGPRISM` | `ON` (default), `OFF` | Builds the combined Debugger+Profiler suite, or produces a core-only wheel. This is the only component switch; the two tools cannot be enabled independently. |
| `FLAGPRISM_BACKEND` | e.g. `tianshu`, `mthreads`, `nvidia` | Selects a vendor backend; for example `tianshu` builds only Tianshu/CoreX adaptations and does not probe or link Ascend CANN. |
| `FLAGTREE_BACKEND` | e.g. `ascend` | Selects the FlagTree target backend used for the build. |

## Verifying the install

```python
import flagtree.debugger as debugger
import flagtree.profiler as profiler

print("debugger available:", debugger.is_available())
print("profiler imported:", profiler is not None)
```

A core-only wheel (`TRITON_BUILD_FLAGPRISM=OFF`) does not include `flagtree.debugger`. Use `debugger.is_available()` to check whether both the compiler and runtime native bindings are present.

## Requirements

- Python 3.10+
- PyTorch (with vendor extensions such as `torch_npu` for Ascend, where applicable)
- A Triton/FlagTree-compatible device and driver for the selected backend
