---
orphan: true
---

# outplace_fused_experts

**Kind:** MoE | **Stage:** stable | **Since:** 5.3

## Description

This operator allocates and returns a new output tensor.

## ATen Mapping

- `outplace_fused_experts`

## Labels

`fused`, `Activation`, `vLLM`

## Source Code

- [src/flag_gems/fused/outplace_fused_experts.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/outplace_fused_experts.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_outplace_fused_experts.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_outplace_fused_experts.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_outplace_fused_experts.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_outplace_fused_experts.py)
