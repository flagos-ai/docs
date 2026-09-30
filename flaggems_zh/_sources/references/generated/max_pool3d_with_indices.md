---
orphan: true
---

# max_pool3d_with_indices

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Applies a 3D max pooling over an input signal composed of several input planes.

## ATen Mapping

- `nn.functional.max_pool3d`

## Labels

`aten`, `nn.functional`

## Source Code

- [src/flag_gems/ops/max_pool3d_with_indices.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/max_pool3d_with_indices.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_max_pool3d_with_indices.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_max_pool3d_with_indices.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_max_pool3d_with_indices.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_max_pool3d_with_indices.py)
