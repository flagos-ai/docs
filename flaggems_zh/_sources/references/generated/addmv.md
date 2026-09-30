---
orphan: true
---

# addmv

**Kind:** BLAS | **Stage:** stable | **Since:** 4.0

## Description

Performs a matrix-vector product of the matrix `mat` and the vector `vec`.
The vector `input` is added to the final result.

## ATen Mapping

- `addmv`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/addmv.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/addmv.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addmv.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addmv.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addmv.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addmv.py)
