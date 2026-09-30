---
orphan: true
---

# full

**Kind:** Tensor | **Stage:** stable | **Since:** 2.1

## Description

Creates a tensor of size `size` filled with `fill_value`.
The tensor's dtype is inferred from `fill_value`.

## ATen Mapping

- `full`

## Labels

`aten`, `pointwise`, `skip_precision_check`

## Source Code

- [src/flag_gems/ops/full.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/full.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_full.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_full.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_full.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_full.py)
