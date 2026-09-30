---
orphan: true
---

# mode

**Kind:** LinearAlg | **Stage:** beta | **Since:** 5.3

## Description

Returns a namedtuple (values, indices) where values is the mode value of each row of the input tensor in the given dimension dim, i.e. a value which appears most often in that row, and indices is the index location of each mode value found.

## ATen Mapping

- `mode`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/mode.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/mode.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mode.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mode.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mode.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mode.py)
