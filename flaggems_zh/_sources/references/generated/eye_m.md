---
orphan: true
---

# eye_m

**Kind:** LinearAlg | **Stage:** stable | **Since:** 3.0

## Description

Triton-based implementation of `torch.eye_m(n, m)`, using 2D tiles to split the matrix into blocks.

## ATen Mapping

- `eye.m`

## Labels

`aten`, `Reduction`

## Source Code

- [src/flag_gems/ops/eye_m.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/eye_m.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_eye_m.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_eye_m.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_eye_m.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_eye_m.py)
