---
orphan: true
---

# fused_q_kv_rmsnorm

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Applies RMSNorm to Q and KV tensors in a single fused kernel for DeepSeekV4 attention.

## ATen Mapping

- `vllm.v1.attention.ops.deepseek_v4_ops.fused_q_kv_rmsnorm`

## Labels

`fused`, `Attention`, `vLLM`, `DeepSeekV4`

## Source Code

- [src/flag_gems/fused/fused_q_kv_rmsnorm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/fused_q_kv_rmsnorm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fused_q_kv_rmsnorm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fused_q_kv_rmsnorm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fused_q_kv_rmsnorm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fused_q_kv_rmsnorm.py)
