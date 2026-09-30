---
orphan: true
---

# linalg_qr_out

**Kind:** LinearAlg | **Stage:** beta | **Since:** 5.4

## Description

The `out=` variant of `linalg_qr`; writes the Q and R factors into the caller-provided output tensors.

## ATen Mapping

- `linalg_qr.out`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_qr.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_qr.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_qr_out.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_qr_out.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_qr_out.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_qr_out.py)
