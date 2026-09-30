---
orphan: true
---

# sobol_engine_initialize_state_

**Kind:** Math | **Stage:** alpha | **Since:** 5.5.0

## Description

Initializes Sobol quasi-random number generator state with direction numbers.
This is a low-level operation that fills a (dimension, 30) state tensor with
pre-computed Sobol direction numbers used for generating low-discrepancy sequences.

## ATen Mapping

- `_sobol_engine_initialize_state_`

## Labels

`aten`, `pointwise`, `random`

## Source Code

- [src/flag_gems/ops/sobol_engine_initialize_state.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/sobol_engine_initialize_state.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sobol_engine_initialize_state_.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sobol_engine_initialize_state_.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sobol_engine_initialize_state_.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sobol_engine_initialize_state_.py)
