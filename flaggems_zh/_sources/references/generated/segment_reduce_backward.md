---
orphan: true
---

# segment_reduce_backward

**Kind:** Reduction | **Stage:** beta | **Since:** 5.4

## Description

Computes gradients for `segment_reduce` with lengths or offsets based segment definitions.

## ATen Mapping

- `_segment_reduce_backward`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/segment_reduce_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/segment_reduce_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_segment_reduce_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_segment_reduce_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_segment_reduce_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_segment_reduce_backward.py)
