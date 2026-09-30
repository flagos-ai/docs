---
orphan: true
---

# any_dim

**Kind:** Math | **Stage:** stable | **Since:** 2.0

## Description

For each row of `input` in the given dimension `dim`, returns True if any element in the row evaluate to True and False otherwise.

## ATen Mapping

- `any.dim`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/any_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/any_dim.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_any_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_any_dim.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_any_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_any_dim.py)
