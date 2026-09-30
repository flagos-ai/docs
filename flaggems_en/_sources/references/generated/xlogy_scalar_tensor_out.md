---
orphan: true
---

# xlogy_scalar_tensor_out

**Kind:** Math | **Stage:** beta | **Since:** 5.4

## Description

A variant of `xlogy` where `input` is a scalar and the output is assigned to an `out` tensor.

## ATen Mapping

- `xlogy.OutScalar_Self`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/xlogy_scalar_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/xlogy_scalar_tensor.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_xlogy_scalar_tensor_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_xlogy_scalar_tensor_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_xlogy_scalar_tensor_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_xlogy_scalar_tensor_out.py)
