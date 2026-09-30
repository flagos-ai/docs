---
orphan: true
---

# scaled_mm

**Kind:** BLAS | **Stage:** beta | **Since:** 5.4

## Description

Performs a scaled matrix multiplication. The result of `self @ mat2` is
multiplied by `scale_a` and `scale_b`, then an optional bias is added.

## ATen Mapping

- `_scaled_mm`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/scaled_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/scaled_mm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scaled_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scaled_mm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scaled_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scaled_mm.py)
