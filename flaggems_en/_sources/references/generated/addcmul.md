---
orphan: true
---

# addcmul

**Kind:** LinearAlg | **Stage:** stable | **Since:** 4.0

## Description

Performs the element-wise multiplication of `tensor1` by `tensor2`,
multiplies the result by the scalar `value` and adds it to `input`.

## ATen Mapping

- `addcmul`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/addcmul.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/addcmul.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addcmul.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addcmul.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addcmul.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addcmul.py)
