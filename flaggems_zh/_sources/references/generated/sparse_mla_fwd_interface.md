---
orphan: true
---

# sparse_mla_fwd_interface

**Kind:** DSA | **Stage:** stable | **Since:** 5.3

## Description

A generic interface for sparse MLA (Multi-head Latent Attention) for DeepSeek v3/v3.2.
It is currently not exposed as a standalone operator for use.

## ATen Mapping

- `sparse_mla_fwd`

## Labels

`fused`

## Source Code

- [src/flag_gems/fused/sparse_mla_fwd_interface.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/sparse_mla_fwd_interface.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sparse_mla_fwd_interface.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_sparse_mla_fwd_interface.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sparse_mla_fwd_interface.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_sparse_mla_fwd_interface.py)
