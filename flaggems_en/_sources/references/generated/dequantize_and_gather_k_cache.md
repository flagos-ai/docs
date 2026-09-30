---
orphan: true
---

# dequantize_and_gather_k_cache

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Dequantizes FP8 K-cache entries and gathers them into a BF16 tensor for DeepSeekV4 attention.

## ATen Mapping

- `vllm.v1.attention.ops.deepseek_v4_ops.dequantize_and_gather_k_cache`

## Labels

`fused`, `Attention`, `vLLM`, `DeepSeekV4`

## Source Code

- [src/flag_gems/fused/dequantize_and_gather_k_cache.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/dequantize_and_gather_k_cache.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dequantize_and_gather_k_cache.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dequantize_and_gather_k_cache.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dequantize_and_gather_k_cache.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dequantize_and_gather_k_cache.py)
