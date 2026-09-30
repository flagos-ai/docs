---
orphan: true
---

# abs

**Kind:** Math | **Stage:** stable | **Since:** 1.0

## Description

Computes the absolute value of each element in `input`.
This is a simple wrapper of the existing torch `abs` operator.

## ATen Mapping

- `abs`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/abs.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/abs.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_abs.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_abs.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_abs.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_abs.py)
