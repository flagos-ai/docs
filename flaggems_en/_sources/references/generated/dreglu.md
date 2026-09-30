---
orphan: true
---

# dreglu

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Rectified Gated Linear Unit is a variant of GLU that uses ReLU instead of
the sigmoid function for gating. This is the backward case.

## ATen Mapping

- `dreglu`

## Labels

`fused`, `Transformer`

## Source Code

- [src/flag_gems/fused/dreglu.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/dreglu.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dreglu.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dreglu.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dreglu.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dreglu.py)
