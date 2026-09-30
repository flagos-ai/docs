---
orphan: true
---

# cummin

**Kind:** Math | **Stage:** stable | **Since:** 2.2

## Description

Returns a named tuple `(values, indices)` where values is the cumulative minimum of elements
of `input` in the dimension `dim`. And `indices` is the index location of each minimum value
found in the dimension `dim`.

## ATen Mapping

- `cummin`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/cummin.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/cummin.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cummin.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cummin.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cummin.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cummin.py)
