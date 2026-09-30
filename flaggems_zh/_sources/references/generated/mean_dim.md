---
orphan: true
---

# mean_dim

**Kind:** Reduction | **Stage:** stable | **Since:** 2.0

## Description

Returns the mean value of each row of the `input` tensor in the given dimension `dim`.
If `dim` is a list of dimensions, reduce over all of them.

## ATen Mapping

- `mean.dim`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/mean_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/mean_dim.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mean_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mean_dim.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mean_dim.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mean_dim.py)
