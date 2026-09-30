---
orphan: true
---

# conj_physical_

**Kind:** LinearAlg | **Stage:** alpha | **Since:** 5.4

## Description

In-place version of `conj_physical`.
Computes the element-wise conjugate of the given `input` tensor in place.
If `input` has a non-complex dtype, this function just returns `input`.

## ATen Mapping

- `conj_physical_`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/conj_physical.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/conj_physical.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_conj_physical_.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_conj_physical_.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_conj_physical_.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_conj_physical_.py)
