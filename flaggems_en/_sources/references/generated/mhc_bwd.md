---
orphan: true
---

# mhc_bwd

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

The backward case for MHC (Manifold-Constrained Hyper-Connections).
This is the Triton implmentation for Sinkhorn implicit CG differentiation.
It computes the gradient of the Sinkhorn normalization using implicit differentiation via the conjugate gradient method.

## ATen Mapping

- `mhc_bwd`

## Labels

`fused`, `vLLM`, `DSA`

## Source Code

- [src/flag_gems/fused/mhc_bwd.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/mhc_bwd.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mhc_bwd.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mhc_bwd.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mhc_bwd.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mhc_bwd.py)
