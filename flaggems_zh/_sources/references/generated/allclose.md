---
orphan: true
---

# allclose

**Kind:** Math | **Stage:** stable | **Since:** 2.1

## Description

This function checks if `input` and `other` satisfy a condition specified via
`atol` and `rtol` elementwise, for all elements of `input` and `other`.

## ATen Mapping

- `allclose`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/allclose.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/allclose.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_allclose.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_allclose.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_allclose.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_allclose.py)
