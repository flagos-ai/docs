---
orphan: true
---

# topk

**Kind:** Tensor | **Stage:** stable | **Since:** 2.1 | **C++:** 4.0

## Description

Returns the `k` largest elements of the given `input` tensor along a given dimension.
If `dim` is not given, the last dimension of the `input` is chosen.
If `largest` is False then the `k` smallest elements are returned.

## ATen Mapping

- `topk`

## Labels

`aten`, `skip_precision_check`

## Source Code

- [src/flag_gems/ops/topk.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/topk.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_topk.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_topk.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_topk.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_topk.py)
