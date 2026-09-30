---
orphan: true
---

# any_dims

**Kind:** Math | **Stage:** stable | **Since:** 2.0

## Description

For each row of `input` in the given dimensions in `dims`, returns True if any element in the row evaluate to True and False otherwise.
The `dims` contains tuple of ints indicating the dimensions to reduce.

## ATen Mapping

- `any.dims`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/any_dims.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/any_dims.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_any_dims.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_any_dims.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_any_dims.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_any_dims.py)
