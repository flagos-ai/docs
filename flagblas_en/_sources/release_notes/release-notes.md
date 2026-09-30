# FlagBLAS Release Notes

## v0.3.0

- **Added Features**

  - New Level-1 rotation operators: `rotg`, `rotm`, `rotmg`.
  - Level-2 coverage extended across the packed, banded, triangular, symmetric/Hermitian and rank-1/rank-2 update families, including `hpmv`, `trsv`, `tpsv`, `tbsv`, `ger`, `syr`, `her` and the packed `sspr`/`sspr2`/`dspr`/`dspr2` updates.
  - New GEMM operators: `dgemm`, `cgemm` and `zgemm`, plus Group GEMM on the NVIDIA backend.
  - New hardware backends: Ascend and Hygon DCU, alongside NVIDIA and Iluvatar.

- **Enhanced Features**

  - All Level-2 and Level-3 operators are now at the stable stage.
  - GEMM, triangular-solve and rank-update operators have been further optimized.

## v0.2.0

- **Added Features**
  - **Operator Registry** — Added `conf/operators.yaml` with full operator metadata.
  - **CI/CD Pipeline** — GitHub Actions workflow with correctness tests, performance benchmarks, and pre-commit hooks.
  - **libtuner Autotuning** — Integrated libtuner for automatic kernel configuration tuning.

- **Enhanced Features**

  - hgemm optimized with block-pointer and TMA kernel variants.
  - amax small-N path optimized for improved performance.
  - asum operator underwent deep performance tuning.
  - sgemm and hgemm autotuning migrated from hardcoded configs to libtuner.
  - GEMV fp64 scalar packing and small-N paths optimized.

## v0.1.0

Initial release of FlagBLAS.

- **Added Features**

  - BLAS-standard interface library with multi-backend support.
  - Core vector and matrix operations (Level 1, 2, 3 BLAS).
  - Flexible multi-backend support mechanism.

