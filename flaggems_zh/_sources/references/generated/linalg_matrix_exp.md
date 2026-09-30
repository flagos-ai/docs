---
orphan: true
---

# linalg_matrix_exp

**Kind:** LinearAlg | **Stage:** beta | **Since:** 5.4

## Description

Computes the matrix exponential of a square matrix via scaling-and-squaring with an optimized Taylor polynomial approximation of degree 18.

## ATen Mapping

- `linalg.matrix_exp`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_matrix_exp.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_matrix_exp.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_matrix_exp.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_matrix_exp.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_matrix_exp.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_matrix_exp.py)
