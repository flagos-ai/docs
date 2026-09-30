---
orphan: true
---

# index_select

**Kind:** Tensor | **Stage:** stable | **Since:** 2.1

## Description

Returns a new tensor which indexes the `input` tensor along dimension `dim`
using the entries in `index`.

## ATen Mapping

- `index_select`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/index_select.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/index_select.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_index_select.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_index_select.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_index_select.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_index_select.py)
