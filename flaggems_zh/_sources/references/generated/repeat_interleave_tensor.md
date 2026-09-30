---
orphan: true
---

# repeat_interleave_tensor

**Kind:** Tensor | **Stage:** stable | **Since:** 2.2

## Description

Repeats 0 `repeats[0]` times, 1 `repeats[1]` times, 2 `repeats[2]` times, etc.

## ATen Mapping

- `repeat_interleave.Tensor`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/repeat_interleave_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/repeat_interleave_tensor.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_repeat_interleave_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_repeat_interleave_tensor.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_repeat_interleave_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_repeat_interleave_tensor.py)
