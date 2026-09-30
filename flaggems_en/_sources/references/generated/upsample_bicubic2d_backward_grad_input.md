---
orphan: true
---

# upsample_bicubic2d_backward_grad_input

**Kind:** NeuralNetwork | **Stage:** alpha | **Since:** 5.4

## Description

Writes non-antialiased bicubic interpolation gradients to grad_input.

## ATen Mapping

- `upsample_bicubic2d_backward.grad_input`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/upsample_bicubic2d_backward_grad_input.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/upsample_bicubic2d_backward_grad_input.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_bicubic2d_backward_grad_input.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_bicubic2d_backward_grad_input.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_bicubic2d_backward_grad_input.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_bicubic2d_backward_grad_input.py)
