---
orphan: true
---

# leaky_relu_backward

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

A variant of `leaky_relu()` for backward case.

## ATen Mapping

- `leaky_relu_backward`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/leaky_relu_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/leaky_relu_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_leaky_relu_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_leaky_relu_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_leaky_relu_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_leaky_relu_backward.py)
