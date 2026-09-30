---
orphan: true
---

# bmm_w8a8_fp8

**Kind:** BLAS | **Stage:** alpha | **Since:** 5.4

## Description

Performs batched matrix multiplication with block-wise FP8 E4M3
quantized activations and weights using FP32 accumulation.

## Labels

`NoCPU`, `Quantization`

## Source Code

- [src/flag_gems/ops/bmm_w8a8_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/bmm_w8a8_fp8.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_bmm_w8a8_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_bmm_w8a8_fp8.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_bmm_w8a8_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_bmm_w8a8_fp8.py)
