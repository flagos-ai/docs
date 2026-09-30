---
orphan: true
---

# multi_margin_loss_backward_out

**Kind:** NeuralNetwork | **Stage:** alpha | **Since:** 5.5

## Description

Writes the multi-class margin-loss gradient into grad_input.

## ATen Mapping

- `multi_margin_loss_backward.grad_input`

## Labels

`aten`, `Loss`

## Source Code

- [src/flag_gems/ops/multi_margin_loss_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/multi_margin_loss_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_multi_margin_loss_backward_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_multi_margin_loss_backward_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_multi_margin_loss_backward_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_multi_margin_loss_backward_out.py)
