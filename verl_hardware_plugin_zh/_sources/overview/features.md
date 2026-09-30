# 特性

## 硬件无关的平台抽象层

通过统一的 `PlatformBase` 接口，将设备管理、集合通信、内存管理、profiler、rollout 环境变量等硬件相关逻辑抽象为标准方法。厂商只需实现一个平台类并用 `@PlatformRegistry.register` 注册，即可接入 verl。

对于沐曦、天数智芯等 CUDA 兼容硬件，`torch.cuda.is_available()` 在多种芯片上均返回 True。平台层引入 `vendor_name` 标识与基于 SMI 命令的硬件探测（如沐曦的 `mx-smi`、天数智芯的 `ixsmi`），在首次自动检测时区分实际硬件，避免误匹配到 NVIDIA 引擎。

## 按阶段配置的环境管理器（FLEnvManager）

RL 后训练在训练阶段与推理（rollout）阶段对算子加速和通信后端的需求不同。环境管理器按阶段（training / rollout）分别管理 FlagGems 与 FlagCX 配置：

- **FlagGems 算子加速** —— 支持按阶段独立配置算子**白名单 / 黑名单**，精细控制哪些算子走 FlagGems 加速路径，并支持算子命中记录，便于调优与问题定位。
- **FlagCX 统一通信** —— 通过 `USE_FLAGCX` 开关启用 FlagCX 异构通信库，在多芯片环境下提供统一集合通信；未启用时回退到设备原生后端（如 NCCL）。

## 针对 FSDP 和 Megatron 的专用 FlagOS 引擎

在 verl 原生 FSDP 与 Megatron 引擎基础上派生 FlagOS 专用引擎，覆盖 RL 训练的关键角色：

- `FSDPFlagOSEngineWithLMHead` / `FSDPFlagOSEngineWithValueHead` —— 支持 fsdp / fsdp2，覆盖策略模型与价值模型。
- `MegatronFlagOSEngineWithLMHead` —— 支持 Megatron 大规模并行训练。

引擎在 `initialize` 阶段依据环境配置自动注入 FlagGems 算子加速，对上层 RL 算法完全透明。

## 零配置插件发现

插件通过 Python `entry_points` 机制被 verl 发现。`pip install` 后，verl 会导入注册在 `verl.plugins` 组下的包，从而触发所有平台与引擎的注册，无需改动 verl 主框架。
