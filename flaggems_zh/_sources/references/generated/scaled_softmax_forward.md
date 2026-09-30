---
orphan: true
---

# scaled_softmax_forward

**Kind:** Reduction | **Stage:** stable | **Since:** 4.2

## Description

The backward pass for a scaled softmax function, commonly used in Scaled Dot-Product Attention (SDPA)
within Transformer models, computes the gradient of the loss with respect to the input logits,
incorporating a scaling factor to stabilize training.

## ATen Mapping

- `scaled_softmax_forward`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/scaled_softmax_forward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/scaled_softmax_forward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scaled_softmax_forward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scaled_softmax_forward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scaled_softmax_forward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scaled_softmax_forward.py)
