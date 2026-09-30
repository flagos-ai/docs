---
orphan: true
---

# normed_cumsum

**Kind:** Reduction | **Stage:** stable | **Since:** 2.1

## Description

Get the normalized cumulative sum where each step is divided by the total sum
of the dataset, resulting in values ranging from 0 to 1.
Internally used by the `multinomial` operator.

## ATen Mapping

- `normed_cumsum`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/normed_cumsum.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/normed_cumsum.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_normed_cumsum.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_normed_cumsum.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_normed_cumsum.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_normed_cumsum.py)
