---
orphan: true
---

# dyn_quant_matmul_4bit

**Kind:** BLAS | **Stage:** alpha | **Since:** 5.4

## Description

Dynamic per-row INT8 activation and signed INT4 weight matrix multiplication.

## ATen Mapping

- `_dyn_quant_matmul_4bit`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/dyn_quant_matmul_4bit.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/dyn_quant_matmul_4bit.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dyn_quant_matmul_4bit.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dyn_quant_matmul_4bit.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dyn_quant_matmul_4bit.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dyn_quant_matmul_4bit.py)
