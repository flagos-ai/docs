# Requirements

## Supported hardwares

| Vendor | Description |
|--------|-------------|
| Hygon | DCU accelerator support with full op registration |
| METAX | GPU support with attention backend and flash attention |
| KunlunXin | Baidu Kunlun chip support with flash attention |
| Iluvatar | Iluvatar Corex GPU support with full op set |
| MUSA | Moore Threads S-series GPU support |
| NPU | Ascend NPU support, requires `transformer_engine_npu` |
| ENFLAME | ENFLAME chip vendor support with flash attention and operator registration |
| Tsingmicro | Tsingmicro TXDA support |

Training with TransformerEngine-FL has been validated end to end on MetaX, Hygon, Ascend, and T-Head PPU. See [Install](../getting_started/install.md) for the full procedure.

## Operating system

Linux (official), WSL2 (limited support)

## FlagOS components and versions

The complete FlagOS stack used with TransformerEngine-FL, with the validated tag on each platform:

| Component | Role | MetaX | Hygon | Ascend | T-Head PPU |
|-----------|------|-------|-------|--------|------------|
| TransformerEngine-FL | Transformer operator layer (this component) | `0.3.0` | `0.3.0` | `0.3.0` | `0.3.0` |
| Megatron-LM-FL | Training engine | `0.3.0` | `0.3.0` | `0.3.0` | `0.3.0` |
| FlagScale | Orchestration and configuration layer | `2.1.0` | `2.1.0` | `2.1.0` | `2.1.0` |
| FlagTree | FlagOS compiler (replaces Triton) | `0.7.0+triton3.6` | `0.7.0+triton3.6` | `0.7.0+triton3.5` | `0.7.0+triton3.6` |
| FlagGems | Triton-based operator library | `5.4.0` | `5.4.0` | `5.4.0` | `5.4.0` |

FlagTree and FlagGems are only required for the FlagOS operator tier (`te_fl_prefer: flagos`). The vendor operator tier needs neither.
