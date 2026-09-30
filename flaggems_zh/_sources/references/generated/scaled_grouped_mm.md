---
orphan: true
---

# scaled_grouped_mm

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.4

## Description

Performs grouped matrix multiplication with row-wise and column-wise scaling,
commonly used by quantized Mixture-of-Experts (MoE) workloads.

## ATen Mapping

- `_scaled_grouped_mm`

## Labels

`MoE`

## Source Code

- [src/flag_gems/ops/scaled_grouped_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/scaled_grouped_mm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scaled_grouped_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_scaled_grouped_mm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scaled_grouped_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_scaled_grouped_mm.py)
