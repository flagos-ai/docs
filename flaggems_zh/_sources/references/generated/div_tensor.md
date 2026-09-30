---
orphan: true
---

# div_tensor

**Kind:** Math | **Stage:** stable | **Since:** 2.1

## Description

Divides each element of the input `input` by the corresponding element of `other`.
Note that `torch.divide()` is an alias of `torch.div()` and `torch.true_divide()`
is an alias of `torch.div()` with `rounding_mode=None`.

## ATen Mapping

- `div.Tensor`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/div_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/div_tensor.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_div_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_div_tensor.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_div_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_div_tensor.py)
