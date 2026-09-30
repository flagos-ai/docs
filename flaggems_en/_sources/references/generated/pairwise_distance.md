---
orphan: true
---

# pairwise_distance

**Kind:** Math | **Stage:** alpha | **Since:** 5.4

## Description

Computes the pairwise distance between input vectors, or between columns of input matrices.
Distances are computed using p-norm, with constant eps added to avoid division
by zero if p is negative.

## ATen Mapping

- `pairwise_distance`

## Labels

`aten`, `nn.functional`

## Source Code

- [src/flag_gems/ops/pairwise_distance.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/pairwise_distance.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_pairwise_distance.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_pairwise_distance.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_pairwise_distance.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_pairwise_distance.py)
