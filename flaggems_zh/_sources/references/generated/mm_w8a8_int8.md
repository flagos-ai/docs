---
orphan: true
---

# mm_w8a8_int8

**Kind:** BLAS | **Stage:** alpha | **Since:** 5.5

## Description

Multiplies prequantized INT8 matrices with scalar or per-row/column FP32 scales and optional bias; input quantization is external.

## ATen Mapping

- `mm_w8a8_int8`

## Labels

`non-aten`

## Source Code

- [src/flag_gems/ops/mm_w8a8_int8.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/mm_w8a8_int8.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mm_w8a8_int8.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mm_w8a8_int8.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mm_w8a8_int8.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mm_w8a8_int8.py)
