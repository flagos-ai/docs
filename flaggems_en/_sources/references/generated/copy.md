---
orphan: true
---

# copy

**Kind:** Tensor | **Stage:** stable | **Since:** 5.3

## Description

As a wrapper of `copy_`, this operator copies elements from `src` to `out`
using given template for shapes.

## ATen Mapping

- `copy`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/copy.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/copy.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_copy.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_copy.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_copy.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_copy.py)
