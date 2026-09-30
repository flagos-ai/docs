---
orphan: true
---

# arange

**Kind:** Tensor | **Stage:** stable | **Since:** 2.1

## Description

Returns a 1-D tensor of size `ceiling((end−start)/step)` with values from the interval `[start, end)`
taken with common difference `step` beginning from start.

## ATen Mapping

- `arange`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/arange.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/arange.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_arange.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_arange.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_arange.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_arange.py)
