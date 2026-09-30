---
orphan: true
---

# cummaxmin_backward

**Kind:** Math | **Stage:** alpha | **Since:** 5.4

## Description

Backward pass shared by `cummax` and `cummin`. Scatter-adds the output gradient back to the
input positions selected during the forward pass (given by `indices`), accumulating in
float32 for numerical stability. Equivalent to `grad_input.scatter_add_(dim, indices, grad_output)`.

## ATen Mapping

- `cummaxmin_backward`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/cummaxmin_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/cummaxmin_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cummaxmin_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cummaxmin_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cummaxmin_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cummaxmin_backward.py)
