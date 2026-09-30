---
orphan: true
---

# skip_layer_norm

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 2.0

## Description

An optimized operation used in Transformer models to improve performance
by combining residual connection (skip connection) addition and Layer Normalization
(LayerNorm) into a single kernel.

## ATen Mapping

- `skip_layer_norm`

## Labels

`fused`, `Transformer`

## Source Code

- [src/flag_gems/fused/skip_layer_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/skip_layer_norm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_skip_layer_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_skip_layer_norm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_skip_layer_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_skip_layer_norm.py)
