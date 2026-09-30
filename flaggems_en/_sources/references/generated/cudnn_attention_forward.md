---
orphan: true
---

# cudnn_attention_forward

**Kind:** NeuralNetwork | **Stage:** beta | **Since:** 5.5

## Description

Forward kernel for cuDNN attention, computing scaled dot-product
attention outputs and log-sum-exp statistics.  Uses a Triton
FlashAttention-2 kernel in BHSD layout.

## ATen Mapping

- `_cudnn_attention_forward`

## Labels

`aten`, `NoCPU`

## Source Code

- [src/flag_gems/ops/cudnn_attention_forward.py](https://github.com/flagos-ai/FlagGems/blob/master/src/flag_gems/ops/cudnn_attention_forward.py)

## Tests

- **Accuracy:** [https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cudnn_attention_forward.py](https://github.com/flagos-ai/FlagGems/blob/master/tests/test_cudnn_attention_forward.py)
- **Performance:** [https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cudnn_attention_forward.py](https://github.com/flagos-ai/FlagGems/blob/master/benchmark/test_cudnn_attention_forward.py)
