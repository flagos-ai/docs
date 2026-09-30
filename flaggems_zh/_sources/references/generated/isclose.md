---
orphan: true
---

# isclose

**Kind:** Math | **Stage:** stable | **Since:** 2.1

## Description

Returns a new tensor with boolean elements representing if each element of `input`
is "close" to the corresponding element of `other`.
The closeness is defined with `rtol` and `atol`.

## ATen Mapping

- `isclose`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/isclose.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/isclose.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_isclose.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_isclose.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_isclose.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_isclose.py)
