# Qwen2.5-1.5B 在 Iluvatar BI-V150 上的推理

> 硬件：Iluvatar BI-V150（CoreX）
> 框架：vLLM + vllm-plugin-FL + FlagGems

---

## 目录

1. [模型概览](#1-模型概览)
2. [环境要求](#2-环境要求)
3. [安装](#3-安装)
4. [模型下载](#4-模型下载)
5. [推理脚本](#5-推理脚本)
6. [运行说明](#6-运行说明)
7. [参数调优](#7-参数调优)
8. [基准性能](#8-基准性能)
9. [常见问题](#9-常见问题)

---

## 1. 模型概览

**Qwen2.5-1.5B** 是阿里巴巴 Qwen2.5 系列的小规模语言模型，参数量约 15 亿。

### 模型信息

| 属性 | 值 |
|----------|-------|
| 模型类型 | `Qwen2ForCausalLM` |
| 参数量 | 1.54B |
| 隐藏层大小 | 1536 |
| 层数 | 28 |
| 注意力头数 | 12 |
| 上下文长度 | 32,768 tokens |
| 词表大小 | 151,936 |
| 数据类型 | bfloat16 / float16 |

### HuggingFace / ModelScope 路径

| 平台 | 路径 |
|----------|------|
| HuggingFace | `Qwen/Qwen2.5-1.5B` |
| ModelScope | `Qwen/Qwen2.5-1___5B` |

---

## 2. 环境要求

### 2.1 前提条件

确保已安装 FlagOS 组件：

| 组件 | 最低版本 | 验证方式 |
|-----------|----------------|-------------|
| vLLM（vllm-corex） | v0.13.0 | `python3 -c "import vllm; print(vllm.__version__)"` |
| vllm-plugin-FL | 最新 | `python3 -c "import vllm_plugin_fl; print(vllm_plugin_fl.__version__)"` |
| FlagGems | >= 5.0.0 | `python3 -c "import flag_gems; print(flag_gems.__version__)"` |
| FlagTree | 0.5.1+iluvatar3.1 | `python3 -c "import triton; print(triton.__version__)"` |
| PyTorch CoreX | >= 2.2.0 | `python3 -c "import torch; print(torch.__version__)"` |

### 2.2 环境变量

```bash
# 必需
export VLLM_PLUGINS=fl
export FLAGTREE_BACKEND=iluvatar

# 推荐
export MODELSCOPE_CACHE=/path/to/model/cache
```

---

## 3. 安装

### 3.1 组件依赖关系

```
vllm-plugin-FL
  ├── 依赖 vLLM（v0.13.0 vllm-corex）── 推理引擎
  ├── 依赖 FlagGems（>= 5.0.0）───────── 算子加速
  ├── 依赖 FlagTree（0.5.1+iluvatar3.1）── Triton 编译器
  └── 可选：FlagCX（>= 0.9.0）──────────── 多卡通信

FlagGems
  ├── 依赖 PyTorch（CoreX 定制版）
  └── 依赖 Triton（由 FlagTree 提供）

FlagTree（iluvatar）
  └── 独立编译器，提供 iluvatar 后端 triton wheel
```

### 3.2 必需与可选组件

| 组件 | 是否必需 | 版本 | 备注 |
|-----------|----------|---------|-------|
| **PyTorch** | 必需 | >= 2.2.0（CoreX 定制版） | Iluvatar 需要 torch-corex |
| **FlagTree** | **必需** | `0.5.1+iluvatar3.1` | Iluvatar 后端 Triton 编译器 |
| **vLLM** | 必需 | v0.13.0（vllm-corex） | **必须使用 CoreX 定制版本** |
| **FlagGems** | 必需 | >= 5.0.0 | 算子加速库 |
| **vllm-plugin-FL** | 必需 | v0.1.x（最新） | 多芯片调度插件 |
| **FlagCX** | 可选 | >= 0.9.0 | 多卡通信（IXCCL 后端） |

### 3.3 步骤 0：基础环境设置

#### 系统要求

- **操作系统**：Ubuntu 20.04 / 22.04（Docker 容器环境）
- **Python**：3.10 或 3.12（推荐 3.12）
- **CoreX SDK**：已安装 Iluvatar CoreX 驱动和运行时

#### 验证 GPU 可用性

```bash
# 检查 CoreX 设备
corex-smi

# 或通过 PyTorch 检查
python3 -c "
import torch
print(f'CUDA available: {torch.cuda.is_available()}')
print(f'Device count: {torch.cuda.device_count()}')
if torch.cuda.device_count() > 0:
    print(f'Device 0: {torch.cuda.get_device_name(0)}')
    m = torch.cuda.get_device_properties(0).total_mem / 1e9
    print(f'Memory: {m:.1f} GB')
"
```

#### 网络配置

Days 集群通常无法直接访问 GitHub 或 HuggingFace。配置镜像源：

```bash
# pip 镜像
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# FlagOS 私有 PyPI（用于带后端后缀的 flagtree wheel）
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple --trusted-host=resource.flagos.net"
```

#### 安装构建依赖

```bash
apt update && apt install -y zlib1g zlib1g-dev libxml2 libxml2-dev \
    nlohmann-json3-dev build-essential cmake ninja-build

pip install -U pip setuptools wheel
pip install -U scikit-build-core>=0.11 pybind11 ninja cmake
```

### 3.4 步骤 1：安装 FlagTree（Iluvatar 后端）

#### 什么是 FlagTree

FlagTree 是基于 Triton 的统一多芯片编译器。对于 Iluvatar BV150，FlagTree 提供 **iluvatar 后端**，将 Triton DSL 编译为 CoreX IR → Iluvatar GPU 机器码。

#### 安装

```bash
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple --trusted-host=resource.flagos.net"

# Python 3.12
python3 -m pip install flagtree===0.5.1+iluvatar3.1 $RES

# Python 3.10
python3 -m pip install flagtree===0.5.1+iluvatar3.1 $RES
```

> **关键**：`pip install flagtree===0.5.1`（不带后缀）安装的是 **NVIDIA 版本**，在 BV150 上无法工作。您**必须**使用 `flagtree===0.5.1+iluvatar3.1`（带 `+iluvatar3.1` 后缀）。此 wheel 提供带有 Iluvatar 后端的 Triton 编译器。

#### 验证

```bash
python3 -m pip show flagtree

# 验证 Triton 版本
python3 -c "
import triton
print(f'Triton version: {triton.__version__}')
print(f'Triton path: {triton.__path__}')
"
```

#### Docker 镜像（推荐的替代方案）

```bash
# 拉取预构建的 Iluvatar FlagTree 镜像
docker pull harbor.baai.ac.cn/flagtree/flagtree-iluvatar-py312-torch2.7.1-4.4.0release:latest

# 此镜像包含：FlagTree（iluvatar）+ PyTorch CoreX + Triton iluvatar 后端
```

### 3.5 步骤 2：安装 vLLM（CoreX 定制版本）

> **关键**：上游 vLLM 无法在 BV150 上使用。上游的 `_C.abi3.so` 链接到 `libcudart.so.12`（CUDA 运行时），而 Iluvatar CoreX 没有该库。
>
> 您**必须**使用 **vllm-corex**（Iluvatar 定制的 vLLM，基于 vLLM v0.13.0）。

#### 获取 vllm-corex

```bash
# 方法 A：从 CoreX SDK 获取（推荐）
# vllm-corex wheel 通常在 CoreX SDK 包中
pip install /path/to/vllm_corex-0.13.0*-py3-none-any.whl

# 方法 B：从镜像仓库获取
# 使用预装 vllm-corex 的容器镜像
docker pull harbor.baai.ac.cn/flaggems/iluvatar-flaggems-test-bi-v150:latest
```

#### 验证

```bash
python3 -c "
import vllm
print(f'vLLM version: {vllm.__version__}')
print(f'vLLM path: {vllm.__file__}')
from vllm import LLM, SamplingParams
print('vLLM import OK')
"
```

### 3.6 步骤 3：安装 FlagGems

#### 什么是 FlagGems

FlagGems 是基于 Triton 的高性能统一算子库。通过 PyTorch ATen 注册，它**自动替换** `torch.*` 和 `torch.nn.functional.*` 中的算子为优化的 Triton 实现。

对于 Iluvatar BV150，FlagGems 将标准 PyTorch 算子（mm、softmax、rms_norm 等）编译为 CoreX IR 执行。

#### 安装

```bash
# 1. 构建依赖（如果已在步骤 0 中完成则可跳过）
pip install -U scikit-build-core>=0.11 pybind11 ninja cmake

# 2. 克隆 FlagGems
git clone https://github.com/flagos-ai/FlagGems
cd FlagGems

# 3. 检出稳定版本
git checkout v5.0.0

# 4. 安装
pip install --no-build-isolation .
# 或可编辑模式：pip install -e .
```

#### 验证

```python
python3 -c "
import torch
# 先初始化 CUDA/CoreX（重要！）
_ = torch.cuda.device_count()
import flag_gems
print(f'FlagGems version: {flag_gems.__version__}')
print(f'Vendor: {flag_gems.vendor_name}')
print(f'Device: {flag_gems.device}')
"
```

#### 使用方式

```python
import torch
_ = torch.cuda.device_count()
import flag_gems

# 方法 1：全局启用（推荐）
flag_gems.enable()

# 方法 2：作用域启用
with flag_gems.use_gems():
    x = torch.randn(4096, 4096, device="cuda")
    y = torch.mm(x, x)  # 使用 FlagGems 实现

# 方法 3：显式调用
from flag_gems import ops
c = ops.mm(a, b)
```

> **导入顺序（BV150 必需）**：
> ```python
> # ✅ 正确
> import torch
> _ = torch.cuda.device_count()  # 先初始化 CoreX
> import flag_gems               # 再导入 flag_gems
>
> # ❌ 错误
> import flag_gems               # 过早导入可能导致 RuntimeError
> import torch
> ```
>
> 原因：`import flag_gems` 会触发 `utils/libentry.py` 中的模块级 `LibCache()` 初始化，该初始化调用 `torch.cuda.get_device_name()`。在 CoreX 上，这可能导致 `RuntimeError: No HIP GPUs are available`。

### 3.7 步骤 4：安装 vllm-plugin-FL

#### 什么是 vllm-plugin-FL

vllm-plugin-FL 是 FlagOS 生态系统的**核心调度插件**，负责：
- **多芯片调度**：自动检测硬件平台（Iluvatar / NVIDIA / Ascend 等）
- **厂商适配**：管理 `VENDOR_DEVICE_MAP`，注册厂商设备
- **FlagGems 集成**：协调算子加速库加载
- **FlagCX 集成**：多卡通信

#### 安装

```bash
# 1. 克隆插件仓库
git clone https://github.com/flagos-ai/vllm-plugin-FL
cd vllm-plugin-FL

# 2. 安装
pip install --no-build-isolation .
# 或可编辑模式：pip install -e .
```

#### 验证

```bash
python3 -c "
import vllm_plugin_fl
print(f'Plugin version: {vllm_plugin_fl.__version__}')
"
```

### 3.8 步骤 5：（可选）安装 FlagCX

#### 什么是 FlagCX

FlagCX 是统一多芯片通信库。对于 BV150，它使用 **IXCCL**（Iluvatar 通信库）后端，支持多卡同构通信和跨芯片异构通信。

#### 安装

```bash
# 1. 克隆
git clone https://github.com/flagos-ai/FlagCX.git
cd FlagCX
git checkout v0.9.0
git submodule update --init --recursive

# 2. 为 Iluvatar 后端构建
make USE_ILUVATAR=1 -j$(nproc)

# 3. 设置环境变量
export FLAGCX_PATH="$PWD"

# 4. 安装 PyTorch 插件
cd plugin/torch/
FLAGCX_ADAPTOR=iluvatar pip install . --no-build-isolation
```

#### 验证

```bash
python3 -c "import flagcx; print(flagcx.__version__)"

# 运行通信测试
cd test && python3 -m pytest test_allreduce.py -v
```

### 3.9 步骤 6：环境变量和验证

#### BV150 必需的环境变量

```bash
# === 必需 ===
export VLLM_PLUGINS=fl                # 加载 vllm-plugin-fl
export FLAGTREE_BACKEND=iluvatar      # 设置 FlagTree 后端为 Iluvatar

# === 推荐 ===
export USE_FLAGGEMS=1                 # 启用 FlagGems 算子加速（默认启用）
export MODELSCOPE_CACHE=/path/to/cache  # 模型缓存目录（无法访问 HF 时）

# === 可选 ===
# export FLAGCX_PATH=/path/to/FlagCX   # 如果安装了 FlagCX
# export CUDA_VISIBLE_DEVICES=0        # 控制可见 GPU
```

#### 完整验证脚本

创建 `verify_flagos.py`：

```python
#!/usr/bin/env python3
"""FlagOS BV150 环境完整性验证"""
import os
import sys

def check(desc, func):
    try:
        func()
        print(f"  ✅ {desc}")
    except Exception as e:
        print(f"  ❌ {desc}: {e}")
        return False
    return True

print("=" * 50)
print("FlagOS 环境验证（Iluvatar BV150）")
print("=" * 50)

# 1. 环境变量
print("\n[1] 环境变量：")
check("VLLM_PLUGINS=fl", lambda: os.environ.get("VLLM_PLUGINS") == "fl")
check("FLAGTREE_BACKEND=iluvatar", lambda: os.environ.get("FLAGTREE_BACKEND") == "iluvatar")

# 2. PyTorch + CoreX
print("\n[2] PyTorch + CoreX GPU：")
import torch
check("torch version", lambda: print(f"      {torch.__version__}"))
check("CUDA available", lambda: torch.cuda.is_available())
check(f"Device: {torch.cuda.get_device_name(0)}", lambda: None)
check(f"GPU count: {torch.cuda.device_count()}", lambda: None)

# 3. FlagTree / Triton
print("\n[3] FlagTree / Triton：")
import triton
check(f"Triton version: {triton.__version__}", lambda: None)

try:
    import flagtree
    check(f"FlagTree version: {flagtree.__version__}", lambda: None)
except ImportError:
    print("  ⚠️ flagtree 模块不可直接导入（可能已集成到 triton 中）")

# 4. FlagGems
print("\n[4] FlagGems：")
import flag_gems
check(f"FlagGems version: {flag_gems.__version__}", lambda: None)
check(f"Vendor: {flag_gems.vendor_name}", lambda: None)
check(f"Device type: {flag_gems.device}", lambda: None)

# 5. vLLM
print("\n[5] vLLM：")
import vllm
check(f"vLLM version: {vllm.__version__}", lambda: None)
from vllm import LLM, SamplingParams
check("vLLM import LLM", lambda: None)

# 6. vllm-plugin-FL
print("\n[6] vllm-plugin-FL：")
try:
    import vllm_plugin_fl
    check(f"Plugin version: {vllm_plugin_fl.__version__}", lambda: None)
except ImportError:
    print("  ⚠️ vllm_plugin_fl 不可导入（尝试：from vllm_fl import plugin）")

# 7. FlagCX（可选）
print("\n[7] FlagCX（可选）：")
try:
    import flagcx
    check(f"FlagCX version: {flagcx.__version__}", lambda: None)
except ImportError:
    print("  ⚠️ FlagCX 未安装（多卡可选）")

print("\n" + "=" * 50)
print("验证完成。")
print("=" * 50)
```

---

## 4. 模型下载

### 4.1 从 ModelScope 下载（推荐，国内可访问）

```bash
pip install modelscope

python3 -c "
from modelscope import snapshot_download
model_dir = snapshot_download(
    'Qwen/Qwen2.5-1.5B',
    cache_dir='/path/to/cache'
)
print(f'Model downloaded to: {model_dir}')
"
```

### 4.2 ModelScope 缓存目录结构

下载后，模型文件位于：

```
/path/to/cache/
└── Qwen/
    └── Qwen2___5-1___5B/    # 注意：下划线转义
        ├── config.json
        ├── tokenizer.json
        ├── model-00001-of-00002.safetensors
        ├── model-00002-of-00002.safetensors
        └── ...
```

### 4.3 从 HuggingFace 下载（需要网络访问）

```bash
pip install huggingface-hub
huggingface-cli download Qwen/Qwen2.5-1.5B --local-dir /path/to/model
```

---

## 5. 推理脚本

### 5.1 基础推理脚本

创建 `run_qwen2.5_1.5b.py`：

```python
#!/usr/bin/env python3
"""Qwen2.5-1.5B 推理示例 — Iluvatar BI-V150"""
import os
import sys

# === 环境变量（必需） ===
os.environ["VLLM_PLUGINS"] = "fl"
os.environ["FLAGTREE_BACKEND"] = "iluvatar"

# === 配置 ===
MODEL_PATH = "/path/to/Qwen/Qwen2.5-1.5B"  # 修改为实际路径

from vllm import LLM, SamplingParams


def main():
    # 采样参数
    sampling_params = SamplingParams(
        temperature=0.7,
        top_p=0.8,
        max_tokens=100,
    )

    print(f"Loading model from: {MODEL_PATH}")
    print("(首次加载可能需要几分钟...)")

    try:
        # 加载模型
        llm = LLM(
            model=MODEL_PATH,
            max_num_batched_tokens=8192,
            max_num_seqs=32,
            trust_remote_code=True,
            enforce_eager=True,          # BV150 必需：禁用 CUDA Graph
            dtype="auto",                # 自动选择 bfloat16/float16
            gpu_memory_utilization=0.90, # GPU 内存利用率
        )
        print("模型加载成功！\n")

        # 测试提示词
        prompts = [
            "Hello, my name is",
            "The capital of China is",
            "Machine learning is",
            "请用中文介绍一下深度学习：",
        ]

        outputs = llm.generate(prompts, sampling_params)

        for i, output in enumerate(outputs):
            prompt = output.prompt
            generated_text = output.outputs[0].text
            print(f"Prompt {i}: {prompt!r}")
            print(f"Generated {i}: {generated_text!r}")
            print()

    except Exception as e:
        print(f"推理过程中出错: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
```

### 5.2 带 FlagGems 的推理脚本

显式启用 FlagGems 算子加速：

```python
#!/usr/bin/env python3
"""Qwen2.5-1.5B 推理 + FlagGems 加速 — Iluvatar BI-V150"""
import os

os.environ["VLLM_PLUGINS"] = "fl"
os.environ["FLAGTREE_BACKEND"] = "iluvatar"

import torch

# 重要：在导入 flag_gems 之前初始化 CoreX
_ = torch.cuda.device_count()
import flag_gems
flag_gems.enable()

from vllm import LLM, SamplingParams

MODEL_PATH = "/path/to/Qwen/Qwen2.5-1.5B"

llm = LLM(
    model=MODEL_PATH,
    max_num_batched_tokens=8192,
    max_num_seqs=32,
    trust_remote_code=True,
    enforce_eager=True,
)

sampling_params = SamplingParams(temperature=0.7, top_p=0.8, max_tokens=100)

outputs = llm.generate([
    "The capital of China is",
    "Machine learning is",
    "请用中文介绍一下深度学习：",
], sampling_params)

for output in outputs:
    print(f"Prompt: {output.prompt!r}")
    print(f"Generated: {output.outputs[0].text!r}")
    print()
```

### 5.3 服务模式（vLLM API 服务器）

```bash
# 启动兼容 OpenAI 的 API 服务器
vllm serve /path/to/Qwen/Qwen2.5-1.5B \
    --trust-remote-code \
    --enforce-eager \
    --max-num-batched-tokens 8192 \
    --max-num-seqs 32 \
    --gpu-memory-utilization 0.90 \
    --port 8000
```

客户端请求：

```bash
curl http://localhost:8000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "/path/to/Qwen/Qwen2.5-1.5B",
        "messages": [{"role": "user", "content": "Hello!"}],
        "max_tokens": 100
    }'
```

---

## 6. 运行说明

### 6.1 直接运行

```bash
# 设置环境变量
export VLLM_PLUGINS=fl
export FLAGTREE_BACKEND=iluvatar
export MODELSCOPE_CACHE=/path/to/cache

# 运行推理脚本
python3 run_qwen2.5_1.5b.py
```

### 6.2 在 Docker 容器中运行

```bash
# 进入容器
docker exec -it <container_name> bash

# 设置环境变量
export VLLM_PLUGINS=fl
export FLAGTREE_BACKEND=iluvatar

# 运行推理
python3 /path/to/run_qwen2.5_1.5b.py
```

### 6.3 预期输出

```
Loading model from: /path/to/Qwen/Qwen2.5-1.5B
(首次加载可能需要几分钟...)
模型加载成功！

Prompt 0: 'Hello, my name is'
Generated 0: 'Sarah, and I am a student at the University of California, Berkeley...'

Prompt 1: 'The capital of China is'
Generated 1: 'Beijing, a city with a history of over 3,000 years...'

Prompt 2: 'Machine learning is'
Generated 2: 'a subset of artificial intelligence that enables systems to learn...'

Prompt 3: '请用中文介绍一下深度学习：'
Generated 3: '深度学习是机器学习的一个重要分支，它通过多层神经网络来学习数据的层次化特征表示...'
```

---

## 7. 参数调优

### 7.1 LLM 初始化参数

| 参数 | 推荐值 | 备注 |
|-----------|-------------|-------|
| `enforce_eager` | `True` | **BV150 必需**。Iluvatar CoreX 不支持 CUDA Graph |
| `max_num_batched_tokens` | 8192 | 每批次最大 token 数，根据内存调整 |
| `max_num_seqs` | 8–64 | 并行序列数，BV150 推荐 32 |
| `gpu_memory_utilization` | 0.85–0.95 | GPU 内存利用率，BV150 推荐 0.90 |
| `trust_remote_code` | `True` | Qwen2.5 需要自定义代码支持 |
| `dtype` | `"auto"` | 自动选择，也可指定 `"bfloat16"` |
| `max_model_len` | 32768 | 最大上下文长度（Qwen2.5 默认） |

### 7.2 SamplingParams 参数

| 参数 | 推荐值 | 备注 |
|-----------|-------------|-------|
| `temperature` | 0.7 | 采样温度（0=确定性，1=高随机性） |
| `top_p` | 0.8 | 核采样阈值 |
| `top_k` | 50 | Top-K 采样 |
| `max_tokens` | 512–2048 | 生成长度限制 |
| `repetition_penalty` | 1.05 | 重复惩罚 |
| `stop` | 自定义 | 停止 token 列表 |

### 7.3 BV150 特定优化

```python
# 内存优化配置
llm = LLM(
    model=MODEL_PATH,
    enforce_eager=True,
    max_num_batched_tokens=4096,    # 降低以节省内存
    max_num_seqs=16,                # 降低并行度以节省内存
    gpu_memory_utilization=0.85,    # 降低内存利用率
    dtype="float16",                # 使用 float16 节省内存
    max_model_len=16384,            # 缩短上下文长度
)
```

---

## 8. 基准性能

### 8.1 Qwen2.5-1.5B 在 BV150 上的预期性能

> 数据基于 Iluvatar BI-V150（CoreX）环境测试。

| 指标 | 值 |
|--------|-------|
| 模型加载时间 | ~2–5 分钟 |
| Prefill 吞吐量 | ~1000–3000 tokens/s |
| Decode 吞吐量 | ~20–50 tokens/s |
| 首 token 延迟 | ~1–5 秒 |
| GPU 内存使用 | ~4–6 GB |
| 峰值内存 | ~8 GB |

### 8.2 性能影响因素

- **enforce_eager**：禁用 CUDA Graph 会降低 decode 性能，但 BV150 需要它
- **FlagGems 加速**：启用 FlagGems 可改善注意力和 FFN 算子性能
- **批次大小**：增加 `max_num_seqs` 可提高吞吐量但增加内存使用

---

## 9. 常见问题

### Q1：模型加载失败，报 `_symmetric_memory` 错误

```
AttributeError: module 'torch' has no attribute '_symmetric_memory'
```

**原因**：torch-corex 中不支持的符号。vLLM 的 `parallel_state.py` 尝试导入 `_symmetric_memory`。

**解决方案**：
```bash
# 找到文件
grep -r "_symmetric_memory" $(python3 -c "import vllm; print(vllm.__path__[0])")

# 注释掉相关行
# import _symmetric_memory
```
或使用 vllm-corex（已修复）。

### Q2：推理时 OOM（内存不足）

**原因**：模型 + KV Cache 超出 BV150 内存容量。

**解决方案**：
```python
llm = LLM(
    model=MODEL_PATH,
    enforce_eager=True,
    gpu_memory_utilization=0.80,     # 降低利用率
    max_num_batched_tokens=2048,     # 减少批次
    max_num_seqs=8,                  # 减少并行序列
    max_model_len=8192,              # 缩短上下文
)
```

### Q3：推理速度远低于预期

**检查清单**：
1. 是否设置了 `enforce_eager=True`（必需）
2. 是否启用了 `VLLM_PLUGINS=fl` 和 `FLAGTREE_BACKEND=iluvatar`
3. FlagGems 是否正确加载（`import flag_gems; flag_gems.enable()`）
4. GPU 是否仅单卡运行（`CUDA_VISIBLE_DEVICES=0`）

### Q4：模型下载失败（网络受限）

**原因**：Days 集群无法访问 HuggingFace。

**解决方案**：
```bash
# 使用 ModelScope
pip install modelscope
python3 -c "
from modelscope import snapshot_download
snapshot_download('Qwen/Qwen2.5-1.5B', cache_dir='/data/model')
"

# 或从现有镜像/本地路径复制
cp -r /data/iluv/model/Qwen2___5-1___5B /your/cache/
```

### Q5：`RuntimeError: No HIP GPUs are available`

**原因**：FlagGems 在 CUDA/CoreX 初始化之前导入。

**解决方案**：
```python
import torch
_ = torch.cuda.device_count()  # 先初始化
import flag_gems               # 再导入
```

### Q6：输出乱码或无意义

**检查清单**：
1. 是否设置了 `trust_remote_code=True`（Qwen2.5 需要）
2. `tokenizer` 是否正确加载
3. 模型路径是否正确（注意 ModelScope 目录名使用 `___` 转义）

### Q7：`ModuleNotFoundError: No module named 'triton'`

**原因**：FlagTree 安装时未带后端后缀。

**解决方案**：使用 `flagtree===0.5.1+iluvatar3.1`（带 `+iluvatar` 后缀）。

### Q8：`libcudart.so.12` 未找到

**原因**：使用了上游 vLLM 而非 vllm-corex。

**解决方案**：必须使用 vllm-corex。

### Q9：`Vendor 'iluvatar' not found in VENDOR_DEVICE_MAP`

**原因**：vllm-plugin-FL 版本过旧。

**解决方案**：升级到最新版本。

### 网络受限环境替代方案

```bash
# pip 使用清华镜像
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# Git 使用 Gitee 镜像（如有）
git clone https://gitee.com/mirrors/FlagGems

# 模型下载使用 ModelScope
pip install modelscope
python3 -c "
from modelscope import snapshot_download
snapshot_download('Qwen/Qwen2.5-1.5B', cache_dir='/path/to/cache')
"

# 或使用本地已下载的模型
# 从本地路径如 /data/iluv/model/ 复制
```

### vLLM 版本兼容性

| vllm-plugin-FL 版本 | vLLM 版本 | 备注 |
|------------------------|-------------|-------|
| v0.1.x | **v0.13.0**（vllm-corex） | BV150 推荐版本 |
| latest（main） | v0.18.1 / v0.20.2 | 主要针对 NVIDIA 设计 |

**BV150 必须使用 v0.13.0 系列的 vllm-corex。**

### Docker 镜像推荐

```bash
# FlagTree Iluvatar 镜像
docker pull harbor.baai.ac.cn/flagtree/flagtree-iluvatar-py312-torch2.7.1-4.4.0release:latest

# FlagGems Iluvatar 测试镜像
docker pull harbor.baai.ac.cn/flaggems/iluvatar-flaggems-test-bi-v150:latest
```
