---
orphan: true
---

# resolve_conj

**Kind:** Science | **Stage:** stable | **Since:** 2.1

## Description

Returns a new tensor with materialized conjugation if `input`'s conjugate bit is set to True,
else returns `input`. The output tensor will always have its conjugate bit set to False.

## ATen Mapping

- `resolve_conj`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/resolve_conj.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/resolve_conj.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_resolve_conj.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_resolve_conj.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_resolve_conj.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_resolve_conj.py)
