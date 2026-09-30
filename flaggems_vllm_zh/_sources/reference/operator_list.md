# 算子列表

本页列出了 FlagGems-vLLM 导出的算子，来源于 `src/flaggems_vllm/ops/__init__.py`。

FlagGems-vLLM 使用 Triton 编程语言提供了常用 vLLM 算子的优化实现。目前共导出以下 109 个算子：

## 激活与门控

| 算子 | 描述 |
|----------|-------------|
| `dgeglu` | GEGLU 激活的反向传播 |
| `dreglu` | ReGLU 激活的反向传播 |
| `dswiglu` | SwiGLU 激活的反向传播 |
| `geglu` | GEGLU（带 GELU 的门控线性单元）激活 |
| `gelu_and_mul` | GELU 激活与逐元素乘法组合 |
| `reglu` | ReGLU（带 ReLU 的门控线性单元）激活 |
| `silu_and_mul` | SiLU（Swish）激活与逐元素乘法组合 |
| `silu_and_mul_out` | SiLU 激活与乘法（非原地变体） |
| `silu_and_mul_with_clamp` | SiLU 激活与乘法及截断 |
| `silu_and_mul_with_clamp_out` | SiLU 激活与乘法及截断（非原地变体） |
| `swiglu` | SwiGLU（带 SiLU 的门控线性单元）激活 |

## 注意力

| 算子 | 描述 |
|----------|-------------|
| `apply_rotary_pos_emb` | 应用旋转位置编码 |
| `chunk_kda` | 仅推理的 chunk Kimi Delta Attention（KDA，结合 Flash 线性注意力） |
| `concat_and_cache_mla` | MLA（多潜在注意力）的拼接与缓存 |
| `flash_attention_forward` | FlashAttention 前向传播 |
| `flash_attn_varlen_func` | 变长序列的 FlashAttention |
| `flash_attn_varlen_func_w8a8_fp8` | 分块 FP8 的变长 FlashAttention-2，带逐块反量化缩放 |
| `flash_attn_varlen_opt_func` | 变长序列的优化 FlashAttention |
| `flash_mla` | Flash 多潜在注意力 |
| `flash_mla_sparse_fwd` | 稀疏 Flash MLA 前向传播 |
| `flash_mla_with_kvcache` | 带 KV 缓存支持的 Flash MLA |
| `fp8_einsum` | 块缩放 FP8 的 bhr,hdr->bhd 收缩运算 |
| `fp8_fp4_mqa_logits` | FP8 或 MXFP4 量化的 Q 与 FP8 的 K 计算加权 MQA logits |
| `fp8_fp4_paged_mqa_logits` | 由 FP8 查询对 FP8/FP4 分页 KV 缓存计算分页 MQA logits |
| `mrope` | 多分辨率旋转位置编码（M-RoPE） |
| `parallel_nsa` | 原生稀疏注意力（NSA）并行实现 |
| `parallel_nsa_compression` | NSA 风格的并行压缩前向，支持反向 |
| `persistent_topk` | 兼容 vLLM 的 persistent top-K 解码，按序列长度分级调度 |
| `reshape_and_cache` | KV 缓存的重塑与缓存 |
| `reshape_and_cache_flash` | FlashAttention 的重塑与缓存 |
| `sparse_attn_triton` | 通过 Triton 实现的稀疏注意力计算 |
| `triton_unified_attention` | 支持 GQA、因果掩码与可选 softcap 的分页注意力 |

## DeepSeek V4 注意力

| 算子 | 描述 |
|----------|-------------|
| `combine_topk_swa_indices` | 组合 DeepSeek V4 的 top-K 和滑动窗口注意力索引 |
| `compute_global_topk_indices_and_lens` | 计算 DeepSeek V4 的全局 top-K 索引和长度 |
| `dequantize_and_gather_k_cache` | DeepSeek V4 的 K 缓存反量化与收集 |
| `fused_q_kv_rmsnorm` | DeepSeek V4 的融合 Q/KV RMSNorm |
| `fused_deepseek_v4_qnorm_rope_kv_rope_quant_insert` | DeepSeek V4 的融合 Q-norm、RoPE、KV-RoPE、量化与插入 |
| `stage_deepseek_v4_mega_moe_inputs` | 准备 DeepSeek V4 Mega-MoE 输入：隐藏态 FP8 量化并拷贝 top-K 索引与权重 |

## 混合专家（MoE）

| 算子 | 描述 |
|----------|-------------|
| `dispatch_fused_moe_kernel` | 分发融合 MoE 内核 |
| `fused_experts_impl` | 融合 MoE 专家实现 |
| `fused_marlin_moe` | GPTQ INT4/MXFP4 权重与 16 位激活的融合 MoE |
| `grouped_topk` | MoE 路由的分组 top-K 选择 |
| `inplace_fused_experts` | 原地融合 MoE 专家 |
| `invoke_fused_moe_triton_kernel` | 调用融合 MoE Triton 内核 |
| `moe_align_block_size` | MoE 块大小对齐 |
| `moe_align_block_size_no_tle` | 不使用 TLE 协作内核的 MoE 块大小对齐 |
| `moe_align_block_size_triton` | MoE 块大小对齐（Triton 变体） |
| `moe_sum` | MoE 专家输出求和 |
| `outplace_fused_experts` | 非原地融合 MoE 专家 |
| `router_gemm` | MoE 路由门控的 BF16 x BF16 -> FP32 GEMM |
| `top_k_per_row_decode` | 解码阶段的逐行 top-K |
| `top_k_per_row_prefill` | 预填充阶段的逐行 top-K |
| `topk_softmax` | MoE 门控的 top-K softmax |
| `topk_softplus_sqrt` | MoE 门控的 top-K softplus 与 sqrt |

