---
orphan: true
---

# gelu_and_mul

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 2.0

## Description

An activation function for GeGLU.

## ATen Mapping

- `GeluAndMul`

## Labels

`fused`, `pointwise`, `Activation`

## Source Code

- [src/flag_gems/fused/gelu_and_mul.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/gelu_and_mul.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_gelu_and_mul.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_gelu_and_mul.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_gelu_and_mul.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_gelu_and_mul.py)
