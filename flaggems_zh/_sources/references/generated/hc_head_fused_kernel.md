---
orphan: true
---

# hc_head_fused_kernel

**Kind:** NeuralNetwork | **Stage:** stable | **Since:** 5.3

## Description

The head fusion kernel for MHC (Manifold-Constrained Hyper-Connections).
This fused implementation computes RMS-normalized hidden states and applies
per-head weighted mixing to produce the output activations.

## ATen Mapping

- `mhc_head_fused_kernel`

## Labels

`fused`, `vLLM`, `DSA`

## Source Code

- [src/flag_gems/fused/hc_head_fused_kernel.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/hc_head_fused_kernel.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_hc_head_fused_kernel.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_hc_head_fused_kernel.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_hc_head_fused_kernel.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_hc_head_fused_kernel.py)
