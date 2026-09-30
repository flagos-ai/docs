---
orphan: true
---

# weight_norm_interface

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 2.2

## Description

Apply weight normalization to neural network layers, decoupling the magnitued
of a weight tensor from its direction. It is used to stabilize training, particularly
for models with small batch sizes.

## ATen Mapping

- `_weight_norm_interface`

## Labels

`aten`, `fused`

## Source Code

- [src/flag_gems/fused/weight_norm_interface.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/weight_norm_interface.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_weight_norm_interface.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_weight_norm_interface.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_weight_norm_interface.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_weight_norm_interface.py)
