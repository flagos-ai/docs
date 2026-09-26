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

分步操作请参见[多平台训练与测试](../user_guide/multi-platform-training.md)。

## 操作系统

Linux（官方），WSL2（有限支持）

## 软件

- Python >= 3.10（推荐 3.12）
- PyTorch >= 2.3
- CUDA >= 12.1（NVIDIA GPU），或 MUSA SDK（Moore Threads / MetaX），或 CANN 8.0+（NPU）
- TransformerEngine（可选，用于 TE 加速层）

## 源码构建要求

- CMake 3.18+
- Git 2.17+
