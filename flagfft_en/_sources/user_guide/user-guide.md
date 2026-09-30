# FlagFFT User Guide

## Use the C API

FlagFFT exposes a cuFFT-compatible C API in `include/flagfft.h`.

### Create Plans

```c
flagfftPlan1d(plan, nx, type, batch)
flagfftPlan2d(plan, nx, ny, type)
flagfftPlan3d(plan, nx, ny, nz, type)        // NOT_SUPPORTED
flagfftPlanMany(plan, rank, n, inembed, istride, idist,
                onembed, ostride, odist, type, batch)
```

### Execute Transforms

```c
// Complex-to-Complex (single & double precision)
flagfftExecC2C(plan, idata, odata, direction)
flagfftExecZ2Z(plan, idata, odata, direction)

// Real-to-Complex (forward)
flagfftExecR2C(plan, idata, odata)
flagfftExecD2Z(plan, idata, odata)

// Complex-to-Real (inverse)
flagfftExecC2R(plan, idata, odata)
flagfftExecZ2D(plan, idata, odata)
```

### Manage Plans

```c
flagfftSetStream(plan, stream)    // Attach a CUDA stream
flagfftDestroy(plan)              // Free plan resources
flagfftGetPlanDescription(plan)   // Human-readable plan summary
```

### Data Types

| FlagFFT Type | C Type | Description |
|---|---|---|
| `flagfftComplex` | `float2` | Single-precision complex |
| `flagfftDoubleComplex` | `double2` | Double-precision complex |
| `flagfftReal` | `float` | Single-precision real |
| `flagfftDoubleReal` | `double` | Double-precision real |

### Transform Types

| Type Constant | Transform |
|---|---|
| `FLAGFFT_C2C` | Complex → Complex |
| `FLAGFFT_Z2Z` | Double Complex → Double Complex |
| `FLAGFFT_R2C` | Real → Complex |
| `FLAGFFT_D2Z` | Double Real → Double Complex |
| `FLAGFFT_C2R` | Complex → Real |
| `FLAGFFT_Z2D` | Double Complex → Double Real |

### Supported Features

| Feature | Status |
|---|---|
| Rank-1 arbitrary-length C2C, Z2Z | Cooley-Tukey + Bluestein/Rader |
| Rank-1 arbitrary-length R2C, D2Z (forward) | Supported |
| Rank-1 arbitrary-length C2R, Z2D (inverse) | Supported |
| Rank-1 roundtrip (R2C→C2R, D2Z→Z2D) | Supported |
| Rank-2 contiguous row-major C2C, Z2Z | RTRT decomposition |
| Rank-2 contiguous row-major R2C, D2Z, C2R, Z2D | Supported |
| Batched transforms | Supported |
| In-place and out-of-place | Supported |
| CUDA stream attachment | Supported |

### Planned / Not Yet Supported

| Feature | Status |
|---|---|
| Rank-3 transforms (`flagfftPlan3d`) | Returns `FLAGFFT_NOT_SUPPORTED` |
| Rank-2 more exec algos | RTRT only currently |

## Use the Native CLI

`flagfft-cli` is a native benchmark and verification tool. Build it with `-DFLAGFFT_BUILD_CLI=ON`.

### Benchmark FFT Performance

```sh
flagfft-cli bench [OPTIONS]
```

| Option | Default | Description |
|---|---|---|
| `--rank` | `1` | Transform rank: `1` or `2` |
| `--api` | `c2c` | Transform type: `c2c`, `z2z`, `r2c`, `d2z`, `c2r`, `z2d` |
| `--shape` | required | Transform size(s), comma-separated: `1024`, `256x256`, `1024,2048,4096` |
| `--batch` | `1` | Batch size |
| `--direction` | `forward` | `forward` or `inverse` |
| `--placement` | `out-of-place` | `out-of-place` or `in-place` |
| `--warmup` | `10` | Warmup iterations |
| `--iters` | `100` | Measurement iterations |
| `--json` | — | Output results as JSON |
| `--print-path` | — | Print the execution plan decomposition path (use with `--json`) |

Examples:

```sh
# Benchmark 1D C2C FFT of size 4096, batch 256
flagfft-cli bench --api c2c --shape 4096 --batch 256

# Benchmark 2D Z2Z FFT
flagfft-cli bench --rank 2 --api z2z --shape 256x256

# Compare multiple sizes with JSON output
flagfft-cli bench --api r2c --shape 1024,2048,4096,8192 --json

# Print the kernel execution plan
flagfft-cli bench --api c2c --shape 997 --print-path --json
```

### Auto-Tune (planned)

```sh
flagfft-cli tune [OPTIONS]
```

Currently a placeholder; exits with `FLAGFFT_NOT_SUPPORTED`.

### Exit Codes

| Code | Meaning |
|---|---|
| `0` | Passed |
| `1` | Failed / invalid arguments |
| `2` | Runtime error |
| `77` | Skipped / unsupported |

## Run Tests

FlagFFT has three layers of testing: a unified Python test runner, C++ unit tests (Google Test), and Python codegen tests (pytest).

### Use the Unified Test Runner

`tools/run_tests.py` is the primary entry point for running the full test suite. It orchestrates both accuracy tests (C++ ctest binaries comparing FlagFFT output against cuFFT) and performance benchmarks (flagfft-cli bench).

#### Usage

