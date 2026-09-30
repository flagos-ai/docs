---
orphan: true
---

# compute_global_topk_indices_and_lens

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Converts local top-k sparse attention indices to global KV-cache indices and computes
valid top-k lengths for DeepSeekV4 attention.

## ATen Mapping

- `vllm.v1.attention.ops.deepseek_v4_ops.compute_global_topk_indices_and_lens`

## Labels

`fused`, `Attention`, `vLLM`, `DeepSeekV4`

## Source Code

- [src/flag_gems/fused/compute_global_topk_indices_and_lens.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/compute_global_topk_indices_and_lens.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_compute_global_topk_indices_and_lens.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_compute_global_topk_indices_and_lens.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_compute_global_topk_indices_and_lens.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_compute_global_topk_indices_and_lens.py)
