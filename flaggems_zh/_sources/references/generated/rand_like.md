---
orphan: true
---

# rand_like

**Kind:** Distribution | **Stage:** stable | **Since:** 2.1

## Description

Returns a tensor with the same size as `input` that is filled with random numbers
from a uniform distribution on the interval `[0,1)`.

## ATen Mapping

- `rand_like`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/rand_like.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/rand_like.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_rand_like.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_rand_like.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_rand_like.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_rand_like.py)
