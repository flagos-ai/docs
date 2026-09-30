# Platform Guide

This page summarizes the hardware platforms verl-hardware-plugin ships implementations for. For complete, up-to-date installation and quick-start steps, use the platform guide in the repository (linked for each platform).

## Platform Summary

| Platform | Device type | Vendor | Communication | Visibility env var | Detection | Ray resource | IPC | Repository guide |
|----------|-------------|--------|---------------|---------------------|-----------|--------------|-----|------------------|
| NVIDIA (FlagOS) | `cuda` | `flagos` | NCCL / FlagCX | `CUDA_VISIBLE_DEVICES` | `nvidia-smi` | `GPU` | Yes | [user_guide_flagos/nvidia](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_flagos/nvidia) |
| MetaX | `cuda` | `metax` | NCCL API / MCCL | `CUDA_VISIBLE_DEVICES` | `mx-smi` | `GPU` | Yes | [user_guide_metax](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_metax) |
| Iluvatar | `cuda` | `iluvatar` | NCCL API / IXCCL | `CUDA_VISIBLE_DEVICES` | `ixsmi` | `GPU` | Yes | [user_guide_iluvatar](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_iluvatar) |
| Cambricon MLU | `mlu` | `cambricon` | CNCL | `MLU_VISIBLE_DEVICES` | `torch.mlu` | `MLU` | No | [user_guide_mlu](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_mlu) |
| Enflame GCU | `enflame` | `enflame` | ECCL / FlagCX | - | - | - | - | [user_guide_enflame](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_enflame) |
| Intel XPU | `xpu` | `intel` | xccl (oneCCL) | `ZE_AFFINITY_MASK` | - | - | No | [user_guide_xpu](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_xpu) |
| Huawei Ascend | `npu` | (built-in) | HCCL | - | - | - | - | [verl ascend_tutorial](https://github.com/verl-project/verl/tree/main/docs/ascend_tutorial) |

For CUDA-compatible devices (MetaX, Iluvatar, NVIDIA), `torch.cuda.is_available()` returns True on all of them. The platform layer uses `vendor_name` and SMI-based detection (`mx-smi` for MetaX, `nvidia-smi` for NVIDIA) at first auto-detection to select the correct engine.

## Platform-Specific Notes

### NVIDIA (FlagOS engine)

The FlagOS engine registers as an engine vendor (`flagos`) on top of the `cuda` device platform, rather than as a standalone platform.

```bash
export VERL_ENGINE_DEVICE=cuda
export VERL_ENGINE_VENDOR=flagos
export TRAINING_FL_FLAGGEMS_ENABLE=1
export RAY_ACCEL_ENV_VAR_OVERRIDE_ON_ZERO=0
export FLAGCX_PATH=/path/to/FlagCX   # when using FlagCX
```

### MetaX

```bash
export VERL_PLATFORM=metax
export MACA_MPS_MODE=1
export MCCL_MAX_NCHANNELS=16
```

Requires `/dev/dri` and `/dev/mxcd` device mounts and `mx-smi` inside the container. Uses MetaX Docker Hub images (for example `verl:0.7.1-maca.ai3.5.3.3-torch2.8-py312-ubuntu22.04-amd64`).

### Iluvatar (BI-V150)

Uses the CoreX base image `iluvatarcorex-4.4.0-ubuntu24-py312-base`. Requires verl > 0.8.0 with the plugin registry from [verl#6086](https://github.com/verl-project/verl/pull/6086).

### Cambricon MLU

Use the Cambricon release Docker image in the `pytorch_infer` environment, and install `numpy<2` and `TransferQueue`. Start Ray and run verl examples with the recommended `runtime_env.yaml`:

```yaml
working_dir: ./
excludes: ["/.git/"]
env_vars:
  TORCH_NCCL_AVOID_RECORD_STREAMS: "1"
  RAY_ACCEL_ENV_VAR_OVERRIDE_ON_ZERO: "0"
```

MLU uses a custom Ray resource so that device assignment stays separate from CUDA GPU scheduling; Ray workers must advertise it:

```bash
ray start --resources='{"MLU": 8}'
```

### Intel XPU

```bash
export VERL_PLATFORM=intel
source /opt/intel/oneapi/setvars.sh
```

### Enflame GCU

Provided as a reference example; full production support requires collaboration with the vendor.

## Adding a New Platform

Vendors can add a new hardware platform by:

1. Creating a platform class under `verl_hardware_plugin/platforms/` decorated with `@PlatformRegistry.register(platform="vendor_name")`.
2. Creating FSDP and/or Megatron engines under `verl_hardware_plugin/engines/` decorated with `@EngineRegistry.register(device=..., vendor=...)`.
3. Adding the device/engine checks to the plugin's `__init__.py` registration.

See the [Development Guide](https://github.com/verl-project/verl-hardware-plugin/blob/main/docs/development.md) in the repository for a fully annotated platform template.
