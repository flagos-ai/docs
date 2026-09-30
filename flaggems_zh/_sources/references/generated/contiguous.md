---
orphan: true
---

# contiguous

**Kind:** Tensor | **Stage:** removed | **Since:** 4.1 | **C++:** 4.0

## Description

Returns a contiguous in memory tensor containing the same data as `self` tensor.

## ATen Mapping

- `contiguous`

## Labels

`aten`, `skip_precision_check`

## Source Code

- [src/flag_gems/ops/contiguous.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/contiguous.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_contiguous.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_contiguous.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_contiguous.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_contiguous.py)
