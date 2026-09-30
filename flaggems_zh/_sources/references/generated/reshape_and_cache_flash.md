---
orphan: true
---

# reshape_and_cache_flash

**Kind:** Attention | **Stage:** stable | **Since:** 3.0 | **C++:** 4.0

## Description

Store the key/value token states into the pre-allcated kv_cache buffers of paged attention.

## ATen Mapping

- `reshape_and_cache_flash`

## Labels

`fused`

## Source Code

- [src/flag_gems/fused/reshape_and_cache_flash.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/reshape_and_cache_flash.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_reshape_and_cache_flash.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_reshape_and_cache_flash.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_reshape_and_cache_flash.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_reshape_and_cache_flash.py)
