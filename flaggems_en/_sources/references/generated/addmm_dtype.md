---
orphan: true
---

# addmm_dtype

**Kind:** BLAS | **Stage:** beta | **Since:** 5.3

## Description

A variant of `addmm` that allows the dtype of the output tensor to be specified.
This is supported only on CUDA and for `torch.float32` given `torch.float16` or `torch.bfloat16` input dtypes.

## ATen Mapping

- `addmm.dtype`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/addmm_dtype.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/addmm_dtype.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addmm_dtype.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addmm_dtype.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addmm_dtype.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addmm_dtype.py)
