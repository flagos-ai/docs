---
orphan: true
---

# int_mm_out

**Kind:** BLAS | **Stage:** alpha | **Since:** 5.5

## Description

A variant of `_int_mm` that writes the int32 result into `out`.

## ATen Mapping

- `_int_mm.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/int_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/int_mm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_int_mm_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_int_mm_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_int_mm_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_int_mm_out.py)
