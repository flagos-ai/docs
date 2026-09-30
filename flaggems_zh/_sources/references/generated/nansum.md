---
orphan: true
---

# nansum

**Kind:** LinearAlg | **Stage:** beta | **Since:** 5.4

## Description

Returns the sum of all elements in the `input` tensor, treating `NaN` values as zero.
Supports global reduction and reduction along specified dimensions.

## ATen Mapping

- `nansum`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/nansum.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/nansum.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nansum.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nansum.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nansum.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nansum.py)
