---
orphan: true
---

# polygamma

**Kind:** Math | **Stage:** alpha | **Since:** 5.4

## Description

Computes the n-th derivative of the digamma function of the input (the polygamma function),
dispatching to dedicated digamma (n=0), trigamma (n=1), or Hurwitz-zeta (n>=2) Triton kernels.

## ATen Mapping

- `polygamma`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/polygamma.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/polygamma.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_polygamma.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_polygamma.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_polygamma.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_polygamma.py)
