---
orphan: true
---

# scaled_dot_product_attention

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 2.2

## Description

Computes scaled dot product attention on query, key and value tensors,
using an optional attention mask if passed and applying dropout
if a probability greater than 0.0 is specified.
The optional scale argument can only be specified as a keyword argument.

## ATen Mapping

- `scaled_dot_product_attention`

## Labels

`nn.functional`, `Attention`

## Source Code

- [src/flag_gems/ops/scaled_dot_product_attention.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/scaled_dot_product_attention.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scaled_dot_product_attention.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scaled_dot_product_attention.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scaled_dot_product_attention.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scaled_dot_product_attention.py)
