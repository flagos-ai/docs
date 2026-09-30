---
orphan: true
---

# repeat_interleave_self_tensor

**Kind:** Tensor | **Stage:** stable | **Since:** 2.2

## Description

Repeats elements of a tensor. The number of repetitions is specified as a tensor `repeats`.
`repeats` is broadcasted to fit the shape of the given axis.

## ATen Mapping

- `repeat_interleave.self_Tensor`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/repeat_interleave_self_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/repeat_interleave_self_tensor.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_repeat_interleave_self_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_repeat_interleave_self_tensor.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_repeat_interleave_self_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_repeat_interleave_self_tensor.py)
