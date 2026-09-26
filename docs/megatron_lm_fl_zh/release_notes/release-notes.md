# 发布说明

本节包含 Megatron-LM-FL 的发布信息。

## v0.3.0

Megatron-LM-FL v0.3.0 已同步上游 Megatron-LM v0.18.2，要求 Python >= 3.12。

- **新增特性**

  - 新增平台后端：燧原（Enflame）、昆仑芯（KunlunXin）与 MUSA。
  - 支持 `GLM5` / `GLM5.1` / `GLM5.2` 系列的 DSA 结构。
  - 支持分块 cross-entropy 以降低显存占用。
  - MegatronAdaptor 模块的昇腾原生集成。

- **改进特性**

  - Override 机制升级。

## v0.2.0

- **新增特性**

  - DeepSeek V4 模型支持 — 完整的 DeepSeek V4 架构训练支持，包括 CSA/HCA 注意力变体、用于 MoE token 路由的 Hash Router、多头超连接（mHC）、Engram 辅助记忆模块和多 Token 预测（MTP）增强。新增融合内核：`fused_mhc_kernels`、扩展的 `fused_mla_yarn_rope_apply`。

  - TXDA 平台后端 — 通过 `platform_txda.py` 新增清微芯片支持，包括针对 TXDA 硬件的优化器和流水线调度适配。

  - NPU 平台后端 — 通过 `platform_npu.py` 新增 Ascend NPU 支持，遵循现有的 CUDA/MUSA 平台模式。

  - 多供应商插件调度 — 扩展了 `@override` 装饰器系统，通过 `MG_FL_PREFER` 环境变量进行运行时供应商选择。四级回退：首选供应商 → 默认供应商 → 唯一供应商 → 无。

  - Core 0.17.0 升级 — 同步上游 Megatron-LM Core 0.17.0，保留 FlagScale 特定补丁，包括 Engram DDP 缓冲区分离、异构流水线支持、`qk_layernorm_hidden_dim` 支持和 `cur_platform` 抽象。

## v0.1.0

Megatron-LM-FL 初始版本。

- **新增特性**

  - 插件系统 — `@overridable` / `@override` 装饰器机制，用于平台特定的方法替换，无需修改上游代码。
  - 多平台支持 — 通过 `PlatformBase` 进行硬件抽象，支持 NVIDIA（CUDA）、沐曦（MetaX）、摩尔线程（MUSA）、清微（TXDA）和昇腾（Ascend NPU）的实现。
  - 完整上游兼容性 — 保留所有上游 Megatron-LM 功能，包括高级并行策略（TP、PP、DP、EP、CP）、混合精度（FP16、BF16、FP8）和 GPU 优化内核。
