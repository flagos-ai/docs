---
orphan: true
---

# grouped_mm

**Kind:** BLAS | **Stage:** beta | **Since:** 5.3

## Description

Grouped matrix multiply is a functional operator designed to accelerate Mixture-of-Experts (MoE) models
by computing multiple matrix multiplications in a single kernel launch.

## ATen Mapping

- `_grouped_mm`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/grouped_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/grouped_mm.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_grouped_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_grouped_mm.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_grouped_mm.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_grouped_mm.py)
