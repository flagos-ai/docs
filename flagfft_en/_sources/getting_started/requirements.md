# Requirements

## Hardware

- NVIDIA GPU with CUDA support.

## Dependencies

You can prepare a docker environment with the following dependencies. For more information, see [Quick Start](/getting_started/install.md).

### Required dependencies

| Dependency | Minimum Version | Notes |
|---|---|---|
| CMake | 3.18 | Build system |
| C++ compiler | C++20 support | GCC 11+, Clang 14+ |
| Python | 3.12 | JIT codegen + test runner |
| flagtree | 0.5.0 | Triton TLE support |
| SQLite3 | — | Tuning database |
| CUDA Toolkit | 12.x | cudart, cuFFT (for test adaptor/benchmarks) |
| libtriton_jit | submodule | Triton JIT compiler (`deps/libtriton_jit`) |
| PyYAML | — | Test runner (`pip install pyyaml`) |

### Optional dependencies

| Dependency | Purpose |
|---|---|
| Google Test | C++ unit tests (auto-fetched via FetchContent when `FLAGFFT_BUILD_TESTS=ON`) |
| Ninja | Faster build backend (`cmake -G Ninja`) |
| pytest | Python codegen tests |

## Submodule

```bash
git submodule update --init --recursive
```

This pulls in `deps/libtriton_jit`, which provides the Triton JIT compiler and `nlohmann_json`. For more information, see [Quick Start](/getting_started/install.md).
