---
orphan: true
---

# stage_deepseek_v4_mega_moe_inputs

**Kind:** NeuralNetwork | **Stage:** alpha | **Since:** 5.4

## Description

Stages DeepSeekV4 Mega-MoE inputs by quantizing hidden states to FP8
with UE8M0 scales and copying top-k indices and weights to output buffers.

## ATen Mapping

- `stage_deepseek_v4_mega_moe_inputs`

## Labels

`fused`, `DeepSeekV4`, `MoE`

## Source Code

- [src/flag_gems/fused/stage_deepseek_v4_mega_moe_inputs.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/stage_deepseek_v4_mega_moe_inputs.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_stage_deepseek_v4_mega_moe_inputs.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_stage_deepseek_v4_mega_moe_inputs.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_stage_deepseek_v4_mega_moe_inputs.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_stage_deepseek_v4_mega_moe_inputs.py)
