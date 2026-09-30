---
orphan: true
---

# atan2

**Kind:** Math | **Stage:** stable | **Since:** 5.3

## Description

Computes the element-wise arc tangent of `input/other(y/x)`,
returning angles in radians between `-PI` and `PI`.

## ATen Mapping

- `atan2`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/atan2.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/atan2.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_atan2.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_atan2.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_atan2.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_atan2.py)
