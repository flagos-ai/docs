---
orphan: true
---

# adaptive_max_pool3d

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.4

## Description

Applies three-dimensional adaptive max pooling over an input signal and
returns both the pooled values and the selected input indices.

## ATen Mapping

- `adaptive_max_pool3d`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/adaptive_max_pool3d.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/adaptive_max_pool3d.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_adaptive_max_pool3d.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_adaptive_max_pool3d.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_adaptive_max_pool3d.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_adaptive_max_pool3d.py)
