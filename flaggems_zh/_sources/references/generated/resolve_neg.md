---
orphan: true
---

# resolve_neg

**Kind:** Science | **Stage:** stable | **Since:** 2.1

## Description

Returns a new tensor with materialized negation if `input`'s negative bit is set to True,
else returns `input`. The output tensor will always have its negative bit set to False.

## ATen Mapping

- `resolve_neg`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/resolve_neg.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/resolve_neg.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_resolve_neg.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_resolve_neg.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_resolve_neg.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_resolve_neg.py)
