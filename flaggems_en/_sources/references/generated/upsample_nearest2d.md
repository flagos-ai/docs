---
orphan: true
---

# upsample_nearest2d

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 2.2

## Description

Upsamples the `input`, using nearest neighbours' pixel values. The input has to be 4 dimensional.
The scales can be provided with `scales_h` and `scales_w`.

## ATen Mapping

- `upsample_nearest2d`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/upsample_nearest2d.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/upsample_nearest2d.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_nearest2d.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_nearest2d.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_nearest2d.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_nearest2d.py)
