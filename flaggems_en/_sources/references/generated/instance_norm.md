---
orphan: true
---

# instance_norm

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Apply Instance Normalization independently for each channel in every data sample within a batch.

## ATen Mapping

- `instance_norm`

## Labels

`fused`

## Source Code

- [src/flag_gems/fused/instance_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/instance_norm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_instance_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_instance_norm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_instance_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_instance_norm.py)
