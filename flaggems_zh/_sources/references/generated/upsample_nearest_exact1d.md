---
orphan: true
---

# upsample_nearest_exact1d

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.0

## Description

Increases the length of a 1D tensor using nearest-neighbor interpolation,
ensuring the output aligns with library-standard algorithms like PIL.

## ATen Mapping

- `_upsample_nearest_exact1d`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/upsample_nearest_exact1d.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/upsample_nearest_exact1d.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_nearest_exact1d.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_nearest_exact1d.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_nearest_exact1d.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_nearest_exact1d.py)
