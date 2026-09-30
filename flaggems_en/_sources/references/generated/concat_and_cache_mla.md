---
orphan: true
---

# concat_and_cache_mla

**Kind:** Attention | **Stage:** beta | **Since:** 3.0

## Description

Writes the latent and RoPE value into KV cache for Multi-head Latent Attention forward case.

## ATen Mapping

- `_C_cache_ops.concat_and_cache_mla`

## Labels

`fused`, `MLA`

## Source Code

- [src/flag_gems/fused/concat_and_cache_mla.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/concat_and_cache_mla.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_concat_and_cache_mla.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_concat_and_cache_mla.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_concat_and_cache_mla.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_concat_and_cache_mla.py)
