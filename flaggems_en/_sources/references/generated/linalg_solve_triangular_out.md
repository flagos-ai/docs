---
orphan: true
---

# linalg_solve_triangular_out

**Kind:** LinearAlg, BLAS | **Stage:** alpha | **Since:** 5.4

## Description

Out-of-place variant of linalg_solve_triangular: solves a triangular system
of linear equations and writes the result into the provided out tensor.

## ATen Mapping

- `linalg_solve_triangular.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_solve_triangular.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_solve_triangular.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_solve_triangular_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_solve_triangular_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_solve_triangular_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_solve_triangular_out.py)
