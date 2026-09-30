---
orphan: true
---

# linalg_matrix_power_out

**Kind:** LinearAlg | **Stage:** beta | **Since:** 5.4

## Description

Out-of-place version of linalg_matrix_power. Supports calling torch.linalg.matrix_power(A, n, *, out=None). The out parameter provides a pre-allocated output tensor for in-place writing.

## ATen Mapping

- `linalg_matrix_power.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_matrix_power.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_matrix_power.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_matrix_power_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_matrix_power_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_matrix_power_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_matrix_power_out.py)
