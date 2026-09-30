---
orphan: true
---

# apply_rotary_pos_emb

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 2.0

## Description

A method to incorporate positional information into the Transformer architecture.
Rotary Positional Embedding (RoPE) applies position-dependent rotation to the query (Q)
and key (K) vectors before computing the attention score.

## ATen Mapping

- `apply_rotary_pos_emb`

## Labels

`fused`

## Source Code

- [src/flag_gems/fused/apply_rotary_pos_emb.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/apply_rotary_pos_emb.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_apply_rotary_pos_emb.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_apply_rotary_pos_emb.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_apply_rotary_pos_emb.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_apply_rotary_pos_emb.py)
