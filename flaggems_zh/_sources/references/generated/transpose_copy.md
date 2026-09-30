---
orphan: true
---

# transpose_copy

**Kind:** Tensor | **Stage:** alpha | **Since:** 5.5

## Description

Returns a new contiguous tensor with the two specified dimensions swapped.
The result does not alias the input tensor.

## ATen Mapping

- `transpose_copy.int`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/transpose_copy.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/transpose_copy.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_transpose_copy.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_transpose_copy.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_transpose_copy.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_transpose_copy.py)
