---
orphan: true
---

# fp8_fp4_mega_moe

**Kind:** MoE, NeuralNetwork | **Stage:** alpha | **Since:** 5.4

## Description

Functional Triton fallback for local FP8 x FP4 MegaMoE. It consumes
staged FP8 activations, packed FP4 expert weights, scales, and top-k
routing tensors, then computes the two-layer SwiGLU MoE output.

## ATen Mapping

- `flag_gems.fused.fp8_fp4_mega_moe`
- `vllm.third_party.deep_gemm.fp8_fp4_mega_moe`

## Labels

`fused`, `vLLM`, `Triton`

## Source Code

- [src/flag_gems/fused/fp8_fp4_mega_moe.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/fp8_fp4_mega_moe.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fp8_fp4_mega_moe.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fp8_fp4_mega_moe.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fp8_fp4_mega_moe.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fp8_fp4_mega_moe.py)
