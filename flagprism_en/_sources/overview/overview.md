# Overview

FlagPrism is a multi-backend debugging and performance-analysis toolkit for Triton programs. It provides a consistent observability workflow across NVIDIA GPUs and diverse AI accelerators: it observes Triton kernels at both compile time and runtime, connects source-level context with Triton IR operations and device events, and turns the collected data into reports that help developers understand correctness, memory behavior, and performance across heterogeneous backends.

## Components

- **Debugger** (`Debugger/`) — Python and native implementation of `flagtree.debugger`. It captures values, numerical summaries, memory-address summaries, complete tensor data, and statement/operation metadata from selected regions inside `@triton.jit` kernels.
- **Profiler** (`Profiler/`) — Python package, native runtime, and CLI for `flagtree.profiler`. It records execution context, timelines, operation counts, estimated bytes, hardware metrics, and vendor-profiler data, and aggregates them into tree, timeline, Hatchet, metadata, and vendor-specific outputs.
- **`cmake/FlagPrism.cmake`** — central CMake build policy and target integration for both components.
- **`python/flagprism_build.py`** — package, CLI, and CMake argument policy for the unified wheel.

## Backend support

The following matrix tracks the FlagPrism enablement roadmap. It describes Debugger and Profiler integration, not the availability of the corresponding FlagTree compiler backend.

| Vendor | Status |
| --- | --- |
| NVIDIA | In progress (target: September 2026) |
| Huawei Ascend | Supported |
| Moore Threads | Merging |
| MetaX | Not started (target: October 2026) |
| ILUVATAR | Supported |
| Enflame | In progress (target: September 2026) |

The Debugger dynamic collection and hidden-argument launch path is validated on Ascend/CANN9, Tianshu/CoreX 4.4 (LLVM 22), MUSA/mthreads 4.3.5, and NVIDIA CUDA.

The Profiler supports the `nvidia`, `cupti`, `roctracer`, `instrumentation`, `cann`, `mthreads`, and `tianshu` backends.

## Relationship to FlagTree

FlagTree is a unified, multi-backend compiler that enables Triton programs to run across diverse AI accelerators. FlagPrism complements FlagTree with observability tools that help developers debug kernel correctness, analyze runtime behavior, identify performance bottlenecks, and optimize Triton workloads.

FlagTree consumes FlagPrism as the `third_party/FlagPrism` submodule. The standalone `flagtree-debugger` and `flagtree-profiler` wheels are no longer published. Running `pip wheel .` from the FlagTree repository builds the core, Debugger, and Profiler in one CMake graph and packages them into a single FlagTree wheel:

- Debugger sources install as `flagtree.debugger`.
- `Profiler/python/flagtree_profiler` installs as `flagtree.profiler`.
- Both components place their `_native` extensions in the same wheel.

The Debugger compiler plugin links into `libtriton`; its runtime transport and decoding live in the standalone `flagtree.debugger._native` extension, which does not link against `libtriton`.

## Build modes

The Python wheel supports exactly two build modes:

1. **Combined build (default)** — Debugger and Profiler built together (`TRITON_BUILD_FLAGPRISM=ON`).
2. **Core-only build** — `TRITON_BUILD_FLAGPRISM=OFF`; neither tool package is included.

The two components cannot be enabled or disabled independently. `TRITON_BUILD_FLAGPRISM` is the only component build switch. A vendor backend can be selected with `FLAGPRISM_BACKEND` (for example `tianshu`).

## Status

FlagPrism is delivered through the FlagTree submodule and installed as part of the FlagTree wheel.
