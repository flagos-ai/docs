---
orphan: true
---

# dswiglu

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Swish-Gated Linear Unit, a variant of GLU with the Swish activation function.
This is for the backward case.

## ATen Mapping

- `dswiglu`

## Labels

`fused`, `Transformer`

## Source Code

- [src/flag_gems/fused/dswiglu.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/dswiglu.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dswiglu.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_dswiglu.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dswiglu.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_dswiglu.py)
