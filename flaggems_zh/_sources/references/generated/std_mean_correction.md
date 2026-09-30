---
orphan: true
---

# std_mean_correction

**Kind:** Reduction | **Stage:** alpha | **Since:** 5.5

## Description

Calculates the standard deviation and mean over selected dimensions, using an optional degrees-of-freedom correction.

## ATen Mapping

- `std_mean.correction`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/std_mean_correction.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/std_mean_correction.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_std_mean_correction.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_std_mean_correction.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_std_mean_correction.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_std_mean_correction.py)
