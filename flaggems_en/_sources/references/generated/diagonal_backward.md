---
orphan: true
---

# diagonal_backward

**Kind:** LinearAlg | **Stage:** stable | **Since:** 2.2

## Description

A diagonal operation returns a partial view of `input` with the its diagonal elements
with respect to `dim1` and `dim2` appended as a dimension at the end of the shape.
This is the backward case for `diagonal()`.

## ATen Mapping

- `diagonal_backward`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/diagonal_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/diagonal_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_diagonal_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_diagonal_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_diagonal_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_diagonal_backward.py)
