---
orphan: true
---

# get_scheduler_metadata

**Kind:** Attention | **Stage:** stable | **Since:** 4.0

## Description

Computes scheduling metadata for attention work partitioning so that
CPU computations can be routed to ISA-specific kernel implmentations.
The metadata is stored in a tensor.

## ATen Mapping

- `get_scheduler_metadata`

## Labels

`NoCPU`, `vLLM`

## Source Code

- [src/flag_gems/ops/get_scheduler_metadata.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/get_scheduler_metadata.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_get_scheduler_metadata.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_get_scheduler_metadata.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_get_scheduler_metadata.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_get_scheduler_metadata.py)
