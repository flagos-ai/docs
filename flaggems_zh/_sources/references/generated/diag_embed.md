---
orphan: true
---

# diag_embed

**Kind:** Tensor | **Stage:** stable | **Since:** 2.2

## Description

Creates a tensor whose diagonals of certain 2D planes (specified by `dim1` and `dim2`) are filled by `input`.
To facilitate creating batched diagonal matrices, the 2D planes formed by the last two dimensions
of the returned tensor are chosen by default.

## ATen Mapping

- `diag_embed`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/diag_embed.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/diag_embed.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_diag_embed.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_diag_embed.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_diag_embed.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_diag_embed.py)
