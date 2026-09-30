# 使用 Paddle 和 FlagCX 训练模型

FlagCX 现已作为**可选的高性能通信后端**完全集成到 Paddle 中。此集成支持在多种硬件平台上进行高效的分布式训练，包括在 NVIDIA 和 Iluvatar GPU 上支持**异构训练**。

使用以下指南快速开始使用 Paddle + FlagCX 训练模型。

## 同构训练

在单一类型硬件平台上训练：

| 硬件        | 用户指南 |
|:---------------:|:----------|
| NVIDIA GPU      | [NVIDIA](nvidia.md) |
| 昆仑芯 XPU   | [昆仑芯](kunlun.md) |
| Iluvatar GPU    | [Iluvatar](iluvatar.md) |

## 异构训练

跨**不同硬件平台**同时训练：

| 硬件组合         | 用户指南 |
|:----------------------------:|:----------|
| NVIDIA GPU + Iluvatar GPU    | [NVIDIA + Iluvatar](nvidia-iluvatar-hetero-train.md) |

```{toctree}
:maxdepth: 3

nvidia
iluvatar
kunlun
nvidia-iluvatar-hetero-train
```
