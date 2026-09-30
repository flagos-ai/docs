---
orphan: true
---

# geglu

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Gaussian Error Gated Linear Unit with GELU activation instead of sigmoid function.

## ATen Mapping

- `geglu`

## Labels

`fused`, `Activation`, `Transformer`

## Source Code

- [src/flag_gems/fused/geglu.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/geglu.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_geglu.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_geglu.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_geglu.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_geglu.py)
