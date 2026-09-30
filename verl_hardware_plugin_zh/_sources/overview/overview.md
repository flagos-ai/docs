# verl-hardware-plugin 概述

verl-hardware-plugin 为 [verl](https://github.com/verl-project/verl) RL 后训练框架提供多芯片硬件平台与训练引擎的**参考实现**。它为非 CUDA 加速器提供平台抽象与训练引擎扩展，并作为硬件厂商通过统一插件接口将 verl 适配到自有设备的模板与示例。

本仓库由字节跳动 verl 团队与 [FlagOS](https://github.com/flagos-ai) 社区联合开发。

```{note}
本仓库中的平台与引擎均为参考实现。完整的生产级支持与维护需要与相应硬件厂商协作。
```

## 与 verl、verl-FL 的关系

- **verl** —— 上游 RL 后训练框架（HybridFlow）。平台/引擎注册机制在 [verl#6086](https://github.com/verl-project/verl/pull/6086) 中实现。
- **verl-hardware-plugin** —— 一个 out-of-tree 插件，verl 通过 `verl.plugins` entry-points 组自动发现。`pip install` 后无需在 verl 中做任何手动配置。
- **verl-FL** —— FlagOS 的 verl 分支，使用自带的树内平台抽象层。verl-hardware-plugin 面向的是上游 verl 的插件机制。

## 架构

```
verl（主框架）
    |
    +-- entry_points: verl.plugins -> verl_hardware_plugin
            |
            +-- platforms/  -> @PlatformRegistry.register(platform="vendor_name")
            |     +-- PlatformFlagOS        (device=cuda, vendor=flagos)
            |     +-- PlatformMetaX         (device=cuda, vendor=metax)
            |     +-- PlatformCUDAIluvatar  (device=cuda, vendor=iluvatar)
            |     +-- PlatformMLU           (device=mlu,  vendor=cambricon)
            |     +-- PlatformXPU           (device=xpu,  vendor=intel)
            |     +-- PlatformENFLAME       (device=enflame)
            |
            +-- engines/    -> @EngineRegistry.register(device=..., vendor=...)
            |     +-- fsdp_flagos.py / megatron_flagos.py
            |     +-- fsdp_metax.py  / megatron_metax.py
            |     +-- fsdp_mlu.py    / megatron_mlu.py
            |     +-- fsdp_iluvatar.py / megatron_iluvatar.py
            |     +-- fsdp_enflame.py / megatron_enflame.py
            |     +-- fsdp_xpu.py    / megatron_xpu.py
            |
            +-- utils/      -> FLEnvManager（按阶段配置 FlagGems / FlagCX）
```

插件通过两个注册表与 verl 集成：

1. **PlatformRegistry** —— 注册硬件平台抽象（设备管理、通信、内存）。
2. **EngineRegistry** —— 注册训练引擎（FSDP/Megatron 的硬件特定变体）。

引擎查找采用 `(device, vendor)` 二级键：

1. 精确匹配 `(device, vendor)` —— 厂商专用引擎；
2. 回退到仅设备键 —— 该设备类型的基础引擎；
3. 对于 CUDA 兼容设备，再回退到基础 CUDA 引擎。

平台抽象、按阶段环境管理器与专用 FlagOS 引擎的细节见[特性](features.md)。

## 支持的硬件

| 平台 | 设备 | 通信 | 状态 |
|------|------|------|------|
| FlagOS / NVIDIA | NVIDIA GPU（已验证） | FlagCX / NCCL | 支持 |
| 沐曦 MetaX | MetaX GPU（CUDA 兼容） | MCCL | 支持 |
| 天数智芯 Iluvatar | BI-V150（CUDA 兼容） | IXCCL | 支持 |
| 寒武纪 Cambricon MLU | MLU | CNCL | 参考实现（跟踪于 [flagos-ai/community#73](https://github.com/flagos-ai/community/issues/73)） |
| 燧原 Enflame GCU | GCU | ECCL / FlagCX | 示例（需厂商支持） |
| Intel XPU | Data Center GPU Max / Arc | xccl (oneCCL) | 示例（需厂商支持） |
| 华为昇腾 | Ascend 910B | HCCL | 内建（verl 核心） |
