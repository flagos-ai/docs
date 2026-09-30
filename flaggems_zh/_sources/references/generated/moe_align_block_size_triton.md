---
orphan: true
---

# moe_align_block_size_triton

**Kind:** MoE | **Stage:** stable | **Since:** 4.2

## Description

Aligns the token distribution across experts to be compatible with block size
for matrix multiplication.

## ATen Mapping

- `_moe_C.align_block_size`

## Labels

`fused`, `Reduction`, `vLLM`

## Source Code

- [src/flag_gems/fused/moe_align_block_size_triton.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/moe_align_block_size_triton.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_moe_align_block_size_triton.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_moe_align_block_size_triton.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_moe_align_block_size_triton.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_moe_align_block_size_triton.py)
