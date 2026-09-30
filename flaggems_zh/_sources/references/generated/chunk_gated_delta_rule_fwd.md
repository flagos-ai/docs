---
orphan: true
---

# chunk_gated_delta_rule_fwd

**Kind:** Attention | **Stage:** beta | **Since:** 5.3

## Description

The forward case for `ChunkGatedDeltaRuleFunction` with Flash Linear Attention (FLA).

## ATen Mapping

- `chunk_gated_delta_rule_fwd`

## Labels

`fused`, `FLA`

## Source Code

- [src/flag_gems/fused/chunk_gated_delta_rule_fwd.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/chunk_gated_delta_rule_fwd.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_chunk_gated_delta_rule_fwd.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_chunk_gated_delta_rule_fwd.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_chunk_gated_delta_rule_fwd.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_chunk_gated_delta_rule_fwd.py)
