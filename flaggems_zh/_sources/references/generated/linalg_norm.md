---
orphan: true
---

# linalg_norm

**Kind:** LinearAlg | **Stage:** beta | **Since:** 5.4

## Description

Computes a vector or matrix norm, mirroring torch.linalg.norm dispatch.
The vector branch (ord=None/2/1/0/p/±inf, dim as int or 1-tuple or None)
reuses linalg_vector_norm; the matrix branch (ord='fro'/'nuc'/±1/±2/±inf,
dim as 2-tuple) reuses linalg_matrix_norm.

## ATen Mapping

- `linalg_norm`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_norm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_norm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_norm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_norm.py)
