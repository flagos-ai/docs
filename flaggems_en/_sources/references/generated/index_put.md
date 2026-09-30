---
orphan: true
---

# index_put

**Kind:** Tensor | **Stage:** stable | **Since:** 2.2

## Description

Puts values from the tensor `values` into the tensor `input` using the indices specified
in `indices` (which is a tuple of Tensors).

## ATen Mapping

- `index_put`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/index_put.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/index_put.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_index_put.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_index_put.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_index_put.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_index_put.py)
