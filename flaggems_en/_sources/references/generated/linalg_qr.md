---
orphan: true
---

# linalg_qr

**Kind:** LinearAlg | **Stage:** beta | **Since:** 5.4

## Description

Computes the QR decomposition of a matrix (or a batch of matrices) via a blocked Householder algorithm with a TSQR fast path for tall-skinny inputs. Pure-Triton implementation supporting the "reduced", "complete" and "r" modes.

## ATen Mapping

- `linalg_qr`

## Labels

`aten`

## Source Code

- [src/flag_gems/ops/linalg_qr.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/linalg_qr.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_qr.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_linalg_qr.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_qr.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_linalg_qr.py)
