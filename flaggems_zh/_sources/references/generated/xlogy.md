---
orphan: true
---

# xlogy

**Kind:** Math | **Stage:** beta | **Since:** 5.4

## Description

Computes `input * log(other)` element-wise, returning zero where `input` is zero (following PyTorch's `xlogy` semantics).

## ATen Mapping

- `xlogy.Tensor`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/xlogy.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/xlogy.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_xlogy.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_xlogy.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_xlogy.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_xlogy.py)
