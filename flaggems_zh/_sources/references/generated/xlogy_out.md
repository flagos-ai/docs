---
orphan: true
---

# xlogy_out

**Kind:** Math | **Stage:** beta | **Since:** 5.4

## Description

A variant of `xlogy` that allows the output to be assigned to an `out` tensor.

## ATen Mapping

- `xlogy.OutTensor`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/xlogy.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/xlogy.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_xlogy_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_xlogy_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_xlogy_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_xlogy_out.py)
