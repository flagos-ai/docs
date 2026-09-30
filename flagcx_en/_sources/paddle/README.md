# Training Models with Paddle and FlagCX

FlagCX is now fully integrated into Paddle as an **optional high-performance communication backend**. This integration enables efficient distributed training on multiple hardware platforms, including support for **heterogeneous training** on Nvidia and Iluvatar GPUs.  

Use the guides below to quickly get started with training models using Paddle + FlagCX.

## Homogeneous training

Train on a single type of hardware platform:

| Hardware        | User Guide |
|:---------------:|:----------|
| Nvidia GPU      | [NVIDIA](nvidia.md) |
| KLX XPU   | [Kunlunxin](kunlun.md) |
| Iluvatar GPU    | [Iluvatar](iluvatar.md) |

## Heterogeneous training

Train across **different hardware platforms** simultaneously:

| Hardware Combination         | User Guide |
|:----------------------------:|:----------|
| Nvidia GPU + Iluvatar GPU    | [NVIDIA + Iluvatar](nvidia-iluvatar-hetero-train.md) |

```{toctree}
:maxdepth: 3

nvidia
iluvatar
kunlun
nvidia-iluvatar-hetero-train
```
