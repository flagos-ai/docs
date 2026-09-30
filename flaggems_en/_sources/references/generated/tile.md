---
orphan: true
---

# tile

**Kind:** Tensor | **Stage:** stable | **Since:** 2.1

## Description

Constructs a tensor by repeating the elements of `input`.
The `dims` argument specifies the number of repetitions in each dimension.

## ATen Mapping

- `tile`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/tile.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/tile.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_tile.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_tile.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_tile.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_tile.py)