```sh
python tools/run_tests.py [OPTIONS]
```

| Flag | Default | Description |
|---|---|---|
| `--ops` | — | Comma-separated operator IDs to test |
| `--op-list-file` | — | Path to file with one operator ID per line |
| `--start` | — | Skip operators lexicographically before this value |
| `--stages` | `stable` | Comma-separated stages to include (`stable`, `alpha`, `beta`) |
| `--combination` | `ct` | Test combination: `ct`, `bs`, `full`, `2d`, `2d_full` |
| `--gpus` | `0` | Comma-separated GPU IDs or `all` |
| `--output-dir` | `results` | Directory for summary and per-operator result files |
| `--build-dir` | `build` | Path to CMake build directory |
| `--accuracy-only` | — | Run only accuracy tests |
| `--performance-only` | — | Run only performance (benchmark) tests |
| `--timeout` | `600` | Per-test subprocess timeout in seconds |
| `--warmup` | `10` | Benchmark warmup iterations |
| `--iters` | `100` | Benchmark measurement iterations |
| `--dump-output` | — | Save stdout/stderr of each test to log files |
| `--color` | `auto` | Color mode: `auto`, `always`, `never` |
| `-v, --verbose` | — | Verbose output |

#### Combination Presets

| Preset | Description |
|---|---|
| `ct` | Quick smoke test — Cooley-Tukey sizes, batch 1, scale 1.0 |
| `bs` | Quick smoke test — Bluestein/Rader sizes, batch 1, scale 1.0 |
| `full` | Full 1D — all CT sizes × all batches × all scales |
| `2d` | Quick 2D — selected 2D sizes, batch {1,4}, scale 1.0 |
| `2d_full` | Full 2D — selected 2D sizes × all batches × all scales |

#### Examples

```sh
# Quick smoke test (default)
python tools/run_tests.py

# Full test suite on GPU 0
python tools/run_tests.py --combination full --gpus 0

# Full suite across 4 GPUs
python tools/run_tests.py --combination full --gpus 0,1,2,3

# Accuracy only, specific operators
python tools/run_tests.py --combination full --ops c2c_1d,r2c_1d --accuracy-only

# Performance benchmarks only
python tools/run_tests.py --combination full --performance-only
```

#### Output

- Console: Real-time progress with per-GPU status
- `results/summary.json` — Top-level summary with `timestamp`, `env`, `config`, `result`, and `summary` sections
- `results/{op_id}/accuracy_result.json` — Per-operator accuracy details
- `results/{op_id}/performance_result.json` — Per-operator benchmark details

Exit code is `0` if all accuracy tests passed, `1` if any failed.

### Run C++ Tests

Built with `-DFLAGFFT_BUILD_TESTS=ON`. Each test binary compares FlagFFT output against cuFFT using normwise relative error metrics (`rel_l2`, `rel_linf`).

#### Test Structure

| Test Pattern | Coverage |
|---|---|
| `test_plan` | Plan lifecycle, error codes, unsupported API contracts |
| `test_2d_correctness` | Rank-2 C2C/Z2Z correctness |
| `test_exec_c2c_{fwd,inv}_{ct,bs}_{s,b}` | C2C forward/inverse, Cooley-Tukey/Bluestein, single/multi-batch |
| `test_exec_z2z_{fwd,inv}_{ct,bs}_{s,b}` | Double-precision complex |
| `test_exec_r2c_{ct,bs}_{s,b}` | Float real → complex |
| `test_exec_d2z_{ct,bs}_{s,b}` | Double real → complex |
| `test_exec_c2r_{ct,bs}_{s,b}` | Complex → float real |
| `test_exec_z2d_{ct,bs}_{s,b}` | Double complex → double real |
| `test_exec_r2c_c2r_{ct,bs}_{s,b}` | Real roundtrip validation |
| `test_exec_d2z_z2d_{ct,bs}_{s,b}` | Double real roundtrip |

Suffix key: `s` = single-batch, `b` = multi-batch; `ct` = Cooley-Tukey, `bs` = Bluestein/Rader.

#### Run Individual Tests

```sh
# Run a specific test
./build/ctest/test_exec_c2c_fwd_ct_s

# With custom parameters
./build/ctest/test_exec_c2c_fwd_ct_s --nx 4096 --batch 64 --direction forward

# Run all ctest tests
cd build && ctest --output-on-failure
```

Each test binary accepts: `--nx`, `--batch`, `--direction`, `--scale`, `--json-file`.

### Run Python Tests

Tests for the `flagfft_codegen` Python package. Requires the package installed (`pip install .`).

```sh
# Run all Python tests
pytest tests/python/ -v

# Run only codegen-marked tests
pytest tests/python/ -v -m codegen
```

Tests cover codelet structure, kernel source generation, JIT CSV parsing, and Bluestein/reshape/R2C metadata. Tests that require Triton/TLE are automatically skipped when dependencies are unavailable.

### Configure Tests

The test parameter space is defined in `conf/`:

- `conf/operators.yaml` — 14 operator definitions (1D/2D × C2C/Z2Z/R2C/D2Z/C2R/Z2D, plus roundtrip)
- `conf/test_matrix.yaml` — Parameter space: 11 smooth sizes (CT), 4 prime/composite sizes (Bluestein), 3 batch sizes, 3 scale factors, 6 combination rules
