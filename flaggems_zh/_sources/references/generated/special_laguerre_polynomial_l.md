---
orphan: true
---

# special_laguerre_polynomial_l

**Kind:** Math | **Stage:** alpha | **Since:** 5.5

## Description

Computes the Laguerre polynomial :math:`L_n(x)` element-wise for tensor
and scalar x/n overloads, including destination-passing variants.

## ATen Mapping

- `special_laguerre_polynomial_l`
- `special_laguerre_polynomial_l.out`
- `special_laguerre_polynomial_l.x_scalar`
- `special_laguerre_polynomial_l.x_scalar_out`
- `special_laguerre_polynomial_l.n_scalar`
- `special_laguerre_polynomial_l.n_scalar_out`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/special_laguerre_polynomial_l.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/special_laguerre_polynomial_l.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_special_laguerre_polynomial_l.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_special_laguerre_polynomial_l.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_special_laguerre_polynomial_l.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_special_laguerre_polynomial_l.py)
