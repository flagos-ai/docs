---
orphan: true
---

# rwkv_mm_sparsity

**Kind:** RWKV | **Stage:** stable | **Since:** 4.1 | **C++:** 4.0

## Description

Optimized, lossless sparse matrix multiplication in RWKV-7 models.

## ATen Mapping

- `rwkv_mm_sparsity`

## Labels

`fused`

## Source Code

- [src/flag_gems/fused/rwkv_mm_sparsity.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/rwkv_mm_sparsity.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_rwkv_mm_sparsity.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_rwkv_mm_sparsity.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_rwkv_mm_sparsity.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_rwkv_mm_sparsity.py)
