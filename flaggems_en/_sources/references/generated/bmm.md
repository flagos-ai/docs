---
orphan: true
---

# bmm

**Kind:** BLAS | **Stage:** stable | **Since:** 1.0 | **C++:** 4.0

## Description

Performs a batch matrix-matrix product of matrices stored in `input` and `mat2`.

## ATen Mapping

- `bmm`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/bmm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/bmm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_bmm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_bmm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_bmm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_bmm.py)
