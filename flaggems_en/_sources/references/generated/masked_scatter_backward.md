---
orphan: true
---

# masked_scatter_backward

**Kind:** tensor | **Stage:** alpha | **Since:** 5.4

## Description

Backward of `masked_scatter` with respect to the `source` tensor.
Returns a tensor of shape `sizes` where the first ``mask.sum()`` elements
are the gradient values from the positions where ``mask`` was True
(obtained via stream-compaction / masked_select), and the remaining
elements are zero (the tail of `source` that was never consumed by the
forward pass).

## ATen Mapping

- `masked_scatter_backward`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/masked_scatter_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/masked_scatter_backward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_masked_scatter_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_masked_scatter_backward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_masked_scatter_backward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_masked_scatter_backward.py)
