---
orphan: true
---

# cumprod_backward

**Kind:** Math | **Stage:** alpha | **Since:** 5.5.0

## Description

Backward pass for `cumprod`. Given the output gradient, the forward input and the forward
output, computes the gradient with respect to the input. Zero elements along the reduction
dimension are handled explicitly: the reverse cumulative sum of `grad * output` divided by
`input` gives the gradient for non-zero positions, while the first zero position uses a
modified cumulative product. Accumulation is performed in float32 for numerical stability.

## ATen Mapping

- `cumprod_backward`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/cumprod_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/cumprod_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cumprod_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cumprod_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cumprod_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cumprod_backward.py)
