---
orphan: true
---

# div_mode

**Kind:** Math | **Stage:** stable | **Since:** 1.0

## Description

Divides each element of the `input` by the corresponding element of `other`.
An optional `rounding_mode` can be specified.

## ATen Mapping

- `div.Scalar_mode`
- `div.Tensor_mode`
- `divide.Scalar_mode`
- `divide.Tensor_mode`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/div_mode.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/div_mode.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_div_mode.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_div_mode.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_div_mode.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_div_mode.py)
