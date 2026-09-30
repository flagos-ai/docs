---
orphan: true
---

# fused_indexer_q_rope_quant

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.4

## Description

Applies RoPE to sparse indexer Q, quantizes it to FP8 or MXFP4, and folds
indexer weights for DeepSeekV4 attention.

## ATen Mapping

- `vllm.v1.attention.ops.deepseek_v4_ops.fused_indexer_q_rope_quant`

## Labels

`fused`, `Attention`, `vLLM`, `DeepSeekV4`

## Source Code

- [src/flag_gems/fused/fused_indexer_q_rope_quant.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/fused_indexer_q_rope_quant.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fused_indexer_q_rope_quant.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fused_indexer_q_rope_quant.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fused_indexer_q_rope_quant.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fused_indexer_q_rope_quant.py)
