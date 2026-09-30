---
orphan: true
---

# fused_deepseek_v4_qnorm_rope_kv_rope_quant_insert

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Horizontally-fused DeepseekV4-MLA.
per-head RMSNorm + GPT-J RoPE for Q, and GPT-J RoPE + UE8M0 FP8
quant + paged cache insert for KV, all in one kernel launch.

## ATen Mapping

- `torch.ops._C.fused_deepseek_v4_qnorm_rope_kv_rope_quant_insert`

## Labels

`fused`, `vLLM`, `DeepSeekV4`

## Source Code

- [src/flag_gems/fused/fused_deepseek_v4_qnorm_rope_kv_rope_quant_insert.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/fused_deepseek_v4_qnorm_rope_kv_rope_quant_insert.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fused_deepseek_v4_qnorm_rope_kv_rope_quant_insert.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fused_deepseek_v4_qnorm_rope_kv_rope_quant_insert.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fused_deepseek_v4_qnorm_rope_kv_rope_quant_insert.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fused_deepseek_v4_qnorm_rope_kv_rope_quant_insert.py)
