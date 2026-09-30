---
orphan: true
---

# nll_loss2d_backward

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 2.2

## Description

An internal IR for supporting `torch.nn.NLLLoss2d`, which has been deprecated
and is now integrated into the standard `torch.nn.NLLLoss`.
This is the backward case.

## ATen Mapping

- `nll_loss2d_backward`

## Labels

`aten`, `IR`

## Source Code

- [src/flag_gems/ops/nll_loss2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/nll_loss2d_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nll_loss2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nll_loss2d_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nll_loss2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nll_loss2d_backward.py)
