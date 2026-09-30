---
orphan: true
---

# sparse_sampled_addmm

**Kind:** BLAS | **Stage:** alpha | **Since:** 5.4

## Description

Computes alpha * (mat1 @ mat2) * spy(input) + beta * input, where input is a sparse CSR tensor
and spy(input) keeps only its sparsity pattern. The result shares the CSR pattern with input.

## ATen Mapping

- `sparse_sampled_addmm`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/sparse_sampled_addmm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/sparse_sampled_addmm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sparse_sampled_addmm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sparse_sampled_addmm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sparse_sampled_addmm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sparse_sampled_addmm.py)
