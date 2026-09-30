# 环境要求

## 支持的硬件

| 厂商 | 设备 | 后端 | 状态 |
|--------|--------|---------|--------|
| NVIDIA | CUDA GPU | torch + FlagCX | 完全支持 |
| 华为昇腾 | NPU | torch_npu + CANN | 完全支持 |
| MetaX | C500/C550 系列 | torch_maca + MACA | 已验证 |
| 摩尔线程 | MUSA S 系列 GPU | torch_musa + FlagCX | 已验证（异构） |
| CPU | x86/ARM | torch (CPU) | 基础支持 |

## 操作系统

Linux（官方）

## 软件

- Python >= 3.10
- PyTorch >= 2.4
- CUDA 平台：CUDA >= 12.1
- MetaX 平台：torch_maca, MACA toolkit
- MUSA 平台：torch_musa, MUSA toolkit
- NPU 平台：torch_npu, CANN toolkit

## FlagOS 依赖

- FlagCX（必需）— 统一跨厂商通信后端
- vllm-plugin-FL（可选）— 基于 vLLM 的采样引擎
- TransformerEngine-FL（可选）— 基于 TE-FL 的 FSDP 训练引擎
- Megatron-LM-FL（可选）— 基于 Megatron 的训练引擎
- FlagGems（可选）— 基于 Triton 的算子库
