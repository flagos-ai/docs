---
orphan: true
---

# upsample_nearest1d

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 5.0

## Description

Upsamples the `input`, using nearest neighbours' pixel values.
The input has to be 3 dimensional, and the `output_size` is an optional tuple of ints.

## ATen Mapping

- `upsample_nearest1d`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/upsample_nearest1d.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/upsample_nearest1d.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_nearest1d.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_nearest1d.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_nearest1d.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_nearest1d.py)
