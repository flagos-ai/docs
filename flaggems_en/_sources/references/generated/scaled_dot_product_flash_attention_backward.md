---
orphan: true
---

# scaled_dot_product_flash_attention_backward

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.4

## Description

Backward kernel for FlashAttention, computing gradients of queries, keys, values, and attention outputs efficiently.

## ATen Mapping

- `_scaled_dot_product_flash_attention_backward`

## Labels

`aten`, `NoCPU`

## Source Code

- [src/flag_gems/ops/scaled_dot_product_flash_attention_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/scaled_dot_product_flash_attention_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scaled_dot_product_flash_attention_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scaled_dot_product_flash_attention_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scaled_dot_product_flash_attention_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scaled_dot_product_flash_attention_backward.py)
