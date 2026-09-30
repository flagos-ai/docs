---
orphan: true
---

# addcdiv

**Kind:** LinearAlg | **Stage:** stable | **Since:** 4.0

## Description

Performs the element-wise division of `tensor1` by `tensor2`, multiplies the result
by the scalar `value` and adds it to `input`.

## ATen Mapping

- `addcdiv`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/addcdiv.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/addcdiv.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addcdiv.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_addcdiv.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addcdiv.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_addcdiv.py)
