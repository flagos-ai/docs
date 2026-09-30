---
orphan: true
---

# scatter_add_

**Kind:** Tensor | **Stage:** stable | **Since:** 4.2

## Description

Adds all values from the tensor `src` into `self` at the indices specified
in the `index` tensor in a similar fashion as `scatter_()`.
For each value in `src`, it is added to an index in `self` which is specified
by its index in `src` for `dimension != dim` and by the corresponding value
in `index` for `dimension = dim`.

## ATen Mapping

- `scatter_add_`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/scatter_add.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/scatter_add.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scatter_add_.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scatter_add_.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scatter_add_.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scatter_add_.py)
