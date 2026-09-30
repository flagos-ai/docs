---
orphan: true
---

# sparse_sampled_addmm_out

**Kind:** BLAS | **Stage:** alpha | **Since:** 5.4

## Description

A variant of sparse_sampled_addmm that assigns the result to the provided sparse CSR out tensor.

## ATen Mapping

- `sparse_sampled_addmm.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/sparse_sampled_addmm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/sparse_sampled_addmm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sparse_sampled_addmm_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sparse_sampled_addmm_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sparse_sampled_addmm_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sparse_sampled_addmm_out.py)
