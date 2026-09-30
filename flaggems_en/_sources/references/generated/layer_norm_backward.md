---
orphan: true
---

# layer_norm_backward

**Kind:** Reduction | **Stage:** stable | **Since:** 3.0

## Description

The backward case for `layer_norm()`.

## ATen Mapping

- `native_layer_norm_backward`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/layer_norm_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/layer_norm_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_layer_norm_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_layer_norm_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_layer_norm_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_layer_norm_backward.py)
