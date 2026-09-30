---
orphan: true
---

# sigmoid

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 2.0

## Description

Computes the expit (also known as the logistic sigmoid function) of the elements of `input`.

## ATen Mapping

- `sigmoid`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/sigmoid.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/sigmoid.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sigmoid.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sigmoid.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sigmoid.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sigmoid.py)
