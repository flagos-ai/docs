---
orphan: true
---

# normal_tensor_tensor

**Kind:** Distribution | **Stage:** stable | **Since:** 2.1

## Description

Returns a tensor of random numbers drawn from separate normal distributions
whose mean and standard deviation are given.
This is one of the variants that takes a tensor `mean` and a tensor `std`.

## ATen Mapping

- `normal.Tensor_Tensor`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/normal_tensor_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/normal_tensor_tensor.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_normal_tensor_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_normal_tensor_tensor.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_normal_tensor_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_normal_tensor_tensor.py)
