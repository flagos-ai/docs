---
orphan: true
---

# moe_sum

**Kind:** MoE | **Stage:** stable | **Since:** 4.2

## Description

An implementation of Mixture of Experts (MoE) with sum-based aggregation
instead of the more common weighted average.

## ATen Mapping

- `_moe_C.moe_sum`

## Labels

`fused`, `Reduction`, `vLLM`

## Source Code

- [src/flag_gems/fused/moe_sum.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/moe_sum.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_moe_sum.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_moe_sum.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_moe_sum.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_moe_sum.py)
