---
orphan: true
---

# all_dim

**Kind:** Math | **Stage:** stable | **Since:** 2.0

## Description

For each row of `input` in the given dimension `dim`, returns True if all elements
in the row evaluate to True and False otherwise.

## ATen Mapping

- `all.dim`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/all_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/all_dim.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_all_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_all_dim.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_all_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_all_dim.py)
