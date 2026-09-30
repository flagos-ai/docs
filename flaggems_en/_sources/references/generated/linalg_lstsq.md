---
orphan: true
---

# linalg_lstsq

**Kind:** LinearAlg, BLAS | **Stage:** alpha | **Since:** 5.4

## Description

Computes the least-squares solution (gels driver) to A X = B for full-rank
over- or underdetermined systems, including batches, via Householder TSQR.

## ATen Mapping

- `linalg_lstsq`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_lstsq.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_lstsq.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_lstsq.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_lstsq.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_lstsq.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_lstsq.py)
