---
orphan: true
---

# weight_norm_interface_backward

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 3.0

## Description

Computes the gradients for weight normalization during the backward pass.
It calculates the necessary derivatives for updating both the magnitude (g)
and direction (v)  parameters of a weight-normalized layer, based on gradients
received from the previous operation.

## ATen Mapping

- `_weight_norm_interface_backward`

## Labels

`aten`, `fused`

## Source Code

- [src/flag_gems/fused/weight_norm_interface_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/weight_norm_interface_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_weight_norm_interface_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_weight_norm_interface_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_weight_norm_interface_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_weight_norm_interface_backward.py)
