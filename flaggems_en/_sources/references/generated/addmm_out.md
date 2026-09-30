---
orphan: true
---

# addmm_out

**Kind:** BLAS | **Stage:** stable | **Since:** 4.0

## Description

A variant of `addmm` that assigns to the output to the provided `out` parameter.

## ATen Mapping

- `addmm.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/addmm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/addmm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addmm_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addmm_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addmm_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addmm_out.py)
