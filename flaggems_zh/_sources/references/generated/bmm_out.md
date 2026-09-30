---
orphan: true
---

# bmm_out

**Kind:** BLAS | **Stage:** stable | **Since:** 5.0 | **C++:** 4.0

## Description

Performs a batch matrix-matrix product of matrices stored in `input` and `mat2`.
This is a variant of `bmm` with `out` specified.

## ATen Mapping

- `bmm.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/bmm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/bmm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_bmm_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_bmm_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_bmm_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_bmm_out.py)
