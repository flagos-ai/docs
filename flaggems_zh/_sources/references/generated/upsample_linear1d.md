---
orphan: true
---

# upsample_linear1d

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Upsamples the `input`, using linear mode.
The input has to be 3 dimensional, and the `output_size` is an optional tuple of ints.

## ATen Mapping

- `upsample_linear1d`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/upsample_linear1d.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/upsample_linear1d.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_linear1d.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_linear1d.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_linear1d.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_linear1d.py)
