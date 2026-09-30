---
orphan: true
---

# apply_repetition_penalties

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 5.0

## Description

Modifies logit tensors in place to penalize tokens that have already appeared in the generated sequence.

## ATen Mapping

- `_C.apply_repetition_penalties_`

## Labels

`fused`, `vLLM`

## Source Code

- [src/flag_gems/fused/apply_repetition_penalties.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/apply_repetition_penalties.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_apply_repetition_penalties.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_apply_repetition_penalties.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_apply_repetition_penalties.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_apply_repetition_penalties.py)
