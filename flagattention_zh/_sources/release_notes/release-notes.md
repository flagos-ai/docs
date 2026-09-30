# FlagAttention 发布说明

## v0.4.0

- **新增特性**

  - 递归与线性注意力算子：Chunk GLA、Chunk Gated Delta Rule、GDN2 与 Kimi Delta Attention。
  - MiniMax M3 稀疏注意力、SageAttention（Q/K 分块 INT8 量化）与 Parallel NSA（Native Sparse Attention 及压缩）。
  - 设备探测并按算子路由至厂商后端 —— NVIDIA、AMD、海光、天数智芯、MetaX、燧原、昇腾、寒武纪、摩尔线程、Intel 与 CPU —— 并支持 `FLAG_ATTN_BACKEND` 覆盖。
  - 算子清单（`conf/operators.yaml`）与多设备测试调度器，支持 FlagGems 兼容的 JSON 记录。

- **增强特性**

  - 稠密注意力的占用处理与辅助输出。

## v0.3.0

- **新增特性**

  - 面向长 KV 序列的 Split-KV flash 解码，以及面向 paged KV cache 的 paged attention。
  - FlashAttention 扩展支持 MQA/GQA、dropout 与辅助输出。
  - 包对外暴露设备元数据（`vendor_name`、`device`、`backend_info`）。

- **增强特性**

  - Piecewise Attention 重写，采用与 FlashAttention 相同的分块 online softmax 策略。

## v0.2.0

- **增强特性**

  - 仅在需要时应用 attention mask。
  - 使用独立 kernel 计算 query 梯度，避免对全局内存做原子读改写。

## v0.1.0

FlagAttention 首次发布。

- **新增特性**

  - 使用 Triton 实现的 FlashAttention 与 Piecewise Attention 算子。
