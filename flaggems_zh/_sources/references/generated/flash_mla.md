---
orphan: true
---

# flash_mla

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 3.0

## Description

A variant of Multi-head Latent Attention (MLA).

## ATen Mapping

- `triton_mla._forward_decode`

## Labels

`fused`, `Attention`, `vLLM`

## Source Code

- [src/flag_gems/fused/flash_mla.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/flash_mla.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_flash_mla.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_flash_mla.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_flash_mla.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_flash_mla.py)
