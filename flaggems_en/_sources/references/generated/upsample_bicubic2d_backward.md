---
orphan: true
---

# upsample_bicubic2d_backward

**Kind:** NeuralNetwork | **Stage:** alpha | **Since:** 5.4

## Description

Computes non-antialiased bicubic interpolation gradients using deterministic gather.

## ATen Mapping

- `upsample_bicubic2d_backward`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/upsample_bicubic2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/upsample_bicubic2d_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_bicubic2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_bicubic2d_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_bicubic2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_bicubic2d_backward.py)
