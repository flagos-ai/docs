---
orphan: true
---

# mm_self_transpose

**Kind:** BLAS | **Stage:** beta | **Since:** 5.4

## Description

Multiplies a transposed view with its base tensor (`mm(inp, inp.t())`), exercising the column-major B operand path of `mm`.

## ATen Mapping

- `mm`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/mm_self_transpose.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/mm_self_transpose.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mm_self_transpose.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mm_self_transpose.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mm_self_transpose.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mm_self_transpose.py)
