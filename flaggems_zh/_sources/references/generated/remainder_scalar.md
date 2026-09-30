---
orphan: true
---

# remainder_scalar

**Kind:** Math | **Stage:** stable | **Since:** 2.2

## Description

Computes Python's modulus operation entrywise. The result has the same sign
as the divisor `other` and its absolute value is less than that of `other`.

## ATen Mapping

- `remainder.Scalar`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/remainder_scalar.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/remainder_scalar.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_remainder_scalar.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_remainder_scalar.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_remainder_scalar.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_remainder_scalar.py)
