---
orphan: true
---

# prod_dim_int

**Kind:** Reduction | **Stage:** stable | **Since:** 2.0

## Description

Returns the product of each row of the `input` tensor in the given dimension `dim`.

## ATen Mapping

- `prod.dim_int`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/prod_dim_int.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/prod_dim_int.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_prod_dim_int.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_prod_dim_int.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_prod_dim_int.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_prod_dim_int.py)
