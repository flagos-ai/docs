---
orphan: true
---

# max_dim

**Kind:** LinearAlg | **Stage:** stable | **Since:** 2.0 | **C++:** 4.0

## Description

Returns a namedtuple `(values, indices)` where `values` is the maximum value
of each row of the `input` tensor in the given dimension `dim`.
And `indices` is the index location of each maximum value found (argmax).

## ATen Mapping

- `max.dim`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/max_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/max_dim.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_max_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_max_dim.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_max_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_max_dim.py)
