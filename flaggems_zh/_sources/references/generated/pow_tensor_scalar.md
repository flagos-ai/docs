---
orphan: true
---

# pow_tensor_scalar

**Kind:** Math | **Stage:** stable | **Since:** 1.0

## Description

Takes the power of each element in `input` with `exponent` and returns a tensor with the result.
The input is a tensor, while the `exponent` is a float.

## ATen Mapping

- `pow.Tensor_Scalar`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/pow_tensor_scalar.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/pow_tensor_scalar.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_pow_tensor_scalar.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_pow_tensor_scalar.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_pow_tensor_scalar.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_pow_tensor_scalar.py)
