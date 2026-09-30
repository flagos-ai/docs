---
orphan: true
---

# std

**Kind:** Reduction | **Stage:** stable | **Since:** 4.0

## Description

Calculates the standard deviation over the dimensions specified by `dim`.
`dim` can be a single dimension, list of dimensions, or `None`
to reduce over all dimensions.

## ATen Mapping

- `std.correction`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/std.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/std.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_std.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_std.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_std.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_std.py)
