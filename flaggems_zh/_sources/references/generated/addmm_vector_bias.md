---
orphan: true
---

# addmm_vector_bias

**Kind:** BLAS | **Stage:** beta | **Since:** 5.4

## Description

A variant of `addmm` that exercises the vector bias (1-D `input`) broadcast path.

## ATen Mapping

- `addmm`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/addmm_vector_bias.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/addmm_vector_bias.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addmm_vector_bias.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addmm_vector_bias.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addmm_vector_bias.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addmm_vector_bias.py)
