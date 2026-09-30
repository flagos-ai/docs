---
orphan: true
---

# std_mean_correction_out

**Kind:** Reduction | **Stage:** alpha | **Since:** 5.5

## Description

Out-tensor variant of `std_mean` with a degrees-of-freedom correction.

## ATen Mapping

- `std_mean.correction_out`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/std_mean_correction.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/std_mean_correction.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_std_mean_correction_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_std_mean_correction_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_std_mean_correction_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_std_mean_correction_out.py)
