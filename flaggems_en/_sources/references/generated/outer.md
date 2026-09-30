---
orphan: true
---

# outer

**Kind:** BLAS | **Stage:** stable | **Since:** 2.0

## Description

Computes outer product of self and the input vector.
If the self tensor is a vector of size `n` and the input tensor is a vector of size `m`,
the `out` tensor (if specified) must be a matrix of size `n * m`.

## ATen Mapping

- `outer.Tensor`

## Labels

`fused`

## Source Code

- [src/flag_gems/fused/outer.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/outer.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_outer.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_outer.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_outer.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_outer.py)
