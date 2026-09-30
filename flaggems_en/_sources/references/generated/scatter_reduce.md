---
orphan: true
---

# scatter_reduce

**Kind:** Tensor | **Stage:** stable | **Since:** 2.2

## Description

Writes all values from the tensor `src` into provided tensor at the indices
specified in the `index` tensor. For each value in `src`, its output index
is specified by its index in `src` for `dimension != dim` and by the corresponding value
in `index` for `dimension = dim`.
The optional `reduce` argument allows specification of an optional reduction operation,
which is applied to all values in the tensor `src` into the tensor at the indices
specified in the `index`.

## ATen Mapping

- `scatter.reduce`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/scatter_reduce.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/scatter_reduce.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scatter_reduce.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scatter_reduce.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scatter_reduce.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scatter_reduce.py)
