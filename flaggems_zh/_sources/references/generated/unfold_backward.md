---
orphan: true
---

# unfold_backward

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 5.0

## Description

An operator for calculating the gradient of the `unfold` operation during backpropagation.
It takes the gradient of the unfolded output and accumulates it back into
the original input shape, reversing sliding local block extraction and resolving overlaps.

## ATen Mapping

- `unfold_backward`

## Labels

`aten`, `nn.functional`

## Source Code

- [src/flag_gems/ops/unfold_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/unfold_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_unfold_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_unfold_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_unfold_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_unfold_backward.py)
