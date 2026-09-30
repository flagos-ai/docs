---
orphan: true
---

# w8a8_block_fp8_matmul

**Kind:** BLAS | **Stage:** alpha | **Since:** 5.3

## Description

Performs matrix multiplication with block-wise quantization.

## ATen Mapping

- `vllm.model_executor.layers.quantization.utils.fp8_utils.w8a8_block_fp8_matmul`

## Labels

`vLLM`

## Source Code

- [src/flag_gems/ops/w8a8_block_fp8_matmul.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/w8a8_block_fp8_matmul.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_w8a8_block_fp8_matmul.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_w8a8_block_fp8_matmul.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_w8a8_block_fp8_matmul.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_w8a8_block_fp8_matmul.py)
