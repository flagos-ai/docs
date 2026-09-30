---
orphan: true
---

# slice_backward

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 5.0

## Description

An automatic differentiation (autograd) function that computes the gradient of a tensor slicing operation
(`tensor[start:end]`) during backpropagation.

## ATen Mapping

- `slice_backward`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/slice_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/slice_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_slice_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_slice_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_slice_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_slice_backward.py)
