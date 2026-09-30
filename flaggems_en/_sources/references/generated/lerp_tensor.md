---
orphan: true
---

# lerp_tensor

**Kind:** LinearAlg | **Stage:** stable | **Since:** 3.0

## Description

Performs a linear interpolation of two tensors `start` (given by `input`) and `end`
based on a scalar or tensor `weight` and returns the resulting `out` tensor.

## ATen Mapping

- `lerp.Tensor`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/lerp_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/lerp_tensor.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_lerp_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_lerp_tensor.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_lerp_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_lerp_tensor.py)
