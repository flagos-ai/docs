---
orphan: true
---

# normal_tensor_float

**Kind:** Distribution | **Stage:** stable | **Since:** 2.1

## Description

Returns a tensor of random numbers drawn from separate normal distributions
whose mean and standard deviation are given.
This is one of the variants that takes a tensor `mean` and a float `std`.

## ATen Mapping

- `normal.Tensor_float`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/normal_tensor_float.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/normal_tensor_float.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_normal_tensor_float.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_normal_tensor_float.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_normal_tensor_float.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_normal_tensor_float.py)
