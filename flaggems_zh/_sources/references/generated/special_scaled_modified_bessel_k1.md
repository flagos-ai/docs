---
orphan: true
---

# special_scaled_modified_bessel_k1

**Kind:** Math | **Stage:** alpha | **Since:** 5.4

## Description

Computes the scaled modified Bessel function of the first kind
of order 1 (scaled K_1(x) = exp(x)*K_1(x)) for each element in the input tensor.

## ATen Mapping

- `special.scaled_modified_bessel_k1`
- `special.scaled_modified_bessel_k1.out`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/special_scaled_modified_bessel_k1.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/special_scaled_modified_bessel_k1.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_special_scaled_modified_bessel_k1.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_special_scaled_modified_bessel_k1.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_special_scaled_modified_bessel_k1.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_special_scaled_modified_bessel_k1.py)
