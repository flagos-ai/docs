---
orphan: true
---

# embedding_dense_backward

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 5.0

## Description

Calculates the gradient of the weight matrix for a dense embedding layer during backpropagation.

## ATen Mapping

- `embedding_dense_backward`

## Labels

`aten`, `NoCPU`

## Source Code

- [src/flag_gems/ops/embedding_dense_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/embedding_dense_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_embedding_dense_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_embedding_dense_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_embedding_dense_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_embedding_dense_backward.py)
