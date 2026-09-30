---
orphan: true
---

# flash_attn_varlen_func

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 3.1 | **C++:** 4.0

## Description

Compute attention for sequences of variable lengths within a single batch.
Eliminating the need for padding.

## ATen Mapping

- `flash_attn_varlen_func`

## Labels

`aten`, `Attention`, `FlashAttention`

## Source Code

- [src/flag_gems/ops/flash_attn_varlen_func.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/flash_attn_varlen_func.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_flash_attn_varlen_func.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_flash_attn_varlen_func.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_flash_attn_varlen_func.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_flash_attn_varlen_func.py)
