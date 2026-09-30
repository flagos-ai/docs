---
orphan: true
---

# segment_reduce_out

**Kind:** Reduction | **Stage:** beta | **Since:** 5.4

## Description

A variant of `segment_reduce` that assigns the reduced segments to the `out` tensor.

## ATen Mapping

- `segment_reduce.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/segment_reduce.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/segment_reduce.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_segment_reduce_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_segment_reduce_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_segment_reduce_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_segment_reduce_out.py)
