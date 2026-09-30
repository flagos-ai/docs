---
orphan: true
---

# baddbmm

**Kind:** BLAS | **Stage:** stable | **Since:** 4.1

## Description

Performs a batch matrix-matrix product of matrices in `batch1` and `batch2`.
`input` is added to the final result. `batch1` and `batch2` must be 3-D tensors
each containing the same number of matrices.

## ATen Mapping

- `baddbmm`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/baddbmm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/baddbmm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_baddbmm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_baddbmm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_baddbmm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_baddbmm.py)
