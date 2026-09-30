---
orphan: true
---

# silu

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 1.0

## Description

SiLU (Sigmoid Linear Unit), a simple approximation of ReLU but
without any discontinuity of the first derivative.

## ATen Mapping

- `silu`

## Labels

`aten`, `pointwise`, `nn.functional`

## Source Code

- [src/flag_gems/ops/silu.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/silu.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_silu.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_silu.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_silu.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_silu.py)
