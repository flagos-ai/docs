---
orphan: true
---

# linalg_solve_triangular

**Kind:** LinearAlg, BLAS | **Stage:** alpha | **Since:** 5.4

## Description

Solves a triangular system of linear equations with a unique solution, returning
a tensor X such that A*X = B (or X*A = B when right=True) for a triangular
matrix A and matrix of right-hand sides B.

## ATen Mapping

- `linalg_solve_triangular`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_solve_triangular.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_solve_triangular.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_solve_triangular.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_solve_triangular.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_solve_triangular.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_solve_triangular.py)
