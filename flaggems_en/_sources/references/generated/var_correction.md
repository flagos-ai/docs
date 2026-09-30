---
orphan: true
---

# var_correction

**Kind:** Tensor | **Stage:** beta | **Since:** 5.3

## Description

A variant of the `var()` operator, with an optional `correction` for specifying
difference between the sample size and sample degrees of freedom.

## ATen Mapping

- `var.correction`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/var_correction.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/var_correction.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_var_correction.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_var_correction.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_var_correction.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_var_correction.py)
