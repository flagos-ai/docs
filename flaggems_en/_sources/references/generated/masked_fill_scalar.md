---
orphan: true
---

# masked_fill_scalar

**Kind:** Tensor | **Stage:** stable | **Since:** 2.2

## Description

Fills elements of given tensor with `value` where `mask` is True.

## ATen Mapping

- `masked_fill.Scalar`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/masked_fill_scalar.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/masked_fill_scalar.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_masked_fill_scalar.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_masked_fill_scalar.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_masked_fill_scalar.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_masked_fill_scalar.py)
