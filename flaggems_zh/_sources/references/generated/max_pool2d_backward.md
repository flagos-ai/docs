---
orphan: true
---

# max_pool2d_backward

**Kind:** IR | **Stage:** stable | **Since:** 4.0

## Description

Applies a 2D max pooling over an input signal composed of several input planes.
This is an IR representation rather than a public API and it is for the backward step.

## ATen Mapping

- `max_pool2d_backward`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/max_pool2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/max_pool2d_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_max_pool2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_max_pool2d_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_max_pool2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_max_pool2d_backward.py)
