---
orphan: true
---

# real

**Kind:** Tensor | **Stage:** alpha | **Since:** 5.5

## Description

Returns the real component of a complex tensor as a zero-copy view. For
non-complex tensors, returns the input tensor unchanged.

## ATen Mapping

- `real`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/real.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/real.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_real.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_real.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_real.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_real.py)
