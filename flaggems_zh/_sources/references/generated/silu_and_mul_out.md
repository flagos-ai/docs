---
orphan: true
---

# silu_and_mul_out

**Kind:** Activation | **Stage:** stable | **Since:** 2.0

## Description

A variant of `silu_and_mul` with an extra `out` argument.

## ATen Mapping

- `silu_and_mul.out`

## Labels

`fused`, `pointwise`, `vLLM`

## Source Code

- [src/flag_gems/fused/silu_and_mul_out.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/silu_and_mul_out.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_silu_and_mul_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_silu_and_mul_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_silu_and_mul_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_silu_and_mul_out.py)
