---
orphan: true
---

# reshape_and_cache

**Kind:** Attention | **Stage:** stable | **Since:** 3.0

## Description

Store the key/value token states into the pre-allcated kv_cache buffers of paged attention.

## ATen Mapping

- `reshape_and_cache`

## Labels

`fused`, `vLLM`

## Source Code

- [src/flag_gems/fused/reshape_and_cache.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/reshape_and_cache.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_reshape_and_cache.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_reshape_and_cache.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_reshape_and_cache.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_reshape_and_cache.py)
