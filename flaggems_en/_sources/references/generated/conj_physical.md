---
orphan: true
---

# conj_physical

**Kind:** LinearAlg | **Stage:** beta | **Since:** 5.3

## Description

Computes the element-wise conjugate of the given `input` tensor.
If `input` has a non-complex dtype, this function just returns `input`.

## ATen Mapping

- `conj_physical`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/conj_physical.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/conj_physical.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_conj_physical.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_conj_physical.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_conj_physical.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_conj_physical.py)
