---
orphan: true
---

# where_self

**Kind:** Tensor | **Stage:** stable | **Since:** 2.1

## Description

Returns a LongTensor. This operation is identical to `torch.nonzero(condition, as_tuple=True)`.

## ATen Mapping

- `where.self`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/where_self.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/where_self.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_where_self.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_where_self.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_where_self.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_where_self.py)
