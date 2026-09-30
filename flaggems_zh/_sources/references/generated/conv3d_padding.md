---
orphan: true
---

# conv3d_padding

**Kind:** Convolution | **Stage:** stable | **Since:** 4.2

## Description

Applies a 3D convolution over a quantized 3D input composed of several input planes.

## ATen Mapping

- `conv3d.padding`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/conv3d_padding.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/conv3d_padding.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_conv3d_padding.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_conv3d_padding.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_conv3d_padding.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_conv3d_padding.py)
