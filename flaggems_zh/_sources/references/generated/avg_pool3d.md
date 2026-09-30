---
orphan: true
---

# avg_pool3d

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Applies 3D average-pooling operation in `kD \times kH \times kW` regions by step size
`sD \times sH \times sW` steps.

## ATen Mapping

- `avg_pool3d`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/avg_pool3d.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/avg_pool3d.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_avg_pool3d.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_avg_pool3d.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_avg_pool3d.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_avg_pool3d.py)
