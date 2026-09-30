---
orphan: true
---

# sum_dim

**Kind:** LinearAlg | **Stage:** stable | **Since:** 2.0 | **C++:** 4.0

## Description

Returns the sum of each row of the `input` tensor in the given dimension `dim`.
`dim` is a list of dimensions, reduce over all of them.

## ATen Mapping

- `sum.dim_IntList`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/sum_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/sum_dim.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sum_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sum_dim.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sum_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sum_dim.py)
