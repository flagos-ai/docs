---
orphan: true
---

# nan_to_num

**Kind:** Math | **Stage:** stable | **Since:** 3.0

## Description

Replaces `NaN`, positive infinity, and negative infinity values in `input`
with the values specified by `nan`, `posinf`, and `neginf`, respectively.

## ATen Mapping

- `nan_to_num`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/nan_to_num.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/nan_to_num.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nan_to_num.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nan_to_num.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nan_to_num.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nan_to_num.py)
