# verl-FL 概述

verl-FL 是 [verl](https://github.com/volcengine/verl) 的一个分支，旨在支持多种 AI 加速器。它基于 [FlagOS](https://github.com/flagos-ai) 构建，FlagOS 是一个统一的开源 AI 系统软件栈，集成了训练引擎 [Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL) 和 [Transformer-Engine-FL](https://github.com/flagos-ai/TransformerEngine-FL)，以及推理引擎 [vllm-plugin-FL](https://github.com/flagos-ai/vllm-plugin-FL) 等关键组件。

上游 verl 与 CUDA 紧密耦合，而 verl-FL 引入了平台抽象层并集成了 FlagOS 生态组件，从而在不修改上游业务逻辑的情况下实现异构分布式训练。

## 架构

### 平台抽象层

verl-FL 在 `verl/plugin/platform/` 下引入了策略模式的平台抽象：

```
verl/plugin/platform/
├── __init__.py
├── platform_base.py        # PlatformBase 抽象基类（16 个设备无关方法）
├── platform_cuda.py        # CUDA + FlagCX 自动检测
├── platform_metax.py       # MetaX MACA
├── platform_npu.py         # 昇腾 NPU
├── platform_musa.py        # 摩尔线程 MUSA + FlagCX
├── platform_cpu.py         # CPU 回退
├── platform_manager.py     # 单例，VERL_PLATFORM 环境变量覆盖
└── README.md               # 添加新后端的指南
```

`PlatformBase` 抽象基类定义了 16 个设备无关方法，涵盖设备分配、内存管理、流操作和分布式初始化。业务逻辑中所有分散的 `torch.cuda.*` 调用均替换为平台 API。运行时平台选择通过 `VERL_PLATFORM` 环境变量控制。

### 引擎插件架构

```
verl/plugin/engine/
├── __init__.py             # 引擎注册表
├── fsdp_fl/
│   ├── __init__.py
│   └── transformer_impl.py # 基于 TE-FL 的 FSDP 引擎
└── megatron_fl/
    └── __init__.py         # 基于 Megatron-LM-FL 的引擎
```

### 异构训练架构

[FlagCX](https://github.com/flagos-ai/FlagCX) 作为统一的跨厂商通信后端，在异构场景中替代 NCCL。通过 Ray 运行时上下文实现 CUDA 和 MUSA 节点间的权重同步和设备隔离：

```
┌─────────────────────────┐              ┌─────────────────────────┐
│  NVIDIA 节点            │              │  MUSA 节点              │
│  (Actor / Critic)       │◄── FlagCX ──►│  (Rollout / vLLM)       │
│  FSDP + NCCL            │              │  torch_musa             │
└─────────────────────────┘              └─────────────────────────┘
```
