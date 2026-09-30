---
orphan: true
---

# nonzero

**Kind:** Tensor | **Stage:** stable | **Since:** 2.1 | **C++:** 4.0

## Description

Returns a 2-D tensor where each row is the index for a nonzero value.
When `as_tuple` is explicitly set to True, this returns a tuple of 1-D index tensors,
allowing for advanced indexing of all nonzero values.

## ATen Mapping

- `nonzero`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/nonzero.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/nonzero.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nonzero.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nonzero.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nonzero.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nonzero.py)
