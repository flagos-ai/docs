---
orphan: true
---

# upsample_bilinear2d_backward

**Kind:** NeuralNetwork | **Stage:** alpha | **Since:** 5.4

## Description

Computes gradients of bilinear interpolation without anti-aliasing.

## ATen Mapping

- `upsample_bilinear2d_backward`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/upsample_bilinear2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/upsample_bilinear2d_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_bilinear2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_bilinear2d_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_bilinear2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_bilinear2d_backward.py)
