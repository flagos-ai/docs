---
orphan: true
---

# cp_gather_indexer_k_quant_cache

**Kind:** Quantization | **Stage:** beta | **Since:** 5.3

## Description

This is a fused operator that gathers FP8 K cache values and scales.

## Labels

`fused`, `vLLM`

## Source Code

- [src/flag_gems/fused/cp_gather_indexer_k_quant_cache.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/cp_gather_indexer_k_quant_cache.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cp_gather_indexer_k_quant_cache.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cp_gather_indexer_k_quant_cache.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cp_gather_indexer_k_quant_cache.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cp_gather_indexer_k_quant_cache.py)
