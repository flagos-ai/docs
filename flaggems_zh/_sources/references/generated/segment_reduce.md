---
orphan: true
---

# segment_reduce

**Kind:** Reduction | **Stage:** beta | **Since:** 5.4

## Description

Reduces contiguous segments of a tensor along the specified axis. Segments are described
by `lengths` or `offsets`, and supported reductions include sum, mean, max, min, and prod.

## ATen Mapping

- `segment_reduce`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/segment_reduce.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/segment_reduce.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_segment_reduce.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_segment_reduce.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_segment_reduce.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_segment_reduce.py)
