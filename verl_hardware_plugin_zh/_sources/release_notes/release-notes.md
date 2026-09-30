# 发布说明

本节包含 verl-hardware-plugin 的发布信息。

## v0.1.0

- **概述**

  verl-hardware-plugin 首次发布，为 [verl](https://github.com/verl-project/verl) 提供多芯片硬件平台与训练引擎插件。该包由字节跳动 verl 团队与 FlagOS 社区联合开发，verl 通过 `verl.plugins` entry-points 组自动发现。

- **新增功能**

  - 通过 `@PlatformRegistry.register` 注册的硬件平台实现：
    - `cuda` 上的 FlagOS 引擎平台（vendor `flagos`，NVIDIA 已验证）。
    - `cuda` 上的沐曦 MetaX 平台（vendor `metax`）。
    - `cuda` 上的天数智芯 Iluvatar 平台（vendor `iluvatar`，BI-V150）。
    - `mlu` 上的寒武纪 MLU 平台（vendor `cambricon`）。
    - 燧原 Enflame GCU 平台（vendor `enflame`）。
    - `xpu` 上的 Intel XPU 平台（vendor `intel`）。
  - 为每个支持的 device/vendor 对提供 FSDP 与 Megatron 引擎变体，通过 `@EngineRegistry.register` 注册。
  - 按阶段环境管理器（`FLEnvManager`），支持分阶段的 FlagGems 算子白名单/黑名单与 FlagCX 通信控制。
  - CUDA 兼容设备的基于 SMI 的硬件探测（`nvidia-smi`、`mx-smi`），用于自动检测时区分厂商。
  - 专用 FlagOS 引擎（`FSDPFlagOSEngineWithLMHead`/`WithValueHead`、`MegatronFlagOSEngineWithLMHead`），透明注入 FlagGems 加速。
  - 寒武纪 CNCL 与 CNI XL checkpoint 引擎。
  - 各平台用户指南与 GSM8K GRPO 验收基线脚本。
  - 已验证平台 —— Qwen3-0.6B 在 GSM8K 上的端到端 GRPO 训练已在沐曦 MetaX 与天数智芯 Iluvatar 完成；其余平台以参考实现形式提供。

- **要求**

  - Python >= 3.10
  - verl >= 0.7.0（插件注册机制来自 [verl#6086](https://github.com/verl-project/verl/pull/6086)；Iluvatar 使用 verl > 0.8.0）

