---
orphan: true
---

# cholesky_solve_out

**Kind:** BLAS | **Stage:** alpha | **Since:** 5.4

## Description

Solves a system of linear equations with a symmetric positive-definite matrix
using its Cholesky factorization.

## ATen Mapping

- `cholesky_solve.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/cholesky_solve.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/cholesky_solve.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cholesky_solve_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cholesky_solve_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cholesky_solve_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cholesky_solve_out.py)
