---
orphan: true
---

# logspace

**Kind:** tensor | **Stage:** stable | **Since:** 4.0

## Description

Creates a one-dimensional tensor of size `steps` whose values are evenly spaced
from `base^start` to `base^end`, inclusive, on a logarithmic scale with base `base`.

## ATen Mapping

- `logspace`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/logspace.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/logspace.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_logspace.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_logspace.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_logspace.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_logspace.py)
