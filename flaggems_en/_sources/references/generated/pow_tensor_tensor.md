---
orphan: true
---

# pow_tensor_tensor

**Kind:** Math | **Stage:** stable | **Since:** 1.0

## Description

Takes the power of each element in `input` with `exponent` and returns a tensor with the result.
The input is a tensor, while the `exponent` is also a tensor.

## ATen Mapping

- `pow.Tensor_Tensor`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/pow_tensor_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/pow_tensor_tensor.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_pow_tensor_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_pow_tensor_tensor.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_pow_tensor_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_pow_tensor_tensor.py)
