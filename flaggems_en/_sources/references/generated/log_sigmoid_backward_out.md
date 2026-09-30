---
orphan: true
---

# log_sigmoid_backward_out

**Kind:** NeuralNetwork | **Stage:** alpha | **Since:** 5.4

## Description

A variant of `log_sigmoid_backward` that assigns the output to the `grad_input` tensor.

## ATen Mapping

- `log_sigmoid_backward.grad_input`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/log_sigmoid_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/log_sigmoid_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_log_sigmoid_backward_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_log_sigmoid_backward_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_log_sigmoid_backward_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_log_sigmoid_backward_out.py)
