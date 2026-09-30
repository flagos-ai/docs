---
orphan: true
---

# fused_marlin_moe_w4a16_int4

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.4

## Description

Fused MoE with GPTQ INT4 (uint4b8) W4A16 weights in plain row-major layout; Triton wna16 fused-dequant GEMM with SwiGLU activation, aligned with vLLM's fused_marlin_moe call signature.

## ATen Mapping

- `flag_gems.fused.fused_marlin_moe.fused_marlin_moe`

## Labels

`fused`, `vLLM`, `MoE`

## Source Code

- [src/flag_gems/fused/fused_marlin_moe_w4a16_int4.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/fused_marlin_moe_w4a16_int4.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fused_marlin_moe_w4a16_int4.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fused_marlin_moe_w4a16_int4.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fused_marlin_moe_w4a16_int4.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fused_marlin_moe_w4a16_int4.py)
