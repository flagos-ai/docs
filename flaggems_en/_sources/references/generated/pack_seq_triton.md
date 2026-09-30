---
orphan: true
---

# pack_seq_triton

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Pack variable-length token sequences into a padded batched tensor.

## ATen Mapping

- `pack_seq_triton`

## Labels

`fused`, `vLLM`, `DeepSeekV4`

## Source Code

- [src/flag_gems/fused/pack_seq_triton.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/pack_seq_triton.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_pack_seq_triton.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_pack_seq_triton.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_pack_seq_triton.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_pack_seq_triton.py)
