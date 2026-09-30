# Operator List

This page lists the operators exported by FlagGems-vLLM, sourced from `src/flaggems_vllm/ops/__init__.py`.

FlagGems-vLLM provides optimized implementations of common vLLM operators using the Triton programming language. The following 109 operators are currently exported:

## Activation and Gating

| Operator | Description |
|----------|-------------|
| `dgeglu` | Backward pass for GEGLU activation |
| `dreglu` | Backward pass for ReGLU activation |
| `dswiglu` | Backward pass for SwiGLU activation |
| `geglu` | GEGLU (Gated Linear Unit with GELU) activation |
| `gelu_and_mul` | GELU activation combined with element-wise multiplication |
| `reglu` | ReGLU (Gated Linear Unit with ReLU) activation |
| `silu_and_mul` | SiLU (Swish) activation combined with element-wise multiplication |
| `silu_and_mul_out` | SiLU activation with multiplication (out-of-place variant) |
| `silu_and_mul_with_clamp` | SiLU activation with multiplication and clamping |
| `silu_and_mul_with_clamp_out` | SiLU activation with multiplication and clamping (out-of-place variant) |
| `swiglu` | SwiGLU (Gated Linear Unit with SiLU) activation |

## Attention

| Operator | Description |
|----------|-------------|
| `apply_rotary_pos_emb` | Apply rotary position embeddings |
| `chunk_kda` | Inference-only chunk Kimi Delta Attention (KDA) with Flash Linear Attention |
| `concat_and_cache_mla` | Concatenate and cache for MLA (Multi-Latent Attention) |
| `flash_attention_forward` | FlashAttention forward pass |
| `flash_attn_varlen_func` | FlashAttention with variable-length sequences |
| `flash_attn_varlen_func_w8a8_fp8` | Block-wise FP8 variable-length FlashAttention-2 with per-block descales |
| `flash_attn_varlen_opt_func` | Optimized FlashAttention with variable-length sequences |
| `flash_mla` | Flash Multi-Latent Attention |
| `flash_mla_sparse_fwd` | Sparse Flash MLA forward pass |
| `flash_mla_with_kvcache` | Flash MLA with KV cache support |
| `fp8_einsum` | Block-scaled FP8 bhr,hdr->bhd contraction |
| `fp8_fp4_mqa_logits` | Weighted MQA logits with FP8 or MXFP4 quantized Q and FP8 K |
| `fp8_fp4_paged_mqa_logits` | Paged MQA logits from FP8 queries against an FP8/FP4 paged KV cache |
| `mrope` | Multi-resolution rotary position embedding (M-RoPE) |
| `parallel_nsa` | Native Sparse Attention (NSA), parallel implementation |
| `parallel_nsa_compression` | NSA-style parallel compression forward with backward support |
| `persistent_topk` | vLLM-compatible persistent top-K decode with tiered dispatch |
| `reshape_and_cache` | Reshape and cache KV cache |
| `reshape_and_cache_flash` | Reshape and cache for FlashAttention |
| `sparse_attn_triton` | Sparse attention computation via Triton |
| `triton_unified_attention` | Paged attention with GQA, causal mask, and optional softcap |

## DeepSeek V4 Attention

| Operator | Description |
|----------|-------------|
| `combine_topk_swa_indices` | Combine top-K and sliding window attention indices for DeepSeek V4 |
| `compute_global_topk_indices_and_lens` | Compute global top-K indices and lengths for DeepSeek V4 |
| `dequantize_and_gather_k_cache` | Dequantize and gather K cache for DeepSeek V4 |
| `fused_q_kv_rmsnorm` | Fused Q/KV RMSNorm for DeepSeek V4 |
| `fused_deepseek_v4_qnorm_rope_kv_rope_quant_insert` | Fused Q-norm, RoPE, KV-RoPE, quantize, and insert for DeepSeek V4 |
| `stage_deepseek_v4_mega_moe_inputs` | Stage DeepSeek V4 Mega-MoE inputs: FP8 quantization of hidden states plus top-K index and weight copy |

## Mixture of Experts (MoE)

| Operator | Description |
|----------|-------------|
| `dispatch_fused_moe_kernel` | Dispatch fused MoE kernel |
| `fused_experts_impl` | Fused MoE experts implementation |
| `fused_marlin_moe` | Fused MoE with GPTQ INT4/MXFP4 weights and 16-bit activations |
| `grouped_topk` | Grouped top-K selection for MoE routing |
| `inplace_fused_experts` | In-place fused MoE experts |
| `invoke_fused_moe_triton_kernel` | Invoke fused MoE Triton kernel |
| `moe_align_block_size` | MoE block size alignment |
| `moe_align_block_size_no_tle` | MoE block size alignment without the TLE cooperative kernels |
| `moe_align_block_size_triton` | MoE block size alignment (Triton variant) |
| `moe_sum` | MoE expert output summation |
| `outplace_fused_experts` | Out-of-place fused MoE experts |
| `router_gemm` | BF16 x BF16 -> FP32 GEMM for the MoE router gate |
| `top_k_per_row_decode` | Top-K per row for decode phase |
| `top_k_per_row_prefill` | Top-K per row for prefill phase |
| `topk_softmax` | Top-K with softmax for MoE gating |
| `topk_softplus_sqrt` | Top-K with softplus and sqrt for MoE gating |

