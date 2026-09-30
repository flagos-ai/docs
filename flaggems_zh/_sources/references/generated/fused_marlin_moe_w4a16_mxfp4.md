---
orphan: true
---

# fused_marlin_moe_w4a16_mxfp4

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.4

## Description

Fused MoE with MXFP4 (E2M1) W4A16 weights packed two codes per byte and E8M0 scales; Triton wna16 fused-dequant GEMM with SwiGLU activation, aligned with vLLM's fused_marlin_moe call signature.

## ATen Mapping

- `flag_gems.fused.fused_marlin_moe.fused_marlin_moe`

## Labels

`fused`, `vLLM`, `MoE`

## Source Code

- [src/flag_gems/fused/fused_marlin_moe_w4a16_mxfp4.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/fused_marlin_moe_w4a16_mxfp4.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fused_marlin_moe_w4a16_mxfp4.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fused_marlin_moe_w4a16_mxfp4.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fused_marlin_moe_w4a16_mxfp4.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fused_marlin_moe_w4a16_mxfp4.py)
