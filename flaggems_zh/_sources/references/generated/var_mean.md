---
orphan: true
---

# var_mean

**Kind:** LinearAlg | **Stage:** stable | **Since:** 2.0

## Description

Calculates the variance and mean over the dimensions specified by `dim`. `dim` can be a single dimension,
list of dimensions, or `None` to reduce over all dimensions.

## ATen Mapping

- `var_mean.correction`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/var_mean.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/var_mean.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_var_mean.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_var_mean.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_var_mean.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_var_mean.py)
