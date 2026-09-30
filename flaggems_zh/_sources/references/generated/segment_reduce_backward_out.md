---
orphan: true
---

# segment_reduce_backward_out

**Kind:** Reduction | **Stage:** beta | **Since:** 5.4

## Description

A variant of `_segment_reduce_backward` that assigns the gradient input to the `out` tensor.

## ATen Mapping

- `_segment_reduce_backward.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/segment_reduce_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/segment_reduce_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_segment_reduce_backward_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_segment_reduce_backward_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_segment_reduce_backward_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_segment_reduce_backward_out.py)
