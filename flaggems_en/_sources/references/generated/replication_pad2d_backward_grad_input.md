---
orphan: true
---

# replication_pad2d_backward_grad_input

**Kind:** NeuralNetwork | **Stage:** alpha | **Since:** 5.4

## Description

A variant of `replication_pad2d_backward` that writes gradients into a pre-allocated `grad_input` tensor instead of allocating a new one.

## ATen Mapping

- `replication_pad2d_backward.grad_input`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/replication_pad2d_backward_grad_input.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/replication_pad2d_backward_grad_input.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_replication_pad2d_backward_grad_input.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_replication_pad2d_backward_grad_input.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_replication_pad2d_backward_grad_input.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_replication_pad2d_backward_grad_input.py)
