---
orphan: true
---

# sort_stable

**Kind:** Tensor | **Stage:** stable | **Since:** 3.0

## Description

Sorts the elements of the `input` tensor along a given dimension in ascending order by value.
This is a variant of `sort()` where `stable` is set to True to preserve the order of equivalent elements.

## ATen Mapping

- `sort.stable`

## Labels

`aten`, `skip_precision_check`

## Source Code

- [src/flag_gems/ops/sort_stable.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/sort_stable.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sort_stable.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sort_stable.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sort_stable.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sort_stable.py)
