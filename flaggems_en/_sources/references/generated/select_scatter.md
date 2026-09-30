---
orphan: true
---

# select_scatter

**Kind:** Tensor | **Stage:** stable | **Since:** 2.2

## Description

Embeds the values of the `src` tensor into `input` at the given index.
This function returns a tensor with fresh storage; it does not create a view.

## ATen Mapping

- `select_scatter`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/select_scatter.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/select_scatter.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_select_scatter.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_select_scatter.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_select_scatter.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_select_scatter.py)
