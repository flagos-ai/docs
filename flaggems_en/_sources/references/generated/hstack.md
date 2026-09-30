---
orphan: true
---

# hstack

**Kind:** Tensor | **Stage:** stable | **Since:** 2.2

## Description

Stack tensors in sequence horizontally (column wise). This is equivalent to concatenation
along the first axis for 1-D tensors, and along the second axis for all other tensors.

## ATen Mapping

- `hstack`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/hstack.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/hstack.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_hstack.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_hstack.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_hstack.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_hstack.py)
