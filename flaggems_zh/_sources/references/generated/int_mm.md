---
orphan: true
---

# int_mm

**Kind:** BLAS | **Stage:** alpha | **Since:** 5.5

## Description

Performs matrix multiplication of two two-dimensional int8 tensors and returns a contiguous int32 tensor.

## ATen Mapping

- `_int_mm`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/int_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/int_mm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_int_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_int_mm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_int_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_int_mm.py)
