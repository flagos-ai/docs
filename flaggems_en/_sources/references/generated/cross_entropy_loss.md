---
orphan: true
---

# cross_entropy_loss

**Kind:** NeuralNetwork | **Stage:** removed | **Since:** 3.0

## Description

Computes the cross entropy loss between input logits and target.

## ATen Mapping

- `CrossEntropyLoss`

## Labels

`fused`, `Reduction`

## Source Code

- [src/flag_gems/fused/cross_entropy_loss.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/cross_entropy_loss.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cross_entropy_loss.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cross_entropy_loss.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cross_entropy_loss.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cross_entropy_loss.py)
