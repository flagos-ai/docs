---
orphan: true
---

# nanmedian_dim

**Kind:** LinearAlg | **Stage:** beta | **Since:** 5.4

## Description

Returns a namedtuple `(values, indices)` where `values` contains the median
of each row of `input` in the dimension `dim`, ignoring `NaN` values, and
`indices` contains the index location of each median value found.

## ATen Mapping

- `nanmedian.dim`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/nanmedian_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/nanmedian_dim.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nanmedian_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nanmedian_dim.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nanmedian_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nanmedian_dim.py)
