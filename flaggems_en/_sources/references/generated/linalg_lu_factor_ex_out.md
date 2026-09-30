---
orphan: true
---

# linalg_lu_factor_ex_out

**Kind:** Math | **Stage:** alpha | **Since:** 5.4

## Description

Out-of-place version of linalg_lu_factor_ex. Supports calling
torch.linalg.lu_factor_ex(A, *, pivot=True, check_errors=False,
out=(LU, pivots, info)). The out parameter provides pre-allocated output
tensors for in-place writing.

## ATen Mapping

- `linalg.lu_factor_ex.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_lu_factor_ex.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_lu_factor_ex.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_lu_factor_ex_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_lu_factor_ex_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_lu_factor_ex_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_lu_factor_ex_out.py)