## 线性与矩阵

| 算子 | 描述 |
|----------|-------------|
| `cutlass_scaled_mm` | 通过 CUTLASS 实现的缩放矩阵乘法 |
| `mul` | 逐元素乘法 |
| `mul_` | 逐元素乘法（原地） |
| `mv` | 矩阵-向量乘法 |
| `outer` | 两个向量的外积 |
| `permute_copy` | 按置换维度复制张量 |
| `triton_scaled_mm` | 分块缩放的量化矩阵乘法 |

## 归一化

| 算子 | 描述 |
|----------|-------------|
| `add_rms_norm` | 加法与 RMSNorm |
| `fused_add_rms_norm` | 融合加法与 RMSNorm |
| `gemma_rms_norm` | Gemma 版 RMSNorm，可学习权重偏移 1 |
| `instance_norm` | 实例归一化 |
| `skip_layer_norm` | 跳跃连接与 LayerNorm |
| `weight_norm` | 权重归一化 |
| `weight_norm_interface` | 权重归一化接口 |
| `weight_norm_interface_backward` | 权重归一化接口反向传播 |

## 归约与工具

| 算子 | 描述 |
|----------|-------------|
| `apply_repetition_penalties` | 在生成过程中应用重复惩罚 |
| `beam_search_score` | 波束搜索：累加对数概率与新 token 分数 |
| `beam_search_score_` | `beam_search_score` 的原地变体 |
| `bincount` | 统计每个值的频率 |
| `cross_entropy_loss` | 交叉熵损失计算 |
| `pack_seq_triton` | 打包序列 |
| `SUPPORTED_FP8_DTYPE` | 量化算子使用的 FP8 数据类型 |
| `unpack_seq_triton` | 解包序列 |

## 量化

| 算子 | 描述 |
|----------|-------------|
| `act_quant_triton` | 分块激活量化 |
| `fused_indexer_q_rope_quant` | 融合索引器 Q 与 RoPE 和量化 |
| `fused_inv_rope_fp8_quant` | 融合逆 RoPE 与 FP8 量化 |
| `per_token_group_quant_fp8` | 逐 token 分组 FP8 量化 |
| `scaled_int8_quant` | 带单次读取动态量化的缩放 INT8 量化 |

## DSA — 深度稀疏注意力

| 算子 | 描述 |
|----------|-------------|
| `bucket_sort_topk` | 桶排序 top-K 选择 |
| `cp_gather_indexer_k_quant_cache` | 收集索引器 K 与量化缓存 |
| `indexer_k_quant_and_cache` | 索引器 K 量化与缓存 |

## FLA — Flash 线性注意力

| 算子 | 描述 |
|----------|-------------|
| `chunk_gated_delta_rule` | 门控 delta 规则计算 |
| `chunk_gated_delta_rule_fwd` | 门控 delta 规则前向传播 |
| `fused_recurrent_gated_delta_rule_fwd` | 融合循环门控 delta 规则前向传播 |

## MHC — 流形约束超连接

| 算子 | 描述 |
|----------|-------------|
| `MixLayout` | `mhc_post` 接受的合并残差混合张量布局 |
| `hc_head_fused_kernel` | 头融合内核 |
| `hc_head_fused_kernel_ref` | 头融合内核（参考实现） |
| `mhc_bwd` | MHC 反向传播 |
| `mhc_bwd_ref` | MHC 反向传播（参考实现） |
| `mhc_post` | MHC 后处理 |
| `mhc_pre` | MHC 预处理 |
| `sinkhorn_forward` | Sinkhorn 前向计算 |

## Qwen4

| 算子 | 描述 |
|----------|-------------|
| `ple_state_gather` | 从 PLE 状态缓存收集行，无效索引映射为零行 |
| `ple_state_scatter_` | 通过显式 NULL/填充/重复写掩码写回行 |
| `qwen4_compress_norm_mrope_store_groups` | 融合 QSA 分组池化、Gemma RMSNorm、交错 MRoPE 与缓存写入 |
| `qwen4_grouped_gemma_rmsnorm` | Qwen4 超连接的分组 Gemma RMSNorm |
| `qwen4_hc_gate_reduce` | 超连接门控归约 |
| `qwen4_hc_inject_combine` | 超连接注入与残差流合并 |
| `qwen4_qsa_mqa_paged_dot` | 由分页压缩键缓存计算 QSA 索引器分数 |
| `qwen4_store_qsa_kv_rows` | 一次跨步感知启动写入成对 QSA K/V 行 |
| `qwen4_vendor_compress_qsa_groups` | 模型厂商的 QSA 分组池化与位置加载内核 |
| `qwen4_vendor_qsa_mqa_paged` | 模型厂商的标量归约 QSA 分页 MQA 内核 |
| `qwen4_vendor_store_qsa_rows` | 模型厂商的单缓存行 QSA 写入内核 |

## RWKV

| 算子 | 描述 |
|----------|-------------|
| `rwkv_ka_fusion` | RWKV 键-注意力融合内核 |
| `rwkv_mm_sparsity` | RWKV 矩阵乘法稀疏性内核 |
