---
orphan: true
---

# avg_pool2d

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 4.1

## Description

Applies 2D average-pooling operation in `kH \mul kW` regions by step size `sH \mul sW` steps.
The number of output features is equal to the number of input planes.
This is for the forward case.

## ATen Mapping

- `avg_pool2d`

## Labels

`nn.functional`

## Source Code

- [src/flag_gems/ops/avg_pool2d.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/avg_pool2d.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_avg_pool2d.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_avg_pool2d.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_avg_pool2d.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_avg_pool2d.py)
