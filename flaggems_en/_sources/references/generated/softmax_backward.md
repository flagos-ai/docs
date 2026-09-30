---
orphan: true
---

# softmax_backward

**Kind:** Reduction | **Stage:** stable | **Since:** 3.0

## Description

The backward version of `softmax()`.

## ATen Mapping

- `_softmax_backward_data`

## Labels

`aten`, `nn.functional`

## Source Code

- [src/flag_gems/ops/softmax_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/softmax_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_softmax_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_softmax_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_softmax_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_softmax_backward.py)
