# Requirements

## Supported Hardware

| Vendor | Device | Device type | Communication | Status |
|--------|--------|-------------|---------------|--------|
| NVIDIA | CUDA GPUs | `cuda` | NCCL / FlagCX | Supported (FlagOS engine verified) |
| MetaX | C500/C550 series (CUDA-compatible) | `cuda` | MCCL | Supported |
| Iluvatar | BI-V150 (CUDA-compatible) | `cuda` | IXCCL | Supported |
| Cambricon | MLU | `mlu` | CNCL | Reference implementation (tracked in [flagos-ai/community#73](https://github.com/flagos-ai/community/issues/73)) |
| Enflame | GCU | `enflame` | ECCL / FlagCX | Example (requires vendor support) |
| Intel | Data Center GPU Max / Arc | `xpu` | xccl (oneCCL) | Example (requires vendor support) |
| Huawei | Ascend 910B | `npu` | HCCL | Built-in (verl core) |

## Operating System

Linux (official).

## Software

- Python >= 3.10
- [verl](https://github.com/verl-project/verl) >= 0.7.0
- PyTorch (matching the target device and vendor stack)
- For the FlagOS engine: FlagCX (optional, enabled via `USE_FLAGCX`), FlagGems (optional operator acceleration)

Per-platform software stacks (vendor driver, firmware, `torch` extension such as `torch_mlu`, and communication libraries such as CNCL/MCCL/IXCCL) are provided by the respective hardware vendors. See each platform's installation guide for details.
