---
orphan: true
---

# rms_norm

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 2.0 | **C++:** 4.0

## Description

Apply Root Mean Square Layer Normalization over a mini-batch of inputs.

## ATen Mapping

- `RMSNorm`

## Labels

`aten`, `nn.functional`, `Reduction`

## Source Code

- [src/flag_gems/ops/rms_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/rms_norm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_rms_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_rms_norm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_rms_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_rms_norm.py)
