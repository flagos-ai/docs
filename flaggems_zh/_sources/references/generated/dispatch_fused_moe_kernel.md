---
orphan: true
---

# dispatch_fused_moe_kernel

**Kind:** MoE | **Stage:** stable | **Since:** 5.3

## Description

Accelerates neural network training by combining token routing (dispatch/all-to-all communication),
expert computation (GEMM), and result aggregation into a single GPU kernel.

## ATen Mapping

- `dispatch_fused_moe_kernel`

## Labels

`fused`, `Activation`, `vLLM`

## Source Code

- [src/flag_gems/fused/dispatch_fused_moe_kernel.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/dispatch_fused_moe_kernel.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dispatch_fused_moe_kernel.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dispatch_fused_moe_kernel.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dispatch_fused_moe_kernel.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dispatch_fused_moe_kernel.py)
