---
orphan: true
---

# conv1d_padding

**Kind:** Convolution | **Stage:** stable | **Since:** 4.2

## Description

Applies a 1D convolution over a quantized 1D input composed of several input planes.

## ATen Mapping

- `conv1d.padding`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/conv1d_padding.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/conv1d_padding.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_conv1d_padding.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_conv1d_padding.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_conv1d_padding.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_conv1d_padding.py)
