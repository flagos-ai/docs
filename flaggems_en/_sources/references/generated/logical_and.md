---
orphan: true
---

# logical_and

**Kind:** Math | **Stage:** stable | **Since:** 2.2

## Description

Computes the element-wise logical AND of the given `input` tensors.
Zeros are treated as False and nonzeros are treated as True.

## ATen Mapping

- `logical_and`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/logical_and.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/logical_and.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_logical_and.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_logical_and.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_logical_and.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_logical_and.py)
