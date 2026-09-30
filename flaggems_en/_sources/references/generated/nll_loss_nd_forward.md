---
orphan: true
---

# nll_loss_nd_forward

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 5.0

## Description

Measures the performance of a classification model by calculating the negative log probability
of the true class. This defines the computation flow, transforming input data through layers
to produce output predictions.

## ATen Mapping

- `nll_loss_nd_forward`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/nll_loss_nd_forward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/nll_loss_nd_forward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nll_loss_nd_forward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nll_loss_nd_forward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nll_loss_nd_forward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nll_loss_nd_forward.py)
