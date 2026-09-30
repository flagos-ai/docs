---
orphan: true
---

# linalg_lu_factor_out

**Kind:** Math | **Stage:** alpha | **Since:** 5.4

## Description

Out-of-place version of linalg_lu_factor. Supports calling torch.linalg.lu_factor(A, *, pivot=True, out=(LU, pivots)). The out parameter provides pre-allocated output tensors.

## ATen Mapping

- `linalg.lu_factor.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_lu_factor.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_lu_factor.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_lu_factor_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_lu_factor_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_lu_factor_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_lu_factor_out.py)
