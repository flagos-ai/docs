---
orphan: true
---

# new_full

**Kind:** Tensor | **Stage:** beta | **Since:** 5.3

## Description

Returns a Tensor of size `size` filled with `fill_value`.
By default, the returned Tensor has the same `torch.dtype` and `torch.device`
as this tensor.

## ATen Mapping

- `new_full.Tensor`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/new_full.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/new_full.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_new_full.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_new_full.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_new_full.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_new_full.py)
