---
orphan: true
---

# pad_sequence

**Kind:** Utility, NeuralNetwork | **Stage:** beta | **Since:** 5.5

## Description

Pads a list of variable length tensors with a given padding value and stacks them into a single padded batch tensor.

## ATen Mapping

- `pad_sequence`

## Labels

`aten`, `sequence`, `rnn`

## Source Code

- [src/flag_gems/ops/pad_sequence.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/pad_sequence.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_pad_sequence.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_pad_sequence.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_pad_sequence.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_pad_sequence.py)
