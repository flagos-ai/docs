---
orphan: true
---

# linalg_lu_factor_ex

**Kind:** Math | **Stage:** alpha | **Since:** 5.4

## Description

Computes a compact representation of the LU factorization with partial
pivoting of a matrix and returns an info tensor indicating whether the
factorization was successful (info == 0) or the position of the first zero
pivot (1-indexed). This is the "expert" version of linalg_lu_factor,
equivalent to LAPACK's getrf.

## ATen Mapping

- `linalg.lu_factor_ex`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_lu_factor_ex.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_lu_factor_ex.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_lu_factor_ex.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_lu_factor_ex.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_lu_factor_ex.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_lu_factor_ex.py)
