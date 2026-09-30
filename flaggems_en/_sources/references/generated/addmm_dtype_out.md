---
orphan: true
---

# addmm_dtype_out

**Kind:** BLAS | **Stage:** beta | **Since:** 5.3

## Description

A variant of `addmm_dtype()` that allows the output to be saved to the provided `out` parameter.

## ATen Mapping

- `addmm.dtype_out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/addmm_dtype.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/addmm_dtype.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addmm_dtype_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addmm_dtype_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addmm_dtype_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addmm_dtype_out.py)
