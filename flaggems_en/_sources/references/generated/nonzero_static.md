---
orphan: true
---

# nonzero_static

**Kind:** Tensor | **Stage:** alpha | **Since:** 5.4

## Description

Returns a fixed-size 2-D int64 tensor containing indices of nonzero elements.
Rows beyond the number of nonzero elements are filled with `fill_value`.

## ATen Mapping

- `nonzero_static`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/nonzero_static.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/nonzero_static.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nonzero_static.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nonzero_static.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nonzero_static.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nonzero_static.py)
