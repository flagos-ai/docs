---
orphan: true
---

# fp8_mqa_logits

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.3

## Description

For each token in the given E4M3 tensor, iterate all tokens from two other given tensors,
calculate the logit.

## ATen Mapping

- `vllm.utils.deep_gemm.fp8_mqa_logits`

## Labels

`fused`, `vLLM`

## Source Code

- [src/flag_gems/fused/fp8_mqa_logits.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/fused/fp8_mqa_logits.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fp8_mqa_logits.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_fp8_mqa_logits.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fp8_mqa_logits.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_fp8_mqa_logits.py)
