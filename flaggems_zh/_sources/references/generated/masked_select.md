---
orphan: true
---

# masked_select

**Kind:** Tensor | **Stage:** stable | **Since:** 2.1

## Description

Returns a new 1-D tensor which indexes the `input` tensor according to
the boolean mask `mask` which is a BoolTensor.

## ATen Mapping

- `masked_select`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/masked_select.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/masked_select.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_masked_select.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_masked_select.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_masked_select.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_masked_select.py)
