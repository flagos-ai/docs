# 安装

verl-hardware-plugin 以 Python 包形式安装，verl 通过 `verl.plugins` entry-points 组自动发现。

## 前置条件

- Linux
- Python >= 3.10
- [verl](https://github.com/verl-project/verl) >= 0.7.0（插件注册机制由 [verl#6086](https://github.com/verl-project/verl/pull/6086) 提供；Iluvatar 使用 verl > 0.8.0）
- 目标硬件的厂商软件栈（驱动、`torch_mlu` 等 torch 扩展，以及 CNCL/MCCL/IXCCL 等通信库）
- （可选，FlagOS 引擎需要）[FlagCX](https://github.com/flagos-ai/FlagCX) 与 [FlagGems](https://github.com/flagos-ai/FlagGems)

## 从源码安装

```bash
# 1. 安装 verl（见 https://verl.readthedocs.io/en/latest/start/install.html）
git clone https://github.com/verl-project/verl
cd verl
pip install --no-build-isolation -e .

# 2. 安装 verl-hardware-plugin
git clone https://github.com/verl-project/verl-hardware-plugin.git
cd verl-hardware-plugin
pip install --no-build-isolation -e .
```

安装后无需在 verl 中做任何额外配置。verl 启动时会导入注册在 `verl.plugins` 组下的所有包，从而触发所有平台与引擎的注册。

验证注册：

```bash
python3 -c "from verl.plugin.platform import get_platform; p = get_platform(); print(f'device: {p.device_name}'); print(f'vendor: {p.vendor_name}'); print(f'available: {p.is_available()}')"
```

## 平台选择

平台在启动时自动检测。可通过 `VERL_PLATFORM` 环境变量覆盖：

```bash
export VERL_PLATFORM=metax       # 沐曦 MetaX
export VERL_PLATFORM=intel       # Intel XPU
export VERL_PLATFORM=cambricon   # 寒武纪 MLU
```

在 NVIDIA 上使用 FlagOS 引擎时，设置引擎设备与厂商：

```bash
export VERL_ENGINE_DEVICE=cuda
export VERL_ENGINE_VENDOR=flagos
```

## 各平台特定设置

每个硬件平台都有各自的基础镜像、驱动挂载与环境要求。尽可能使用厂商提供的容器镜像。

| 平台 | 基础镜像 / 软件栈 | 平台环境变量 | 通信 | 指南 |
|------|-------------------|--------------|------|------|
| NVIDIA（FlagOS） | `harbor.baai.ac.cn/flagscale/flagscale-rl:dev-cu128-py3.12-*` | `VERL_ENGINE_VENDOR=flagos` | NCCL / FlagCX | [nvidia 指南](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_flagos/nvidia) |
| 沐曦 MetaX | MetaX Docker Hub 镜像，如 `verl:0.7.1-maca.ai3.5.3.3-torch2.8-py312-ubuntu22.04-amd64` | `VERL_PLATFORM=metax` | MCCL | [metax 指南](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_metax) |
| 天数智芯 Iluvatar | `harbor.baai.ac.cn/flagos21-base/iluvatarcorex-4.4.0-ubuntu24-py312-base:*` | 自动 / `iluvatar` | IXCCL | [iluvatar 指南](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_iluvatar) |
| 寒武纪 MLU | 寒武纪 release 镜像（联系寒武纪获取），`pytorch_infer` 环境 | 自动 / `cambricon` | CNCL | [mlu 指南](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_mlu) |
| 燧原 Enflame GCU | 厂商镜像 | 自动 | ECCL / FlagCX | [enflame 指南](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_enflame) |
| Intel XPU | oneAPI 环境（`source /opt/intel/oneapi/setvars.sh`） | `VERL_PLATFORM=intel` | xccl (oneCCL) | [xpu 指南](https://github.com/verl-project/verl-hardware-plugin/tree/main/docs/user_guide_xpu) |

寒武纪 MLU 需在容器内额外安装 `numpy<2` 与 `TransferQueue`。沐曦与天数智芯容器内需有 `mx-smi` / CoreX 软件栈以供硬件自动检测。

## 准备数据与模型

各平台指南以 Qwen3-0.6B 与 GSM8K 作为端到端参考示例：

```bash
# 模型
modelscope download --model Qwen/Qwen3-0.6B --local_dir ./Qwen3-0.6B

# 数据集
mkdir gsm8k && cd gsm8k
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/rl/datasets/gsm8k/train.parquet"
wget "https://baai-flagscale.ks3-cn-beijing.ksyuncs.com/rl/datasets/gsm8k/test.parquet"
```

启动训练前先启动 Ray 集群：

```bash
ray start --head --dashboard-host=0.0.0.0
```

运行 GSM8K GRPO 基线见[用户指南](../user_guide/user-guide.md)，环境变量参考与 FAQ 见[参考](../references/reference.md)。
