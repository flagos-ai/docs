---
orphan: true
---

# upsample_nearest3d

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 5.0

## Description

Performs 3D nearest-neighbor interpolation to increase the spatial size of volumetric data,
such as 5D tensors. It scales up inputs by copying values from the nearest pixel/voxel,
without calculating new values through linear interpolation.

## ATen Mapping

- `upsample_nearest3d`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/upsample_nearest3d.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/upsample_nearest3d.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_nearest3d.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_upsample_nearest3d.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_nearest3d.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_upsample_nearest3d.py)
