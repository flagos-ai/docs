---
orphan: true
---

# log_softmax_out

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 3.0

## Description

An internal IR for applying a softmax followed by a logarithm.

## ATen Mapping

- `_log_softmax.out`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/log_softmax.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/log_softmax.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_log_softmax_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_log_softmax_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_log_softmax_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_log_softmax_out.py)
