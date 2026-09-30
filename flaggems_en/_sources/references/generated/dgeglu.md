---
orphan: true
---

# dgeglu

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 5.0

## Description

Gaussian Error Gated Linear Unit with GELU activation instead of sigmoid function.
This is for the backward case.

## ATen Mapping

- `dgeglu`

## Labels

`fused`, `Transformer`

## Source Code

- [src/flag_gems/fused/dgeglu.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/dgeglu.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dgeglu.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dgeglu.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dgeglu.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dgeglu.py)
