# 要求

## 支持的硬件

| 厂商 | 设备 | 设备类型 | 通信 | 状态 |
|------|------|----------|------|------|
| NVIDIA | CUDA GPU | `cuda` | NCCL / FlagCX | 支持（FlagOS 引擎已验证） |
| 沐曦 MetaX | C500/C550 系列（CUDA 兼容） | `cuda` | MCCL | 支持 |
| 天数智芯 Iluvatar | BI-V150（CUDA 兼容） | `cuda` | IXCCL | 支持 |
| 寒武纪 | MLU | `mlu` | CNCL | 参考实现（跟踪于 [flagos-ai/community#73](https://github.com/flagos-ai/community/issues/73)） |
| 燧原 Enflame | GCU | `enflame` | ECCL / FlagCX | 示例（需厂商支持） |
| Intel | Data Center GPU Max / Arc | `xpu` | xccl (oneCCL) | 示例（需厂商支持） |
| 华为 | Ascend 910B | `npu` | HCCL | 内建（verl 核心） |

## 操作系统

Linux（官方支持）。

## 软件

- Python >= 3.10
- [verl](https://github.com/verl-project/verl) >= 0.7.0
- PyTorch（与目标设备及厂商栈匹配）
- 对于 FlagOS 引擎：FlagCX（可选，通过 `USE_FLAGCX` 启用）、FlagGems（可选算子加速）

各平台的软件栈（厂商驱动、固件、`torch_mlu` 等 torch 扩展，以及 CNCL/MCCL/IXCCL 等通信库）由相应硬件厂商提供。细节见各平台安装指南。
