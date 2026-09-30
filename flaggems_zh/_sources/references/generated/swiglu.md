---
orphan: true
---

# swiglu

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 5.0

## Description

Swish-Gated Linear Unit, a variant of GLU with the Swish activation function.

## ATen Mapping

- `swiglu`

## Labels

`fused`, `Transformer`

## Source Code

- [src/flag_gems/fused/swiglu.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/swiglu.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_swiglu.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_swiglu.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_swiglu.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_swiglu.py)
