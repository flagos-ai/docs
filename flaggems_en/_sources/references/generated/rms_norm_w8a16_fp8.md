---
orphan: true
---

# rms_norm_w8a16_fp8

**Kind:** NeuralNetwork | **Stage:** alpha | **Since:** 5.4

## Description

Applies Root Mean Square Layer Normalization to BF16 activations using
group-wise FP8 E4M3 weights and per-group scales.

## Labels

`NoCPU`, `Normalization`, `Quantization`

## Source Code

- [src/flag_gems/ops/rms_norm_w8a16_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/rms_norm_w8a16_fp8.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_rms_norm_w8a16_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_rms_norm_w8a16_fp8.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_rms_norm_w8a16_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_rms_norm_w8a16_fp8.py)
