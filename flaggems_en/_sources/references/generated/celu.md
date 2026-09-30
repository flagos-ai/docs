---
orphan: true
---

# celu

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 4.0

## Description

Applies the quantized CELU (Continuously Differentiable Exponential Linear Unit)
activation function element-wise.

## ATen Mapping

- `celu`

## Labels

`aten`, `nn.functional`, `pointwise`

## Source Code

- [src/flag_gems/ops/celu.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/celu.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_celu.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_celu.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_celu.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_celu.py)
