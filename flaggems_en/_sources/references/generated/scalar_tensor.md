---
orphan: true
---

# scalar_tensor

**Kind:** Tensor | **Stage:** alpha | **Since:** 5.4

## Description

Creates a 0-dimensional (scalar) tensor from a Python numeric value.
The tensor's dtype can be specified, otherwise inferred from the input value.

## ATen Mapping

- `scalar_tensor`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/scalar_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/scalar_tensor.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scalar_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scalar_tensor.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scalar_tensor.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scalar_tensor.py)
