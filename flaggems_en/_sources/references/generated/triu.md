---
orphan: true
---

# triu

**Kind:** BLAS | **Stage:** stable | **Since:** 1.0

## Description

Returns the upper triangular part of a matrix (2-D tensor) or batch of matrices `input`,
the other elements of the result tensor `out` are set to 0.

## ATen Mapping

- `triu`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/triu.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/triu.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_triu.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_triu.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_triu.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_triu.py)
