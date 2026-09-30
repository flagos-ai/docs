# FlagFFT Overview

FlagFFT is an experimental C++ FFT library with a cuFFT-style API and Triton/TLE-generated CUDA kernels. The public runtime interface is C; Python is retained only for Triton/TLE JIT source generation (internal codegen).

FlagFFT is part of the [FlagOS](https://flagos.io/) ecosystem and provides high-performance FFT computations for scientific computing, signal processing, and machine learning workloads.

## Features

- **cuFFT-style API** — Familiar planning and execution interface for developers migrating from cuFFT.
- **JIT kernel compilation** — Kernels are generated at plan creation time via Triton/TLE, eliminating Python compilation latency at execution time.
- **Arbitrary-length 1D and 2D transforms** — Supports arbitrary composite lengths via fused four-step routes, including very large sizes (e.g., n = 2^23) without falling back to Bluestein. 2D FFT supports all six transform types.
- **Multiple transform types** — C2C, Z2Z (complex), R2C, D2Z, C2R, Z2D (real-to-complex and reverse).
- **Plan description** — `flagfftGetPlanDescription` returns detailed information about the plan node tree, kernel names, and compilation details for performance debugging.
- **Native CLI** — `flagfft-cli` provides benchmark measurement and plan inspection without Python overhead.

## Architecture

### C++ Runtime

| Module | Description |
|---|---|
| `include/flagfft.h` | cuFFT-style opaque handle API, backend-neutral `flagfftStream_t` |
| `src/exec/` | `flagfftHandle` lifecycle, plan creation, stream state, plan cache, raw pointer exec dispatch |
| `src/plan/` | Maps `FFTRequest` to `PlanNode` tree — node, factorization, cost, auto-candidate, tune-candidate |
| `src/codegen/` | Invokes Python Triton/TLE source generation during plan creation, compiles via libtriton_jit |
| `python/flagfft_codegen/` | Pip-installable source generator and bundled codelets |
| `src/adaptor/` | Device allocation, stream/event operations, target identity, capability queries (CUDA Driver backend) |
| `src/utils/` | Shared request/key utilities, JSON/SQLite tuning support |

### Raw Execution Nodes

- `CompiledRawLeafNode` — Launches contiguous leaf kernel with plan-owned twiddle and DFT table allocations.
- `CompiledRawFourStepFusedNode` — Four-step routes with row and column leaf children, owns twiddle and intermediate buffer.
- `CompiledRawBluesteinNode` — Prime and awkward composite lengths via JIT prepare, pointwise, finalize, and convolution FFT child kernels.
- `CompiledRaw2DNode` — Contiguous complex 2D plans with RTRT route (row FFT → tiled transpose → row FFT → tiled transpose back).

### CLI Tools

`src/cli_tools/common/` owns `CaseSpec`, deterministic buffer generation, FlagFFT/cuFFT dispatch, and comparison. cuFFT is used only in the CLI as the CUDA validation/performance oracle.

- `bench` — Binds FlagFFT and cuFFT reference plans to one adaptor stream before warmup and timing.
- `tune` — Placeholder; exits with `FLAGFFT_NOT_SUPPORTED`.

### Build Options

| Option | Default | Description |
|---|---|---|
| `FLAGFFT_BUILD_CLI` | `OFF` | Build `flagfft-cli` and its cuFFT dependency |
| `FLAGFFT_BUILD_TESTS` | `OFF` | Build Google Test targets under `ctest/` |
| `BACKEND` | `CUDA` | GPU backend selector (only `CUDA` is currently supported) |

### Python Boundary

The native runtime invokes `python -m flagfft_codegen.jit_source`; the chosen Python environment must supply compatible Triton/TLE dependencies. Generated JIT source/metadata live in `.flagfft` beside the executable.

### Tests

- `ctest/` — Google Test accuracy tests for all operators.
- `tools/run_tests.py` — Unified test runner orchestrating accuracy and performance testing across multiple GPUs.
- `tests/python/` — Code generation tests.

## Workflow

1. Create an FFT plan with `flagfftPlan1d` (or `flagfftPlanMany` for batched transforms).
2. Optionally attach a CUDA stream with `flagfftSetStream`.
3. Execute the transform with `flagfftExec*` functions.
4. Destroy the plan with `flagfftDestroy`.
