---
orphan: true
---

# unsafe_index

**Kind:** Reduction | **Stage:** beta | **Since:** 5.4

## Description

Indexes `input` along each dimension with the given indices, matching
`aten._unsafe_index`. Unlike the safe `index` operator, it performs no
bounds checking and rejects `bool` / `int8` masks.

## ATen Mapping

- `_unsafe_index`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/unsafe_index.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/unsafe_index.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_unsafe_index.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_unsafe_index.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_unsafe_index.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_unsafe_index.py)
