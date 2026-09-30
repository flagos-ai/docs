---
orphan: true
---

# per_token_group_quant_fp8

**Kind:** Quantization | **Stage:** beta | **Since:** 5.3

## Description

Function to perform per-token-group quantization on an input tensor `x`.
It converts the tensor values into signed float8 values and returns the
quantized tensor along with the scaling factor used for quantization.

## ATen Mapping

- `_C.per_token_group_fp8_quant`

## Labels

`NoCPU`, `vLLM`

## Source Code

- [src/flag_gems/ops/per_token_group_quant_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/per_token_group_quant_fp8.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_per_token_group_quant_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_per_token_group_quant_fp8.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_per_token_group_quant_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_per_token_group_quant_fp8.py)
