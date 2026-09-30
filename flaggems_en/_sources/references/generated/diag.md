---
orphan: true
---

# diag

**Kind:** Tensor | **Stage:** stable | **Since:** 2.2

## Description

- If `input` is a vector (1-D tensor), then returns a 2-D square tensor
  with the elements of `input` as the diagonal.
- If `input` is a matrix (2-D tensor), then returns a 1-D tensor
  with the diagonal elements of `input`.

## ATen Mapping

- `diag`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/diag.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/diag.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_diag.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_diag.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_diag.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_diag.py)
