---
orphan: true
---

# to_copy

**Kind:** Tensor | **Stage:** stable | **Since:** 5.3

## Description

Copies a tensor to a different dtype, layout, device, or memory format, exposed as the low-level `_to_copy` aten operator.

## ATen Mapping

- `_to_copy`

## Labels

`aten`, `pointwise`, `skip_precision_check`

## Source Code

- [src/flag_gems/ops/to_copy.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/to_copy.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_to_copy.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_to_copy.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_to_copy.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_to_copy.py)
