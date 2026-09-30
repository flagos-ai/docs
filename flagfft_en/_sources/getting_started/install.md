# Install FlagFFT

## Quick Start

Clone, build, and verify in one go:

```sh
# 1. Clone
git clone https://github.com/flagos-ai/FlagFFT.git
cd FlagFFT

# 2. Initialize submodule
git submodule update --init --recursive

# 3. Build the library, CLI, and test binaries
cmake -B build -DCMAKE_BUILD_TYPE=Release \
      -DFLAGFFT_BUILD_CLI=ON \
      -DFLAGFFT_BUILD_TESTS=ON
cmake --build build -j$(nproc)

# 4. Install the Python codegen package (required for JIT kernel generation)
pip install .

# 5. Run the full accuracy + performance test suite
python tools/run_tests.py --combination full --gpus 0
```

The runner prints a live progress table and writes `summary.json` with per-operator accuracy (pass/fail) and performance (geometric mean speedup vs cuFFT) results.

## Build Options

| Option | Default | Description |
|---|---|---|
| `FLAGFFT_BUILD_CLI` | `OFF` | Build the `flagfft-cli` benchmark/verification tool |
| `FLAGFFT_BUILD_TESTS` | `OFF` | Build the C++ test suite (requires Google Test + CUDA) |
| `BACKEND` | `CUDA` | GPU backend selector (only `CUDA` is currently supported) |
| `CMAKE_BUILD_TYPE` | — | `Release`, `Debug`, `RelWithDebInfo` |

### Build Library Only

```sh
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)
```

This produces `build/libflagfft.so`.

### Build Library + CLI + Tests

```sh
cmake -B build -DCMAKE_BUILD_TYPE=Release \
      -DFLAGFFT_BUILD_CLI=ON \
      -DFLAGFFT_BUILD_TESTS=ON
cmake --build build -j$(nproc)
```

## Install to System (Optional)

After building, install the library and tools system-wide:

```sh
cmake --install build --prefix /usr/local
```

Installs `libflagfft.so` to `lib/`, the public header `flagfft.h` to `include/`, and `flagfft-cli` to `bin/` (if built with `-DFLAGFFT_BUILD_CLI=ON`).

## Use Docker

A pre-built environment with all dependencies is available as an alternative to manual setup:

```sh
docker build -t flagfft-dev -f docker/Dockerfile .
docker run --gpus all -v $(pwd):/workspace/FlagFFT -it flagfft-dev
# Inside the container, run the build and test steps from Quick Start.
```

## Set Environment Variables

| Variable | Description |
|---|---|
| `FLAGFFT_PYTHON` | Path to the Python interpreter used by JIT codegen (default: `python3` from PATH) |
| `FLAGFFT_TUNE_DB` | Path to the SQLite tuning database (default: `~/.flagfft/tune.db`) |
| `FLAGFFT_TUNE_DISABLE` | Set to `1` to disable tuned plan lookup and always use auto-selected plans |
