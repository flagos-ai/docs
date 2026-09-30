# Requirements

## Supported Hardwares

| Platform | Device | Description |
|----------|--------|-------------|
| **NVIDIA** | CUDA GPUs | Full feature support (default) |
| **MetaX** | MetaX GPUs | MetaX platform |
| **Moore Threads** | MUSA GPUs | Moore Threads MUSA platform |
| **TXDA** | Tsingmicro GPUs | Tsingmicro TXDA platform |
| **NPU** | Ascend NPU | Ascend 910B / CANN 8.0+ |

Training and inference have additionally been validated end to end on the following platforms:

| Platform | Device check | Visible-devices env | FlagTree backend |
|----------|--------------|---------------------|------------------|
| MetaX | `mx-smi` | `MACA_VISIBLE_DEVICES` | `metax` |
| Hygon | `hy-smi` | `HIP_VISIBLE_DEVICES` | `hcu` |
| Ascend | `npu-smi info` | `ASCEND_RT_VISIBLE_DEVICES` | `ascend` |
| T-Head PPU | `ppu-smi` | `CUDA_VISIBLE_DEVICES` | `ppu` |

For the step-by-step procedure, see [Install](../getting_started/install.md).

## Operating system

Linux (official), WSL2 (limited support)

## FlagOS components and versions

The complete FlagOS stack used with Megatron-LM-FL, with the validated version on each platform:

| Component | Role | MetaX | Hygon | Ascend | T-Head PPU |
|-----------|------|-------|-------|--------|------------|
| Megatron-LM-FL | Training engine (this component) | `0.3.0` | `0.3.0` | `0.3.0` | `0.3.0` |
| TransformerEngine-FL | Transformer operator layer | `0.3.0` | `0.3.0` | `0.3.0` | `0.3.0` |
| FlagScale | Orchestration and configuration layer | `2.1.0` | `2.1.0` | `2.1.0` | `2.1.0` |
| FlagTree | FlagOS compiler (replaces Triton) | `0.7.0+triton3.6` | `0.7.0+triton3.6` | `0.7.0+triton3.5` | `0.7.0+triton3.6` |
| FlagGems | Triton-based operator library | `5.4.0` | `5.4.0` | `5.4.0` | `5.4.0` |

FlagTree and FlagGems are only required for the FlagOS operator tier (`te_fl_prefer: flagos`). The vendor operator tier needs neither.
