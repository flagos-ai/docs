---
orphan: true
---

# dropout

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 1.0

## Description

An internal IR for implementing `torch.nn.functional.dropout`.

## ATen Mapping

- `native_dropout`

## Labels

`aten`, `nn.functional`

## Source Code

- [src/flag_gems/ops/dropout.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/dropout.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dropout.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dropout.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dropout.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dropout.py)
