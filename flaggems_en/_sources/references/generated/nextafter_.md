---
orphan: true
---

# nextafter_

**Kind:** Math | **Stage:** alpha | **Since:** 5.4

## Description

Returns the next representable floating-point value from `input` toward
`other`, elementwise. In-place version of `nextafter`.

## ATen Mapping

- `nextafter_`

## Labels

`aten`, `pointwise`

## Source Code

- [src/flag_gems/ops/nextafter.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/nextafter.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nextafter_.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_nextafter_.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nextafter_.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_nextafter_.py)
