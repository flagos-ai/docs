---
orphan: true
---

# addmm

**Kind:** BLAS | **Stage:** stable | **Since:** 1.0 | **C++:** 4.0

## Description

Performs a matrix multiplication of the matrices `mat1` and `mat2`.
The matrix `input` is added to the final result.

## ATen Mapping

- `addmm`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/addmm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/addmm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addmm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addmm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addmm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addmm.py)
