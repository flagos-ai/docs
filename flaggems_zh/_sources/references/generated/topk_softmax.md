---
orphan: true
---

# topk_softmax

**Kind:** MoE | **Stage:** stable | **Since:** 4.0

## Description

Selects the k most likely next-token candicates, sets all others to zero,
and renormalize the prbabilities of these top candidates.

## ATen Mapping

- `_moe_C.topk_softmax`

## Labels

`fused`, `vLLM`

## Source Code

- [src/flag_gems/fused/topk_softmax.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/topk_softmax.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_topk_softmax.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_topk_softmax.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_topk_softmax.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_topk_softmax.py)
