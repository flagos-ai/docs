---
orphan: true
---

# linalg_matrix_norm_out

**Kind:** LinearAlg | **Stage:** beta | **Since:** 5.5

## Description

Out-of-place version of linalg_matrix_norm,
Computes the matrix norm over the given dimensions.
Supports ord values: 1, -1, 2, -2, inf, -inf, 'fro', 'nuc'.
For ord=2/-2/nuc, internally uses SVD (singular value decomposition).
For ord=1/-1/inf/-inf, uses max/min absolute column/row sums.
For ord='fro', uses Frobenius norm via per-row L2 reduction.

## ATen Mapping

- `linalg_matrix_norm_out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_matrix_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_matrix_norm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_matrix_norm_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_matrix_norm_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_matrix_norm_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_matrix_norm_out.py)
