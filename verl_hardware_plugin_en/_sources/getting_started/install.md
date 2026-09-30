# Installation

verl-hardware-plugin is installed as a Python package and discovered by verl automatically through the `verl.plugins` entry-points group.

## Prerequisites

- Linux
- Python >= 3.10
- [verl](https://github.com/verl-project/verl) >= 0.7.0 (the plugin registry mechanism is provided by [verl#6086](https://github.com/verl-project/verl/pull/6086); for Iluvatar, verl > 0.8.0 is used)
- The vendor software stack for your target hardware (driver, `torch` extension such as `torch_mlu`, and the communication library such as CNCL/MCCL/IXCCL)
- (Optional, for the FlagOS engine) [FlagCX](https://github.com/flagos-ai/FlagCX) and [FlagGems](https://github.com/flagos-ai/FlagGems)

## Install from Source

```bash
# 1. Install verl (see https://verl.readthedocs.io/en/latest/start/install.html)
git clone https://github.com/verl-project/verl
cd verl
pip install --no-build-isolation -e .

# 2. Install verl-hardware-plugin
git clone https://github.com/verl-project/verl-hardware-plugin.git
cd verl-hardware-plugin
pip install --no-build-isolation -e .
```

After installation, no additional configuration in verl is required. When verl starts, it imports all packages registered under the `verl.plugins` group, which triggers registration of all platforms and engines.

To verify registration:

```bash
python3 -c "from verl.plugin.platform import get_platform; p = get_platform(); print(f'device: {p.device_name}'); print(f'vendor: {p.vendor_name}'); print(f'available: {p.is_available()}')"
```

## Platform Selection

The platform is auto-detected at startup. You can override it with the `VERL_PLATFORM` environment variable:

```bash
export VERL_PLATFORM=metax       # MetaX
export VERL_PLATFORM=intel       # Intel XPU
export VERL_PLATFORM=cambricon   # Cambricon MLU
```

For the FlagOS engine on NVIDIA, set the engine device and vendor:

```bash
export VERL_ENGINE_DEVICE=cuda
export VERL_ENGINE_VENDOR=flagos
```

## Platform-Specific Setup

Each hardware platform has its own base image, driver mounts, and environment requirements. Use the vendor-provided container images where available.

| Platform | Base image / stack | Platform env | Communication | Guide |
|----------|--------------------|--------------|---------------|-------|
| NVIDIA (FlagOS) | `harbor.baai.ac.cn/flagscale/flagscale-rl:dev-cu128-py3.12-*` | `VERL_ENGINE_VENDOR=flagos` | NCCL / FlagCX | [nvidia guide](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_flagos/nvidia) |
| MetaX | MetaX Docker Hub image, e.g. `verl:0.7.1-maca.ai3.5.3.3-torch2.8-py312-ubuntu22.04-amd64` | `VERL_PLATFORM=metax` | MCCL | [metax guide](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_metax) |
| Iluvatar | `harbor.baai.ac.cn/flagos21-base/iluvatarcorex-4.4.0-ubuntu24-py312-base:*` | auto / `iluvatar` | IXCCL | [iluvatar guide](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_iluvatar) |
| Cambricon MLU | Cambricon release image (contact Cambricon), `pytorch_infer` env | auto / `cambricon` | CNCL | [mlu guide](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_mlu) |
| Enflame GCU | Vendor image | auto | ECCL / FlagCX | [enflame guide](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_enflame) |
| Intel XPU | oneAPI environment (`source /opt/intel/oneapi/setvars.sh`) | `VERL_PLATFORM=intel` | xccl (oneCCL) | [xpu guide](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_xpu) |

For Cambricon MLU, install the additional packages `numpy<2` and `TransferQueue` inside the container. For MetaX and Iluvatar, `mx-smi` / the CoreX stack must be available inside the container for hardware auto-detection.

## Preparing Data and Models

The platform guides use Qwen3-0.6B and GSM8K as the reference end-to-end example:

```bash
# Model
modelscope download --model Qwen/Qwen3-0.6B --local_dir ./Qwen3-0.6B

# Dataset
mkdir gsm8k && cd gsm8k
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/rl/datasets/gsm8k/train.parquet"
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/rl/datasets/gsm8k/test.parquet"
```

Start a Ray cluster before launching training:

```bash
ray start --head --dashboard-host=0.0.0.0
```

See the [User Guide](../user_guide/user-guide.md) for running the GSM8K GRPO baseline and the [References](../references/reference.md) for the environment-variable reference and FAQ.
