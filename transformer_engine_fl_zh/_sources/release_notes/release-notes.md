# 发布说明

本节包含 TransformerEngine-FL 的发布信息。

## v0.3.0

TransformerEngine-FL v0.3.0 已同步上游 NVIDIA TransformerEngine v2.17。

- **新增特性**

  - FlagOS Triton 融合 RoPE kernel。
  - FlagOS 层归一化算子。
  - `generic_gemm` 支持 bias。
  - 新增厂商后端：清微 TXDA、昇腾与昆仑芯。

## v0.2.0

- **新增特性**

  - TE V2.14 上游同步 — 集成 NVIDIA TransformerEngine 上游 v2.14，纳入 MXFP8/NVFP4 量化、Blackwell（sm120）架构支持、FSDP2 与 DTensor 感知优化器状态、融合 RMSNorm dLN 与 add-through，以及 MoE 分组 MLP 算子。FlagOS 插件系统完全保留，同步了 OP API 签名和多后端兼容补丁。
  - 昆仑芯供应商后端 — 新增昆仑芯芯片供应商算子支持，包含 flash attention 和算子注册。
  - 燧原供应商后端 — 新增燧原（Enflame）芯片供应商算子支持，包含 flash attention 和算子注册。
  - FlagOS 分组 GEMM 算子 — 基于 FlagGems Triton 内核为 FlagOS 后端实现了 `te_general_grouped_gemm`，支持前向和后向计算。

## v0.1.0

TransformerEngine-FL 初始版本。

- **新增特性**

  - 多后端插件架构 — 基于插件的算子调度系统（`OpRegistry`、`OpManager`、`SelectionPolicy`），包含三层后端：FlagOS（默认/Triton）、Vendor（硬件特定）和 Reference（纯 PyTorch）。
  - 供应商后端 — 新增五个硬件供应商后端：海光（DCU）、沐曦（GPU 含 flash attention）、昆仑芯（含 flash attention）、天数智芯（Corex GPU）和 MUSA（摩尔线程 S 系列 GPU）。
  - FlagOS 后端 — 基于 FlagGems 的统一算子调度，集成 FlagCX 通信库。
  - 注意力系统 — 多供应商注意力后端框架，集成 flash attention。
