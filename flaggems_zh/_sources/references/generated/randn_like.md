---
orphan: true
---

# randn_like

**Kind:** Distribution | **Stage:** stable | **Since:** 2.1

## Description

Returns a tensor with the same size as `input` that is filled with random numbers
from a normal distribution with mean 0 and variance 1.

## ATen Mapping

- `randn_like`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/randn_like.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/randn_like.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_randn_like.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_randn_like.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_randn_like.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_randn_like.py)
