---
orphan: true
---

# unpack_seq_triton

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Unpack a packed sequence tensor back to its original variable-length form.

## ATen Mapping

- `unpack_seq_triton`

## Labels

`fused`, `vLLM`, `DeepSeekV4`

## Source Code

- [src/flag_gems/fused/unpack_seq_triton.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/unpack_seq_triton.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_unpack_seq_triton.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_unpack_seq_triton.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_unpack_seq_triton.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_unpack_seq_triton.py)
