---
orphan: true
---

# linalg_lu

**Kind:** Math | **Stage:** alpha | **Since:** 5.4

## Description

Computes the LU factorization with partial pivoting of a matrix and
returns the permutation matrix P and the lower/upper triangular factors
L and U such that P @ L @ U = A (or L @ U = A for pivot=False).

## ATen Mapping

- `linalg.lu`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_lu.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_lu.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_lu.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_lu.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_lu.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_lu.py)
