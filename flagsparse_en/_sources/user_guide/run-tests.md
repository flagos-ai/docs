# Running Tests and Benchmarks

## Operator Test Runners

```bash
python run_flagsparse_accuracy.py --list-ops
python run_flagsparse_accuracy.py --mode quick --gpus 0
python run_flagsparse_performance.py --ops spmv_csr,spmm_csr --benchmark-input matrix --benchmark-warmup 5 --benchmark-iters 20
python run_flagsparse_pytest.py --phase both --mode quick --gpus 0 --benchmark-input matrix --results-dir pytest_results
```

## Direct pytest Accuracy Suite

```bash
pytest tests/pytest --mode quick
pytest tests/pytest --mode normal -m "spmv_csr or spmm_csr"
```

## Individual Test Scripts

### test_gather.py / test_scatter.py -- gather/scatter benchmarks

```bash
python tests/test_gather.py --csv-summary gather_summary.csv
python tests/test_scatter.py --csv-summary scatter_summary.csv
```

### test_spmv.py -- CSR SpMV

```bash
python tests/test_spmv.py <dir_or_file.mtx>
python tests/test_spmv.py --synthetic
python tests/test_spmv.py <dir/> --csv-csr results.csv
```

### test_spmv_coo.py -- COO SpMV

```bash
python tests/test_spmv_coo.py <dir_or_file.mtx>
python tests/test_spmv_coo.py --synthetic
python tests/test_spmv_coo.py <dir/> --csv-csr results.csv
```

### test_spmm.py -- CSR SpMM

```bash
python tests/test_spmm.py <dir_or_file.mtx>
python tests/test_spmm.py --synthetic
python tests/test_spmm.py <dir/> --csv results.csv
```

### test_spmm_coo.py -- COO SpMM

```bash
python tests/test_spmm_coo.py <dir_or_file.mtx>
python tests/test_spmm_coo.py --synthetic
python tests/test_spmm_coo.py <dir/> --csv results.csv
```

### test_sddmm.py -- CSR SDDMM

```bash
python tests/test_sddmm.py <dir_or_file.mtx> --k 64
python tests/test_sddmm.py <dir/> --csv out.csv
```

### test_spgemm.py -- CSR SpGEMM

```bash
python tests/test_spgemm.py <dir_or_file.mtx> --input-mode auto
python tests/test_spgemm.py <dir/> --csv results.csv
```

### test_spsv.py -- SpSV (triangular solve)

```bash
python tests/test_spsv.py --synthetic
python tests/test_spsv.py <dir/> --csv-csr spsv.csv
```

### test_spsm.py -- SpSM (triangular matrix-matrix solve)

```bash
python tests/test_spsm.py --synthetic --n 512 --rhs 1024
python tests/test_spsm.py <dir/> --csv-csr spsm_csr.csv --rhs 1024
```

## CI/CD

- `.github/workflows/ci.yml` -- CPU-only: compile, format, lint, build, install, smoke tests.
- `.github/workflows/gpu-ci.yml` -- Manual GPU accuracy smoke on self-hosted runner.
- `.github/workflows/gpu-benchmark.yml` -- Manual GPU benchmark on self-hosted runner.
- `.github/workflows/release.yml` -- Build source and wheel artifacts on `v*` tags.
- `.github/workflows/nightly-cpu.yml` -- Main-branch-only nightly CPU check repeating package, lint, and shared-runtime smoke tests.
- `.github/workflows/triton-smoke.yml` -- Manual opt-in job for triton-dependent smoke checks.
- `.github/workflows/release-drafter.yml` -- Keeps draft release notes current from merged PRs.
- `.github/workflows/build-deb.yml` -- Builds Debian packages on `v*` tags or packaging-path PR changes.
- `.github/workflows/build-rpm.yml` -- Builds RPM packages on `v*` tags or packaging-path PR changes.
