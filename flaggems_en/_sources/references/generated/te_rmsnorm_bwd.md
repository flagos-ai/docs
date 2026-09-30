---
orphan: true
---

# te_rmsnorm_bwd

**Kind:** NeuralNetwork | **Stage:** alpha | **Since:** 5.4

## Description

RMSNorm backward pass aligned with TransformerEngine's rmsnorm_bwd signature.
Computes gradients dx (w.r.t. input) and dgamma (w.r.t. weight).

## ATen Mapping

- `te_rmsnorm_bwd`

## Labels

`fused`, `Normalization`

## Source Code

- [src/flag_gems/fused/te_rmsnorm_bwd.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/te_rmsnorm_bwd.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_te_rmsnorm_bwd.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_te_rmsnorm_bwd.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_te_rmsnorm_bwd.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_te_rmsnorm_bwd.py)
