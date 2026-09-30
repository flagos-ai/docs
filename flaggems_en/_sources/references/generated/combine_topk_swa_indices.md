---
orphan: true
---

# combine_topk_swa_indices

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Combines compressed top-k sparse attention indices with sliding-window attention indices
for DeepSeekV4 attention.

## ATen Mapping

- `vllm.v1.attention.ops.deepseek_v4_ops.combine_topk_swa_indices`

## Labels

`fused`, `Attention`, `vLLM`, `DeepSeekV4`

## Source Code

- [src/flag_gems/fused/combine_topk_swa_indices.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/combine_topk_swa_indices.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_combine_topk_swa_indices.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_combine_topk_swa_indices.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_combine_topk_swa_indices.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_combine_topk_swa_indices.py)
