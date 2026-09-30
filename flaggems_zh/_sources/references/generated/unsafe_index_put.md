---
orphan: true
---

# unsafe_index_put

**Kind:** Tensor | **Stage:** beta | **Since:** 5.5

## Description

Puts values from the tensor `values` into the tensor `input` using the indices specified
in `indices` (which is a tuple of Tensors), matching `aten._unsafe_index_put`. The
unsafe variant skips autograd history recording and assumes the caller passes valid
indices; it shares the semantics of `index_put`, including the `accumulate` flag.

## ATen Mapping

- `_unsafe_index_put`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/unsafe_index_put.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/unsafe_index_put.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_unsafe_index_put.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_unsafe_index_put.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_unsafe_index_put.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_unsafe_index_put.py)
