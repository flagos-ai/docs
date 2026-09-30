---
orphan: true
---

# tril_out

**Kind:** BLAS | **Stage:** beta | **Since:** 5.3

## Description

A variant of `tril()` that explicitly assigns the output to the `out` parameter.

## ATen Mapping

- `tril.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/tril.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/tril.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_tril_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_tril_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_tril_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_tril_out.py)
