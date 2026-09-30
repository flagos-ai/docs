---
orphan: true
---

# mm_w8a8_fp8

**Kind:** BLAS | **Stage:** alpha | **Since:** 5.4

## Description

Dynamically quantizes BF16 activations and weights to FP8 E4M3, computes their matrix product with FP8 Tensor Cores, and applies FP32 scales.

## Labels

`NoCPU`, `Quantization`

## Source Code

- [src/flag_gems/ops/mm_w8a8_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/mm_w8a8_fp8.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mm_w8a8_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mm_w8a8_fp8.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mm_w8a8_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mm_w8a8_fp8.py)
