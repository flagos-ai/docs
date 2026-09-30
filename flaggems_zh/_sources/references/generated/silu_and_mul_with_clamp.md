---
orphan: true
---

# silu_and_mul_with_clamp

**Kind:** Activation | **Stage:** stable | **Since:** 5.3

## Description

A custom operator in vLLM as activation function for SwiGLU.

## ATen Mapping

- `silu_and_mul_with_clamp`

## Labels

`fused`, `pointwise`, `vLLM`

## Source Code

- [src/flag_gems/fused/silu_and_mul_with_clamp.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/silu_and_mul_with_clamp.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_silu_and_mul_with_clamp.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_silu_and_mul_with_clamp.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_silu_and_mul_with_clamp.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_silu_and_mul_with_clamp.py)
