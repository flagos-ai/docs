---
orphan: true
---

# normal_float_float_

**Kind:** Distribution | **Stage:** stable | **Since:** 5.0

## Description

Returns a tensor of random numbers drawn from separate normal distributions
whose mean and standard deviation are given.
This is one of the variants that takes a float `mean` and a float `std`.

## ATen Mapping

- `normal_`

## Labels

`aten`, `pointwise`, `skip_precision_check`

## Source Code

- [src/flag_gems/ops/normal_float_float.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/normal_float_float.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_normal_float_float_.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_normal_float_float_.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_normal_float_float_.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_normal_float_float_.py)
