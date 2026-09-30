---
orphan: true
---

# nll_loss_nd_backward

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 5.0

## Description

Measures the performance of a classification model by penalizing low probabilities for correct classe.s
This computes the gradients of this loss with respect to model parameters using automatic differentiation.

## ATen Mapping

- `nll_loss_nd_backward`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/nll_loss_nd_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/nll_loss_nd_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nll_loss_nd_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nll_loss_nd_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nll_loss_nd_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nll_loss_nd_backward.py)
