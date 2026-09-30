---
orphan: true
---

# conv2d_padding

**Kind:** Convolution | **Stage:** stable | **Since:** 4.2

## Description

Applies a 2D convolution over a quantized 2D input composed of several input planes.

## ATen Mapping

- `conv2d.padding`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/conv2d_padding.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/conv2d_padding.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_conv2d_padding.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_conv2d_padding.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_conv2d_padding.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_conv2d_padding.py)
