# 发布说明

本节包含 verl-FL 的发布信息。

## v0.2.0

- **新增特性**

  - 统一平台抽象层 — `verl/plugin/platform/` 下的策略模式设计，包含 `PlatformBase` 抽象基类（16 个设备无关方法）以及 CUDA、MetaX (MACA)、昇腾 NPU、摩尔线程 (MUSA) 和 CPU 的具体实现。通过 `VERL_PLATFORM` 环境变量进行运行时平台选择。

  - FlagOS 训练引擎集成 — 通过 vllm-plugin-FL（采样）、TransformerEngine-FL（FSDP 训练）和 Megatron-LM-FL（Megatron 训练）实现可插拔后端，支持多芯片 GRPO 训练。

  - MetaX 平台支持 — 在 MetaX C500/C550 硬件上通过 MACA 软件栈进行训练验证，提供完整的环境配置和性能调优。

  - 摩尔线程 MUSA 平台支持 — 通过 FlagCX 通信后端实现 CUDA+MUSA 异构分布式训练。NVIDIA 节点运行 actor/critic（FSDP），MUSA 节点运行 rollout（vLLM），通过 Ray 运行时上下文实现跨设备权重同步和设备隔离。

  - Megatron-LM-FL 版本兼容性修复 — 正确解析 Megatron-LM-FL 使用的 `xxx+megatronxxx` 版本格式（例如 `0.1.0+megatron0.15.rc7`）。

  - Docker 镜像 — 提供 NVIDIA（`verl-fl:v0.2.0-rc2-nvidia`）和 MetaX（`verl-fl:v0.2.0-rc2-metax`）平台的预构建 Docker 镜像。

## v0.1.0

verl-FL 的初始发布。

- **新增特性**

  - 统一平台抽象层 — 在 `verl/plugin/platform/` 下引入平台抽象框架，包含 `PlatformBase` 抽象基类，支持多芯片，将业务逻辑与硬件特定调用解耦。

  - FlagOS 后端集成 — 添加 vllm-plugin-FL 作为采样/推理后端，TransformerEngine-FL 作为 FSDP 训练后端，实现 FlagOS 生态集成以支持多芯片 GRPO 训练。
