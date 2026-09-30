# 发布说明

本节包含 FlagGems-vLLM 的发布信息。

## v0.2.0

- **新增特性**：
  - DeepSeek V4 稀疏注意力算子：Mega-MoE 输入准备、融合索引器 Q 的 RoPE 与量化，以及稀疏注意力前向。
  - Qwen4 模型算子：包括 QSA 分页注意力内核、分组 Gemma RMSNorm 和超连接算子。
  - Flash 线性注意力算子：chunk Kimi Delta Attention（KDA）、chunk 门控 delta 规则，以及并行原生稀疏注意力（NSA）及其压缩变体。
  - MoE 算子：通用融合 MoE 接口、GPTQ INT4/MXFP4 融合 MoE、路由 GEMM 和 persistent top-K 解码。
  - 量化与线性代数算子：缩放 INT8 量化与缩放矩阵乘法，其中缩放 INT8 量化已扩展到 MetaX、海光、摩尔线程、天数智芯（Iluvatar）、燧原、昇腾和昆仑芯。
  - 注意力算子：带分块反量化缩放的分块 FP8 变长 FlashAttention-2、分页 FP8/FP4 多查询注意力 logits，以及支持 GQA 的统一分页注意力内核。
  - 导出的算子集合现已覆盖 109 个算子。更多信息请参见 [算子列表](../reference/operator_list.md)。
- **改进特性**：
  - 对 chunk 门控 delta 规则、chunk KDA、分组 top-K、融合加法 RMSNorm、MoE 求和、FP8 MQA logits 和缩放矩阵乘法进行了性能调优。

## v0.1.0

- **新增特性**：
  - FlagGems-vLLM 作为 FlagOS 的一部分首次发布。
  - 实现了首批用于 vLLM 推理加速的优化算子。更多信息请参见 [算子列表](../reference/operator_list.md)。
