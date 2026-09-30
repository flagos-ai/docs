---
orphan: true
---

# post_layer_norm_residual

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.4

## Description

Fuses LayerNorm followed by a residual addition.

## Labels

`fused`

## Source Code

- [src/flag_gems/fused/post_layer_norm_residual.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/post_layer_norm_residual.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_post_layer_norm_residual.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_post_layer_norm_residual.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_post_layer_norm_residual.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_post_layer_norm_residual.py)
