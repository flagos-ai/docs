---
orphan: true
---

# assert_async

**Kind:** Tensor | **Stage:** stable | **Since:** 5.3

## Description

A utility used to perform data-dependent assertions on GPU tensors
without triggering an immediate, performance-heavy GPU-to-CPU synchronization.

## ATen Mapping

- `_assert_async`

## Labels

`utility`

## Source Code

- [src/flag_gems/ops/assert_async.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/assert_async.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_assert_async.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_assert_async.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_assert_async.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_assert_async.py)
