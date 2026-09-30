# 要求

## 支持的硬件

| 平台 | 设备 | 描述 |
|------|------|------|
| **NVIDIA** | CUDA GPU | 完整功能支持（默认） |
| **MetaX** | MetaX GPU | MetaX 平台 |
| **Moore Threads** | MUSA GPU | Moore Threads MUSA 平台 |
| **TXDA** | Tsingmicro GPU | Tsingmicro TXDA 平台 |
| **NPU** | Ascend NPU | Ascend 910B / CANN 8.0+ |

训练与推理还已在以下平台上完成端到端验证：

| 平台 | 设备检查命令 | 可见设备环境变量 | FlagTree 后端 |
|------|--------------|------------------|---------------|
| 沐曦 MetaX | `mx-smi` | `MACA_VISIBLE_DEVICES` | `metax` |
| 海光 Hygon | `hy-smi` | `HIP_VISIBLE_DEVICES` | `hcu` |
| 昇腾 Ascend | `npu-smi info` | `ASCEND_RT_VISIBLE_DEVICES` | `ascend` |
| 平头哥 PPU | `ppu-smi` | `CUDA_VISIBLE_DEVICES` | `ppu` |

分步操作请参见[安装](../getting_started/install.md)。

## 操作系统

Linux（官方），WSL2（有限支持）

## FlagOS 组件及版本

与 Megatron-LM-FL 配套使用的完整 FlagOS 软件栈，以及各平台验证通过的版本：

| 组件 | 角色 | 沐曦 MetaX | 海光 Hygon | 昇腾 Ascend | 平头哥 PPU |
|------|------|-----------|-----------|------------|-----------|
| Megatron-LM-FL | 训练引擎（本组件） | `0.3.0` | `0.3.0` | `0.3.0` | `0.3.0` |
| TransformerEngine-FL | Transformer 算子层 | `0.3.0` | `0.3.0` | `0.3.0` | `0.3.0` |
| FlagScale | 编排与配置层 | `2.1.0` | `2.1.0` | `2.1.0` | `2.1.0` |
| FlagTree | FlagOS 编译器（替换 Triton） | `0.7.0+triton3.6` | `0.7.0+triton3.6` | `0.7.0+triton3.5` | `0.7.0+triton3.6` |
| FlagGems | 基于 Triton 的算子库 | `5.4.0` | `5.4.0` | `5.4.0` | `5.4.0` |

FlagTree 与 FlagGems 仅在 FlagOS 算子层（`te_fl_prefer: flagos`）下需要；厂商算子层不需要二者。
