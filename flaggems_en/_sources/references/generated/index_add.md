---
orphan: true
---

# index_add

**Kind:** Tensor | **Stage:** stable | **Since:** 2.2

## Description

Accumulate the elements of `alpha` times `source` into the `input` tensor
by adding to the indices in the order given in `index`.

## ATen Mapping

- `index_add`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/index_add.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/index_add.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_index_add.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_index_add.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_index_add.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_index_add.py)
