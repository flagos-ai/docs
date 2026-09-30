---
orphan: true
---

# grouped_topk

**Kind:** MoE | **Stage:** stable | **Since:** 5.0

## Description

A specialized routing mechanism used in Mixture-of-Experts (MoE) models (like DeepSeek-V3/R1)
to select top-k experts by first grouping them, rather than selecting globally.

## ATen Mapping

- `_moe_C.grouped_topk`

## Labels

`fused`, `NoCPU`, `vLLM`

## Source Code

- [src/flag_gems/fused/grouped_topk.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/grouped_topk.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_grouped_topk.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_grouped_topk.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_grouped_topk.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_grouped_topk.py)
