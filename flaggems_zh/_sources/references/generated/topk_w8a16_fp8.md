---
orphan: true
---

# topk_w8a16_fp8

**Kind:** Tensor | **Stage:** alpha | **Since:** 5.4

## Description

Returns the k largest (or smallest) elements of a group-wise FP8 E4M3FN/E5M2 tensor along the last dimension, dequantizing with per-group scales.

## Labels

`NoCPU`, `Quantization`

## Source Code

- [src/flag_gems/ops/topk_w8a16_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/topk_w8a16_fp8.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_topk_w8a16_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_topk_w8a16_fp8.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_topk_w8a16_fp8.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_topk_w8a16_fp8.py)
