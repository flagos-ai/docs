# 特性

## 统一平台抽象层

`verl/plugin/platform/` 下的策略模式设计将业务逻辑与硬件特定调用解耦，支持 CUDA、昇腾 NPU、MetaX (MACA)、摩尔线程 (MUSA)、CPU 及未来的加速器。

- **PlatformBase 抽象基类** — 16 个设备无关方法，涵盖设备分配、内存管理、流操作和分布式初始化
- **PlatformManager** — 单例模式，通过 `VERL_PLATFORM` 环境变量覆盖运行时平台选择
- **硬件无关的业务逻辑** — 所有 `torch.cuda.*` 调用替换为平台 API

## FlagOS 训练引擎集成

通过 FlagOS 生态组件实现可插拔后端，支持多芯片 GRPO 训练：

- **vllm-plugin-FL** — 基于 vLLM 的推理/采样引擎，支持多厂商调度
- **TransformerEngine-FL** — FSDP 训练引擎，支持 FP8 和多后端算子调度
- **Megatron-LM-FL** — 基于 Megatron 的训练引擎，支持大规模分布式训练的平台抽象

## 多厂商硬件支持

verl-FL 支持 NVIDIA、华为昇腾、MetaX、摩尔线程和 CPU 平台。详见[支持的硬件](../getting_started/requirements.md#supported-hardwares)。

## 异构分布式训练

通过 FlagCX 实现跨厂商集合通信，支持 NVIDIA GPU 和摩尔线程 MUSA 节点间的异构训练。一个节点运行 actor/critic（NVIDIA，FSDP），另一个节点运行 rollout（摩尔线程 MUSA，vLLM），通过 Ray 运行时上下文管理权重同步和设备隔离。
