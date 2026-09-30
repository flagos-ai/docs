---
orphan: true
---

# indexer_k_quant_and_cache

**Kind:** Quantization | **Stage:** beta | **Since:** 5.3

## Description

This is a fused operator that quantizes K tensors and writes them into the FP8 KV cache.

## Labels

`fused`, `vLLM`

## Source Code

- [src/flag_gems/fused/indexer_k_quant_and_cache.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/indexer_k_quant_and_cache.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_indexer_k_quant_and_cache.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_indexer_k_quant_and_cache.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_indexer_k_quant_and_cache.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_indexer_k_quant_and_cache.py)