## Linear and Matrix

| Operator | Description |
|----------|-------------|
| `cutlass_scaled_mm` | Scaled matrix multiplication via CUTLASS |
| `mul` | Element-wise multiplication |
| `mul_` | Element-wise multiplication (in-place) |
| `mv` | Matrix-vector multiplication |
| `outer` | Outer product of two vectors |
| `permute_copy` | Copy a tensor with permuted dimensions |
| `triton_scaled_mm` | Block-scaled quantized matrix multiplication |

## Normalization

| Operator | Description |
|----------|-------------|
| `add_rms_norm` | Addition with RMSNorm |
| `fused_add_rms_norm` | Fused addition with RMSNorm |
| `gemma_rms_norm` | Gemma variant of RMSNorm, with the learnable weight offset by one |
| `instance_norm` | Instance normalization |
| `skip_layer_norm` | Skip connection with LayerNorm |
| `weight_norm` | Weight normalization |
| `weight_norm_interface` | Weight normalization interface |
| `weight_norm_interface_backward` | Weight normalization interface backward pass |

## Reduction and Utility

| Operator | Description |
|----------|-------------|
| `apply_repetition_penalties` | Apply repetition penalties during generation |
| `beam_search_score` | Add cumulative log probabilities and new token scores for beam search |
| `beam_search_score_` | In-place variant of `beam_search_score` |
| `bincount` | Count frequency of each value |
| `cross_entropy_loss` | Cross-entropy loss computation |
| `pack_seq_triton` | Pack sequences |
| `SUPPORTED_FP8_DTYPE` | FP8 dtype used by the quantization operators |
| `unpack_seq_triton` | Unpack sequences |

## Quantization

| Operator | Description |
|----------|-------------|
| `act_quant_triton` | Block-wise activation quantization |
| `fused_indexer_q_rope_quant` | Fused indexer Q with RoPE and quantization |
| `fused_inv_rope_fp8_quant` | Fused inverse RoPE with FP8 quantization |
| `per_token_group_quant_fp8` | Per-token group FP8 quantization |
| `scaled_int8_quant` | Scaled INT8 quantization with single-read dynamic quantization |

## DSA - Deep Sparse Attention

| Operator | Description |
|----------|-------------|
| `bucket_sort_topk` | Bucket sort top-K selection |
| `cp_gather_indexer_k_quant_cache` | Gather indexer K with quantized cache |
| `indexer_k_quant_and_cache` | Indexer K with quantization and cache |

## FLA - Flash Linear Attention

| Operator | Description |
|----------|-------------|
| `chunk_gated_delta_rule` | Gated delta rule computation |
| `chunk_gated_delta_rule_fwd` | Gated delta rule forward pass |
| `fused_recurrent_gated_delta_rule_fwd` | Fused recurrent gated delta rule forward pass |

## MHC - Manifold-Constrained Hyper-Connections

| Operator | Description |
|----------|-------------|
| `MixLayout` | Layout of the combined residual mix tensor accepted by `mhc_post` |
| `hc_head_fused_kernel` | Head fusion kernel |
| `hc_head_fused_kernel_ref` | Head fusion kernel (reference) |
| `mhc_bwd` | MHC backward pass |
| `mhc_bwd_ref` | MHC backward pass (reference) |
| `mhc_post` | MHC post-processing |
| `mhc_pre` | MHC pre-processing |
| `sinkhorn_forward` | Sinkhorn forward computation |

## Qwen4

| Operator | Description |
|----------|-------------|
| `ple_state_gather` | Gather rows from the PLE state cache, mapping invalid indices to zero rows |
| `ple_state_scatter_` | Write rows through an explicit NULL/padding/duplicate write mask |
| `qwen4_compress_norm_mrope_store_groups` | Fused QSA group pooling, Gemma RMSNorm, interleaved MRoPE, and cache store |
| `qwen4_grouped_gemma_rmsnorm` | Grouped Gemma RMSNorm for Qwen4 hyper-connections |
| `qwen4_hc_gate_reduce` | Hyper-connection gate reduction |
| `qwen4_hc_inject_combine` | Hyper-connection injection and combination with the residual stream |
| `qwen4_qsa_mqa_paged_dot` | QSA indexer scores computed from a paged compressed-key cache |
| `qwen4_store_qsa_kv_rows` | Store paired QSA K/V rows in one stride-aware launch |
| `qwen4_vendor_compress_qsa_groups` | Model-vendor QSA group-pooling and position-load kernel |
| `qwen4_vendor_qsa_mqa_paged` | Model-vendor scalar-reduction QSA paged-MQA kernel |
| `qwen4_vendor_store_qsa_rows` | Model-vendor single-cache-row QSA store kernel |

## RWKV

| Operator | Description |
|----------|-------------|
| `rwkv_ka_fusion` | RWKV key-attention fusion kernel |
| `rwkv_mm_sparsity` | RWKV matrix multiplication sparsity kernel |
