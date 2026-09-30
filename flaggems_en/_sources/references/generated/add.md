---
orphan: true
---

# add

**Kind:** Math | **Stage:** stable | **Since:** 1.0 | **C++:** 4.0

## Description

Add a scalar or tensor to `self` tensor. If both `alpha` and `other` are specified,
each element of `other` is scaled by `alpha` before being used.

## ATen Mapping

- `add.Tensor`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/add.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/add.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_add.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_add.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_add.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_add.py)
