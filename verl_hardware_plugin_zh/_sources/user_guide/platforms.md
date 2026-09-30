# 平台指南

本页汇总 verl-hardware-plugin 已提供实现的硬件平台。完整、最新的安装与快速开始步骤请使用各平台对应的仓库指南（每平台均附链接）。

## 平台一览

| 平台 | 设备类型 | 厂商标识 | 通信 | 设备可见性变量 | 硬件探测 | Ray 资源 | IPC | 仓库指南 |
|------|----------|----------|------|----------------|----------|----------|-----|----------|
| NVIDIA（FlagOS） | `cuda` | `flagos` | NCCL / FlagCX | `CUDA_VISIBLE_DEVICES` | `nvidia-smi` | `GPU` | 是 | [user_guide_flagos/nvidia](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_flagos/nvidia) |
| 沐曦 MetaX | `cuda` | `metax` | NCCL API / MCCL | `CUDA_VISIBLE_DEVICES` | `mx-smi` | `GPU` | 是 | [user_guide_metax](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_metax) |
| 天数智芯 Iluvatar | `cuda` | `iluvatar` | NCCL API / IXCCL | `CUDA_VISIBLE_DEVICES` | `ixsmi` | `GPU` | 是 | [user_guide_iluvatar](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_iluvatar) |
| 寒武纪 MLU | `mlu` | `cambricon` | CNCL | `MLU_VISIBLE_DEVICES` | `torch.mlu` | `MLU` | 否 | [user_guide_mlu](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_mlu) |
| 燧原 Enflame GCU | `enflame` | `enflame` | ECCL / FlagCX | - | - | - | - | [user_guide_enflame](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_enflame) |
| Intel XPU | `xpu` | `intel` | xccl (oneCCL) | `ZE_AFFINITY_MASK` | - | - | 否 | [user_guide_xpu](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_xpu) |
| 华为昇腾 | `npu` | （内建） | HCCL | - | - | - | - | [verl ascend_tutorial](https://github.com/verl-project/verl/tree/main/docs/ascend_tutorial) |

对于 CUDA 兼容设备（沐曦、天数智芯、NVIDIA），`torch.cuda.is_available()` 在所有设备上均返回 True。平台层在首次自动检测时使用 `vendor_name` 与基于 SMI 的探测（沐曦用 `mx-smi`、NVIDIA 用 `nvidia-smi`）来选择正确引擎。

## 各平台注意事项

### NVIDIA（FlagOS 引擎）

FlagOS 引擎注册为 `cuda` 设备平台之上的引擎厂商（`flagos`），而非独立平台。

```bash
export VERL_ENGINE_DEVICE=cuda
export VERL_ENGINE_VENDOR=flagos
export TRAINING_FL_FLAGGEMS_ENABLE=1
export RAY_ACCEL_ENV_VAR_OVERRIDE_ON_ZERO=0
export FLAGCX_PATH=/path/to/FlagCX   # 使用 FlagCX 时
```

### 沐曦 MetaX

```bash
export VERL_PLATFORM=metax
export MACA_MPS_MODE=1
export MCCL_MAX_NCHANNELS=16
```

需要挂载 `/dev/dri` 与 `/dev/mxcd` 设备，容器内需要有 `mx-smi`。使用 MetaX Docker Hub 镜像（如 `verl:0.7.1-maca.ai3.5.3.3-torch2.8-py312-ubuntu22.04-amd64`）。

### 天数智芯 Iluvatar（BI-V150）

使用 CoreX 基础镜像 `iluvatarcorex-4.4.0-ubuntu24-py312-base`。需要 verl > 0.8.0 以及 [verl#6086](https://github.com/verl-project/verl/pull/6086) 提供的插件注册机制。

### 寒武纪 MLU

在 `pytorch_infer` 环境中使用寒武纪 release Docker 镜像，并安装 `numpy<2` 与 `TransferQueue`。启动 Ray 后使用推荐的 `runtime_env.yaml` 运行 verl 示例：

```yaml
working_dir: ./
excludes: ["/.git/"]
env_vars:
  TORCH_NCCL_AVOID_RECORD_STREAMS: "1"
  RAY_ACCEL_ENV_VAR_OVERRIDE_ON_ZERO: "0"
```

MLU 使用自定义 Ray 资源，以便设备分配与 CUDA GPU 调度相互独立，Ray worker 需显式声明：

```bash
ray start --resources='{"MLU": 8}'
```

### Intel XPU

```bash
export VERL_PLATFORM=intel
source /opt/intel/oneapi/setvars.sh
```

### 燧原 Enflame GCU

作为参考示例提供；完整生产级支持需要与厂商协作。

## 新增平台

厂商可通过以下步骤新增硬件平台：

1. 在 `verl_hardware_plugin/platforms/` 下创建平台类，用 `@PlatformRegistry.register(platform="vendor_name")` 装饰。
2. 在 `verl_hardware_plugin/engines/` 下创建 FSDP 和/或 Megatron 引擎，用 `@EngineRegistry.register(device=..., vendor=...)` 装饰。
3. 在插件的 `__init__.py` 注册逻辑中加入设备/引擎检查。

带完整注释的平台模板见仓库中的[开发指南](https://github.com/verl-project/verl-hardware-plugin/blob/main/docs/development.md)。
