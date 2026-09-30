---
orphan: true
---

# scaled_mm_out

**Kind:** BLAS | **Stage:** beta | **Since:** 5.4

## Description

A variant of `_scaled_mm` that writes the result into `out`.

## ATen Mapping

- `_scaled_mm.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/scaled_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/scaled_mm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scaled_mm_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scaled_mm_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scaled_mm_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scaled_mm_out.py)
