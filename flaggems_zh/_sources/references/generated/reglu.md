---
orphan: true
---

# reglu

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Rectified Gated Linear Unit is a variant of GLU that uses ReLU instead of the sigmoid function for gating.

## ATen Mapping

- `reglu`

## Labels

`fused`, `Transformer`

## Source Code

- [src/flag_gems/fused/reglu.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/reglu.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_reglu.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_reglu.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_reglu.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_reglu.py)
