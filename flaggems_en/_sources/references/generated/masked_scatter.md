---
orphan: true
---

# masked_scatter

**Kind:** tensor | **Stage:** stable | **Since:** 4.2

## Description

Copies elements from `source` into the given tensor at positions where the `mask` is True.

## ATen Mapping

- `masked_scatter`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/masked_scatter.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/masked_scatter.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_masked_scatter.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_masked_scatter.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_masked_scatter.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_masked_scatter.py)
