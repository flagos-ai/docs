---
orphan: true
---

# linalg_lu_out

**Kind:** Math | **Stage:** alpha | **Since:** 5.4

## Description

Out-of-place version of linalg_lu. Supports calling
torch.linalg.lu(A, *, pivot=True, out=(P, L, U)). The out parameter
provides pre-allocated output tensors for in-place writing.

## ATen Mapping

- `linalg.lu.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_lu.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_lu.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_lu_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_lu_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_lu_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_lu_out.py)
