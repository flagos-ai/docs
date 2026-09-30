# 算子注册表

完整的算子注册表（含各算子阶段、测试与 benchmark 入口）维护在 [FlagAttention conf/operators.yaml](https://github.com/flagos-ai/FlagAttention/blob/main/conf/operators.yaml)。

| 算子族 | 公开导入入口 | 主要布局/用途 | 梯度支持 | 阶段 |
| --- | --- | --- | --- | --- |
| FlashAttention | `flag_attn.flash_attention` | 稠密注意力；`q: [B,Hq,M,D]`、`k/v: [B,Hkv,N,D]`；支持 MQA/GQA、dropout 与辅助输出 | 前向 + 反向 | Stable |
| Piecewise Attention | `flag_attn.piecewise_attention` | 根据 token 距离在两套 Q/K 之间选择的稠密注意力 | 前向 + 反向 | Stable |
| Split-KV FlashAttention | `flag_attn.flash_attention_split_kv` | 长 KV 解码及 query 并行度较低的任务 | 前向 | Alpha |
| Paged Attention | `flag_attn.paged_attention` | 在 paged KV cache 上执行单 token query | 前向 | Alpha |
| MiniMax M3 稀疏注意力 | 六个 `flag_attn.minimax_m3_*` 函数 | 以 128 token page 为单位打分、Top-K、稀疏 prefill/decode | 推理 | Alpha |
| Chunk GLA | `flag_attn.chunk_gla` | 递归 gated linear attention；`[B,T,H,D]`，支持定长及 packed varlen | 前向 + 反向 | Alpha |
| Chunk Gated Delta Rule | `flag_attn.chunk_gated_delta_rule` | 分块 delta-rule 递归；支持 head-first/sequence-first | 前向 | Alpha |
| GDN2 | `flag_attn.chunk_gdn2` | 原生 Triton/TLE 及厂商路径的分块 GDN2 prefill | 前向/推理 | Alpha |
| Kimi Delta Attention | `flag_attn.chunk_kda` | 特化的分块 KDA 推理；约束随当前后端变化 | 推理 | Alpha |
| SageAttention | `flag_attn.sage_attention.forward`、`per_block_int8` | Q/K 分块 INT8 量化及 attention；支持 HND/NHD | 前向 | Alpha |
| Parallel NSA | `flag_attn.parallel_nsa.parallel_nsa`、`parallel_nsa_compression` | Native Sparse Attention 及压缩；支持定长和 packed varlen | 前向 + 反向 | Alpha |
