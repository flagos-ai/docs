# Release Notes

This section includes the release information for FlagGems-vLLM.

## v0.2.0

- **Added features**:
  - DeepSeek V4 sparse attention operators: Mega-MoE input staging, fused indexer Q with RoPE and quantization, and sparse attention forward.
  - Qwen4 model operators, including QSA paged attention kernels, grouped Gemma RMSNorm, and hyper-connection operators.
  - Flash Linear Attention operators: chunk Kimi Delta Attention (KDA), chunk gated delta rule, and parallel native sparse attention (NSA) with its compression variant.
  - MoE operators: a generic fused MoE interface, GPTQ INT4/MXFP4 fused MoE, router GEMM, and persistent top-K decoding.
  - Quantization and linear algebra operators: scaled INT8 quantization and scaled matrix multiplication, with scaled INT8 quantization extended to MetaX, Hygon, Moore Threads, Iluvatar, Enflame, Ascend, and Kunlunxin.
  - Attention operators: FP8 variable-length FlashAttention-2 with block-wise descales, paged FP8/FP4 multi-query attention logits, and a unified paged attention kernel supporting GQA.
  - The exported operator set now covers 109 operators. For more information, see [Operator List](../reference/operator_list.md).
- **Improved features**:
  - Performance tuning for chunk gated delta rule, chunk KDA, grouped top-K, fused add-RMSNorm, MoE summation, FP8 MQA logits, and scaled matrix multiplication.

## v0.1.0

- **Added features**:
  - Initial release of FlagGems-vLLM as part of FlagOS.
  - Implemented the first set of optimized operators for vLLM inference acceleration. For more information, see [Operator List](../reference/operator_list.md).
