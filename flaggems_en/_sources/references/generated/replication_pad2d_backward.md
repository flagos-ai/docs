---
orphan: true
---

# replication_pad2d_backward

**Kind:** NeuralNetwork | **Stage:** alpha | **Since:** 5.4

## Description

Computes the gradient for replication_pad2d. Gradients from padded output are redistributed back to the original input boundaries via replication (edge-value duplication) semantics.

## ATen Mapping

- `replication_pad2d_backward`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/replication_pad2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/replication_pad2d_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_replication_pad2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_replication_pad2d_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_replication_pad2d_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_replication_pad2d_backward.py)
