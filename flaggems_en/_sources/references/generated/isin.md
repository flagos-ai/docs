---
orphan: true
---

# isin

**Kind:** Tensor | **Stage:** stable | **Since:** 2.2

## Description

Tests if each element of `elements` is in `test_elements`.
Returns a boolean tensor of the same shape as `elements` that is True
for elements in `test_elements` and False otherwise.

## ATen Mapping

- `isin.Tensor_Tensor`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/isin.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/isin.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_isin.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_isin.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_isin.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_isin.py)
