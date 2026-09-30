---
orphan: true
---

# mhc_pre

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

Triton implementation of mHC Pre operator (optimized v2).

## ATen Mapping

- `vllm.model_executor.layers.mhc.mhc_pre`

## Labels

`fused`, `vLLM`, `DSA`

## Source Code

- [src/flag_gems/fused/mhc_pre.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/mhc_pre.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mhc_pre.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_mhc_pre.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mhc_pre.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_mhc_pre.py)
