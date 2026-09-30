---
orphan: true
---

# cummax

**Kind:** Math | **Stage:** stable | **Since:** 3.0

## Description

Returns a named tuple `(values, indices)` where `values` is the cumulative maximum of elements
of `input` in the dimension `dim`. And `indices` is the index location of each maximum value
found in the dimension `dim`.

## ATen Mapping

- `cummax`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/cummax.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/cummax.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cummax.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cummax.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cummax.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cummax.py)
