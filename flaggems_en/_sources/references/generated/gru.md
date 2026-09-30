---
orphan: true
---

# gru

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.4

## Description

Gated recurrent unit (GRU). At each time step, computes a new hidden state from the input and the previous hidden state using a reset gate and an update gate, across one or more layers and optionally bidirectionally.

## ATen Mapping

- `gru.input`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/gru.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/gru.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_gru.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_gru.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_gru.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_gru.py)
