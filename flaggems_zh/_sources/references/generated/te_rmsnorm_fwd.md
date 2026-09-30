---
orphan: true
---

# te_rmsnorm_fwd

**Kind:** NeuralNetwork | **Stage:** alpha | **Since:** 5.4

## Description

RMSNorm forward pass aligned with TransformerEngine's rmsnorm_fwd signature.
Supports zero_centered_gamma, pre-allocated output tensor, and output dtype conversion.
Returns (output, None, rsigma).

## ATen Mapping

- `te_rmsnorm_fwd`

## Labels

`fused`, `Normalization`

## Source Code

- [src/flag_gems/fused/te_rmsnorm_fwd.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/te_rmsnorm_fwd.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_te_rmsnorm_fwd.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_te_rmsnorm_fwd.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_te_rmsnorm_fwd.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_te_rmsnorm_fwd.py)
