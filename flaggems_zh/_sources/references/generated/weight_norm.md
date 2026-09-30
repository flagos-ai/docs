---
orphan: true
---

# weight_norm

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 3.0

## Description

Reparameterizes a module's weight tensor by decoupling its magnitude (g)
from its direction (v). It is a hook that compute the actual weight before
each forward pass.

## ATen Mapping

- `weight_norm`

## Labels

`fused`

## Source Code

- [src/flag_gems/fused/weight_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/weight_norm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_weight_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_weight_norm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_weight_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_weight_norm.py)
