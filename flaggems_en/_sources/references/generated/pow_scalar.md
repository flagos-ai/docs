---
orphan: true
---

# pow_scalar

**Kind:** Math | **Stage:** stable | **Since:** 1.0

## Description

Takes the power of each element in `input` with `exponent` and returns a tensor with the result.
The input is a single float, while the `exponent` is a tensor.

## ATen Mapping

- `pow.Scalar`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/pow_scalar.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/pow_scalar.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_pow_scalar.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_pow_scalar.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_pow_scalar.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_pow_scalar.py)
