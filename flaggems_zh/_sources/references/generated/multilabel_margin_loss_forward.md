---
orphan: true
---

# multilabel_margin_loss_forward

**Kind:** NeuralNetwork | **Stage:** alpha | **Since:** 5.5

## Description

Computes the forward multi-label margin loss and returns both the loss and the per-class target membership mask.

## ATen Mapping

- `multilabel_margin_loss_forward`

## Labels

`aten`, `Loss`

## Source Code

- [src/flag_gems/ops/multilabel_margin_loss_forward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/multilabel_margin_loss_forward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_multilabel_margin_loss_forward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_multilabel_margin_loss_forward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_multilabel_margin_loss_forward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_multilabel_margin_loss_forward.py)
