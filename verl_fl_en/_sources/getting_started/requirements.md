# Requirements

## Supported Hardwares

| Vendor | Device | Backend | Status |
|--------|--------|---------|--------|
| NVIDIA | CUDA GPUs | torch + FlagCX | Full support |
| Huawei Ascend | NPU | torch_npu + CANN | Full support |
| MetaX | C500/C550 series | torch_maca + MACA | Validated |
| Moore Threads | MUSA S-series GPUs | torch_musa + FlagCX | Validated (heterogeneous) |
| CPU | x86/ARM | torch (CPU) | Basic support |

## Operating System

Linux (official)

## Software

- Python >= 3.10
- PyTorch >= 2.4
- For CUDA: CUDA >= 12.1
- For MetaX: torch_maca, MACA toolkit
- For MUSA: torch_musa, MUSA toolkit
- For NPU: torch_npu, CANN toolkit

## FlagOS Dependencies

- FlagCX (required) — Unified cross-vendor communication backend
- vllm-plugin-FL (optional) — vLLM-based rollout engine
- TransformerEngine-FL (optional) — TE-FL based FSDP training engine
- Megatron-LM-FL (optional) — Megatron-based training engine
- FlagGems (optional) — Triton-based operator library
