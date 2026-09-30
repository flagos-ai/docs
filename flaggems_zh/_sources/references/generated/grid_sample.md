---
orphan: true
---

# grid_sample

**Kind:** NeuralNetwork | **Stage:** alpha | **Since:** 5.3

## Description

Given an `input` and a flow-field `grid`, computes the `output` using `input` values and
pixel locations from `grid`.

## ATen Mapping

- `nn.functional.grid_sample`

## Labels

`aten`, `nn.functional`

## Source Code

- [src/flag_gems/ops/grid_sample.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/grid_sample.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_grid_sample.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_grid_sample.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_grid_sample.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_grid_sample.py)
