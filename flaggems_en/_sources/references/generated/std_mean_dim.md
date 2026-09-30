---
orphan: true
---

# std_mean_dim

**Kind:** Reduction | **Stage:** alpha | **Since:** 5.5

## Description

Calculates the standard deviation and mean over selected dimensions, using the legacy `unbiased` argument.

## ATen Mapping

- `std_mean.dim`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/std_mean_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/std_mean_dim.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_std_mean_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_std_mean_dim.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_std_mean_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_std_mean_dim.py)
