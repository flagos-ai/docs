---
orphan: true
---

# min_dim

**Kind:** LinearAlg | **Stage:** stable | **Since:** 2.0

## Description

Returns a namedtuple `(values, indices)` where `values` is the minimum value of
each row of the `input` tensor in the given dimension `dim`.
And `indices` is the index location of each minimum value found (argmin).

## ATen Mapping

- `min.dim`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/min_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/min_dim.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_min_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_min_dim.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_min_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_min_dim.py)
