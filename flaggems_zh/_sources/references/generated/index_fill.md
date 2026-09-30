---
orphan: true
---

# index_fill

**Kind:** Tensor | **Stage:** alpha | **Since:** 5.4

## Description

Fills elements of the input tensor with a scalar or 0-dimensional tensor value
at positions selected by `index` along the given `dim`.

## ATen Mapping

- `index_fill.int_Scalar`
- `index_fill.int_Tensor`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/index_fill.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/index_fill.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_index_fill.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_index_fill.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_index_fill.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_index_fill.py)
