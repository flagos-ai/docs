---
orphan: true
---

# fused_marlin_moe_w8a16_int8

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.4

## Description

Fused MoE with GPTQ INT8 (uint8b128) W8A16 weights; Triton wna16 fused-dequant GEMM with SwiGLU activation, aligned with vLLM's fused_marlin_moe call signature.

## ATen Mapping

- `flag_gems.fused.fused_marlin_moe.fused_marlin_moe`

## Labels

`fused`, `vLLM`, `MoE`

## Source Code

- [src/flag_gems/fused/fused_marlin_moe_w8a16_int8.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/fused_marlin_moe_w8a16_int8.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fused_marlin_moe_w8a16_int8.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fused_marlin_moe_w8a16_int8.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fused_marlin_moe_w8a16_int8.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fused_marlin_moe_w8a16_int8.py)
