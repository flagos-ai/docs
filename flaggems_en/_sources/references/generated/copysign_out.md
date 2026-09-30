---
orphan: true
---

# copysign_out

**Kind:** Tensor | **Stage:** beta | **Since:** 5.3

## Description

A variant of `copysign` that allows the output to be saved into `out`.

## ATen Mapping

- `copysign.out`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/copysign.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/copysign.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_copysign_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_copysign_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_copysign_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_copysign_out.py)
