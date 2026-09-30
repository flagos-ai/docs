---
orphan: true
---

# count_nonzero

**Kind:** Tensor | **Stage:** stable | **Since:** 2.2

## Description

Counts the number of non-zero values in the tensor `input` along the given `dim`.
If no `dim` is specified then all non-zeros in the tensor are counted.

## ATen Mapping

- `count_nonzero`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/count_nonzero.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/count_nonzero.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_count_nonzero.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_count_nonzero.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_count_nonzero.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_count_nonzero.py)
