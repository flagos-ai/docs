# Qwen2.5-1.5B inference on Iluvatar BI-V150

> Hardware: Iluvatar BI-V150 (CoreX)
> Framework: vLLM + vllm-plugin-FL + FlagGems

---

## Contents

1. [Model overview](#1-model-overview)
2. [Environment requirements](#2-environment-requirements)
3. [Installation](#3-installation)
4. [Model download](#4-model-download)
5. [Inference scripts](#5-inference-scripts)
6. [Running instructions](#6-running-instructions)
7. [Parameter tuning](#7-parameter-tuning)
8. [Benchmark performance](#8-benchmark-performance)
9. [FAQ](#9-faq)

---

## 1. Model overview

**Qwen2.5-1.5B** is a small-scale language model from the Alibaba Qwen2.5 series, with approximately 1.5 billion parameters.

### Model info

| Property | Value |
|----------|-------|
| Model type | `Qwen2ForCausalLM` |
| Parameters | 1.54B |
| Hidden size | 1536 |
| Num layers | 28 |
| Attention heads | 12 |
| Context length | 32,768 tokens |
| Vocabulary size | 151,936 |
| Data type | bfloat16 / float16 |

### HuggingFace / ModelScope paths

| Platform | Path |
|----------|------|
| HuggingFace | `Qwen/Qwen2.5-1.5B` |
| ModelScope | `Qwen/Qwen2.5-1___5B` |

---

## 2. Environment requirements

### 2.1 Prerequisites

Ensure FlagOS components are installed:

| Component | Minimum Version | Verification |
|-----------|----------------|-------------|
| vLLM (vllm-corex) | v0.13.0 | `python3 -c "import vllm; print(vllm.__version__)"` |
| vllm-plugin-FL | latest | `python3 -c "import vllm_plugin_fl; print(vllm_plugin_fl.__version__)"` |
| FlagGems | >= 5.0.0 | `python3 -c "import flag_gems; print(flag_gems.__version__)"` |
| FlagTree | 0.5.1+iluvatar3.1 | `python3 -c "import triton; print(triton.__version__)"` |
| PyTorch CoreX | >= 2.2.0 | `python3 -c "import torch; print(torch.__version__)"` |

### 2.2 Environment variables

```bash
# Required
export VLLM_PLUGINS=fl
export FLAGTREE_BACKEND=iluvatar

# Recommended
export MODELSCOPE_CACHE=/path/to/model/cache
```

---

## 3. Installation

### 3.1 Component dependencies

```
vllm-plugin-FL
  ├── depends on vLLM (v0.13.0 vllm-corex) ── inference engine
  ├── depends on FlagGems (>= 5.0.0) ───────── operator acceleration
  ├── depends on FlagTree (0.5.1+iluvatar3.1) ─ Triton compiler
  └── optional: FlagCX (>= 0.9.0) ──────────── multi-card communication

FlagGems
  ├── depends on PyTorch (CoreX customized)
  └── depends on Triton (provided by FlagTree)

FlagTree (iluvatar)
  └── standalone compiler, provides iluvatar backend triton wheel
```

### 3.2 Required vs optional components

| Component | Required | Version | Notes |
|-----------|----------|---------|-------|
| **PyTorch** | Required | >= 2.2.0 (CoreX customized) | Iluvatar requires torch-corex |
| **FlagTree** | **Required** | `0.5.1+iluvatar3.1` | Iluvatar backend Triton compiler |
| **vLLM** | Required | v0.13.0 (vllm-corex) | **Must use CoreX customized version** |
| **FlagGems** | Required | >= 5.0.0 | Operator acceleration library |
| **vllm-plugin-FL** | Required | v0.1.x (latest) | Multi-chip dispatch plugin |
| **FlagCX** | Optional | >= 0.9.0 | Multi-card communication (IXCCL backend) |

### 3.3 Step 0: Basic environment setup

#### System requirements

- **OS**: Ubuntu 20.04 / 22.04 (Docker container environment)
- **Python**: 3.10 or 3.12 (3.12 recommended)
- **CoreX SDK**: Iluvatar CoreX driver and runtime installed

#### Verify GPU availability

```bash
# Check CoreX devices
corex-smi

# Or check via PyTorch
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

#### Network configuration

Days cluster typically cannot access GitHub or HuggingFace directly. Configure mirror sources:

```bash
# pip mirror
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# FlagOS private PyPI (for flagtree wheel with backend suffix)
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple --trusted-host=resource.flagos.net"
```

#### Install build dependencies

```bash
apt update && apt install -y zlib1g zlib1g-dev libxml2 libxml2-dev \
    nlohmann-json3-dev build-essential cmake ninja-build

pip install -U pip setuptools wheel
pip install -U scikit-build-core>=0.11 pybind11 ninja cmake
```

### 3.4 Step 1: Install FlagTree (Iluvatar backend)

#### What is FlagTree

FlagTree is a unified multi-chip compiler based on Triton. For Iluvatar BV150, FlagTree provides the **iluvatar backend**, compiling Triton DSL into CoreX IR → Iluvatar GPU machine code.

#### Install

```bash
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple --trusted-host=resource.flagos.net"

# Python 3.12
python3 -m pip install flagtree===0.5.1+iluvatar3.1 $RES

# Python 3.10
python3 -m pip install flagtree===0.5.1+iluvatar3.1 $RES
```

> **Critical**: `pip install flagtree===0.5.1` (without suffix) installs the **NVIDIA version**, which does not work on BV150. You **must** use `flagtree===0.5.1+iluvatar3.1` with the `+iluvatar3.1` suffix. This wheel provides the Triton compiler with Iluvatar backend.

#### Verify

```bash
python3 -m pip show flagtree

# Verify Triton version
python3 -c "
import triton
print(f'Triton version: {triton.__version__}')
print(f'Triton path: {triton.__path__}')
"
```

#### Docker image (recommended alternative)

```bash
# Pull pre-built Iluvatar FlagTree image
docker pull harbor.baai.ac.cn/flagtree/flagtree-iluvatar-py312-torch2.7.1-4.4.0release:latest

# This image includes: FlagTree (iluvatar) + PyTorch CoreX + Triton iluvatar backend
```

### 3.5 Step 2: Install vLLM (CoreX customized version)

> **Critical**: Upstream vLLM cannot be used on BV150. The upstream `_C.abi3.so` links against `libcudart.so.12` (CUDA runtime), which Iluvatar CoreX does not have.
>
> You **must** use **vllm-corex** (Iluvatar-customized vLLM, based on vLLM v0.13.0).

#### Get vllm-corex

```bash
# Method A: From CoreX SDK (recommended)
# vllm-corex wheel is typically in the CoreX SDK package
pip install /path/to/vllm_corex-0.13.0*-py3-none-any.whl

# Method B: From image registry
# Use a container image with vllm-corex pre-installed
docker pull harbor.baai.ac.cn/flaggems/iluvatar-flaggems-test-bi-v150:latest
```

#### Verify

```bash
python3 -c "
import vllm
print(f'vLLM version: {vllm.__version__}')
print(f'vLLM path: {vllm.__file__}')
from vllm import LLM, SamplingParams
print('vLLM import OK')
"
```

### 3.6 Step 3: Install FlagGems

#### What is FlagGems

FlagGems is a high-performance unified operator library based on Triton. Through PyTorch ATen registration, it **automatically replaces** operators in `torch.*` and `torch.nn.functional.*` with optimized Triton implementations.

For Iluvatar BV150, FlagGems compiles standard PyTorch operators (mm, softmax, rms_norm, etc.) into CoreX IR for execution.

#### Install

```bash
# 1. Build dependencies (skip if already done in Step 0)
pip install -U scikit-build-core>=0.11 pybind11 ninja cmake

# 2. Clone FlagGems
git clone https://github.com/flagos-ai/FlagGems
cd FlagGems

# 3. Checkout stable version
git checkout v5.0.0

# 4. Install
pip install --no-build-isolation .
# Or editable mode: pip install -e .
```

#### Verify

```python
python3 -c "
import torch
# Initialize CUDA/CoreX first (important!)
_ = torch.cuda.device_count()
import flag_gems
print(f'FlagGems version: {flag_gems.__version__}')
print(f'Vendor: {flag_gems.vendor_name}')
print(f'Device: {flag_gems.device}')
"
```

#### Usage

```python
import torch
_ = torch.cuda.device_count()
import flag_gems

# Method 1: Global enable (recommended)
flag_gems.enable()

# Method 2: Scoped enable
with flag_gems.use_gems():
    x = torch.randn(4096, 4096, device="cuda")
    y = torch.mm(x, x)  # Uses FlagGems implementation

# Method 3: Explicit call
from flag_gems import ops
c = ops.mm(a, b)
```

> **Import order (BV150 required)**:
> ```python
> # ✅ Correct
> import torch
> _ = torch.cuda.device_count()  # Initialize CoreX first
> import flag_gems               # Then import flag_gems
>
> # ❌ Wrong
> import flag_gems               # Early import may cause RuntimeError
> import torch
> ```
>
> Reason: `import flag_gems` triggers module-level `LibCache()` initialization in `utils/libentry.py`, which calls `torch.cuda.get_device_name()`. On CoreX, this may cause `RuntimeError: No HIP GPUs are available`.

### 3.7 Step 4: Install vllm-plugin-FL

#### What is vllm-plugin-FL

vllm-plugin-FL is the **core dispatch plugin** of the FlagOS ecosystem, responsible for:
- **Multi-chip dispatch**: Auto-detect hardware platform (Iluvatar / NVIDIA / Ascend, etc.)
- **Vendor adaptation**: Manage `VENDOR_DEVICE_MAP`, register vendor devices
- **FlagGems integration**: Coordinate operator acceleration library loading
- **FlagCX integration**: Multi-card communication

#### Install

```bash
# 1. Clone plugin repository
git clone https://github.com/flagos-ai/vllm-plugin-FL
cd vllm-plugin-FL

# 2. Install
pip install --no-build-isolation .
# Or editable mode: pip install -e .
```

#### Verify

```bash
python3 -c "
import vllm_plugin_fl
print(f'Plugin version: {vllm_plugin_fl.__version__}')
"
```

### 3.8 Step 5: (Optional) Install FlagCX

#### What is FlagCX

FlagCX is a unified multi-chip communication library. For BV150, it uses **IXCCL** (Iluvatar communication library) backend, supporting multi-card homogeneous communication and cross-chip heterogeneous communication.

#### Install

```bash
# 1. Clone
git clone https://github.com/flagos-ai/FlagCX.git
cd FlagCX
git checkout v0.9.0
git submodule update --init --recursive

# 2. Build for Iluvatar backend
make USE_ILUVATAR=1 -j$(nproc)

# 3. Set environment variable
export FLAGCX_PATH="$PWD"

# 4. Install PyTorch plugin
cd plugin/torch/
FLAGCX_ADAPTOR=iluvatar pip install . --no-build-isolation
```

#### Verify

```bash
python3 -c "import flagcx; print(flagcx.__version__)"

# Run communication test
cd test && python3 -m pytest test_allreduce.py -v
```

### 3.9 Step 6: Environment variables and verification

#### BV150 required environment variables

```bash
# === Required ===
export VLLM_PLUGINS=fl                # Load vllm-plugin-fl
export FLAGTREE_BACKEND=iluvatar      # Set FlagTree backend to Iluvatar

# === Recommended ===
export USE_FLAGGEMS=1                 # Enable FlagGems operator acceleration (enabled by default)
export MODELSCOPE_CACHE=/path/to/cache  # Model cache directory (when no HF access)

# === Optional ===
# export FLAGCX_PATH=/path/to/FlagCX   # If FlagCX is installed
# export CUDA_VISIBLE_DEVICES=0        # Control visible GPUs
```

#### Full verification script

Create `verify_flagos.py`:

```python
#!/usr/bin/env python3
"""FlagOS BV150 environment integrity verification"""
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
print("FlagOS Environment Verification (Iluvatar BV150)")
print("=" * 50)

# 1. Environment variables
print("\n[1] Environment Variables:")
check("VLLM_PLUGINS=fl", lambda: os.environ.get("VLLM_PLUGINS") == "fl")
check("FLAGTREE_BACKEND=iluvatar", lambda: os.environ.get("FLAGTREE_BACKEND") == "iluvatar")

# 2. PyTorch + CoreX
print("\n[2] PyTorch + CoreX GPU:")
import torch
check("torch version", lambda: print(f"      {torch.__version__}"))
check("CUDA available", lambda: torch.cuda.is_available())
check(f"Device: {torch.cuda.get_device_name(0)}", lambda: None)
check(f"GPU count: {torch.cuda.device_count()}", lambda: None)

# 3. FlagTree / Triton
print("\n[3] FlagTree / Triton:")
import triton
check(f"Triton version: {triton.__version__}", lambda: None)

try:
    import flagtree
    check(f"FlagTree version: {flagtree.__version__}", lambda: None)
except ImportError:
    print("  ⚠️ flagtree module not directly importable (may be integrated into triton)")

# 4. FlagGems
print("\n[4] FlagGems:")
import flag_gems
check(f"FlagGems version: {flag_gems.__version__}", lambda: None)
check(f"Vendor: {flag_gems.vendor_name}", lambda: None)
check(f"Device type: {flag_gems.device}", lambda: None)

# 5. vLLM
print("\n[5] vLLM:")
import vllm
check(f"vLLM version: {vllm.__version__}", lambda: None)
from vllm import LLM, SamplingParams
check("vLLM import LLM", lambda: None)

# 6. vllm-plugin-FL
print("\n[6] vllm-plugin-FL:")
try:
    import vllm_plugin_fl
    check(f"Plugin version: {vllm_plugin_fl.__version__}", lambda: None)
except ImportError:
    print("  ⚠️ vllm_plugin_fl not importable (try: from vllm_fl import plugin)")

# 7. FlagCX (optional)
print("\n[7] FlagCX (optional):")
try:
    import flagcx
    check(f"FlagCX version: {flagcx.__version__}", lambda: None)
except ImportError:
    print("  ⚠️ FlagCX not installed (optional for multi-card)")

print("\n" + "=" * 50)
print("Verification complete.")
print("=" * 50)
```

---

## 4. Model download

### 4.1 From ModelScope (recommended, domestic access)

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

### 4.2 ModelScope cache directory structure

After download, model files are located at:

```
/path/to/cache/
└── Qwen/
    └── Qwen2___5-1___5B/    # Note: underscore escaping
        ├── config.json
        ├── tokenizer.json
        ├── model-00001-of-00002.safetensors
        ├── model-00002-of-00002.safetensors
        └── ...
```

### 4.3 From HuggingFace (requires internet access)

```bash
pip install huggingface-hub
huggingface-cli download Qwen/Qwen2.5-1.5B --local-dir /path/to/model
```

---

## 5. Inference scripts

### 5.1 Basic inference script

Create `run_qwen2.5_1.5b.py`:

```python
#!/usr/bin/env python3
"""Qwen2.5-1.5B inference example — Iluvatar BI-V150"""
import os
import sys

# === Environment variables (required) ===
os.environ["VLLM_PLUGINS"] = "fl"
os.environ["FLAGTREE_BACKEND"] = "iluvatar"

# === Configuration ===
MODEL_PATH = "/path/to/Qwen/Qwen2.5-1.5B"  # Modify to actual path

from vllm import LLM, SamplingParams


def main():
    # Sampling parameters
    sampling_params = SamplingParams(
        temperature=0.7,
        top_p=0.8,
        max_tokens=100,
    )

    print(f"Loading model from: {MODEL_PATH}")
    print("(This may take several minutes on first load...)")

    try:
        # Load model
        llm = LLM(
            model=MODEL_PATH,
            max_num_batched_tokens=8192,
            max_num_seqs=32,
            trust_remote_code=True,
            enforce_eager=True,          # BV150 required: disable CUDA Graph
            dtype="auto",                # Auto-select bfloat16/float16
            gpu_memory_utilization=0.90, # GPU memory utilization
        )
        print("Model loaded successfully!\n")

        # Test prompts
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
        print(f"Error during inference: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
```

### 5.2 Inference script with FlagGems

To explicitly enable FlagGems operator acceleration:

```python
#!/usr/bin/env python3
"""Qwen2.5-1.5B inference + FlagGems acceleration — Iluvatar BI-V150"""
import os

os.environ["VLLM_PLUGINS"] = "fl"
os.environ["FLAGTREE_BACKEND"] = "iluvatar"

import torch

# Important: initialize CoreX before importing flag_gems
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

### 5.3 Serving mode (vLLM API Server)

```bash
# Start OpenAI-compatible API Server
vllm serve /path/to/Qwen/Qwen2.5-1.5B \
    --trust-remote-code \
    --enforce-eager \
    --max-num-batched-tokens 8192 \
    --max-num-seqs 32 \
    --gpu-memory-utilization 0.90 \
    --port 8000
```

Client request:

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

## 6. Running instructions

### 6.1 Direct run

```bash
# Set environment variables
export VLLM_PLUGINS=fl
export FLAGTREE_BACKEND=iluvatar
export MODELSCOPE_CACHE=/path/to/cache

# Run inference script
python3 run_qwen2.5_1.5b.py
```

### 6.2 Run in Docker container

```bash
# Enter container
docker exec -it <container_name> bash

# Set environment variables
export VLLM_PLUGINS=fl
export FLAGTREE_BACKEND=iluvatar

# Run inference
python3 /path/to/run_qwen2.5_1.5b.py
```

### 6.3 Expected output

```
Loading model from: /path/to/Qwen/Qwen2.5-1.5B
(This may take several minutes on first load...)
Model loaded successfully!

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

## 7. Parameter tuning

### 7.1 LLM initialization parameters

| Parameter | Recommended | Notes |
|-----------|-------------|-------|
| `enforce_eager` | `True` | **BV150 required**. Iluvatar CoreX does not support CUDA Graph |
| `max_num_batched_tokens` | 8192 | Max tokens per batch, adjust based on memory |
| `max_num_seqs` | 8–64 | Parallel sequences, BV150 recommends 32 |
| `gpu_memory_utilization` | 0.85–0.95 | GPU memory utilization, BV150 recommends 0.90 |
| `trust_remote_code` | `True` | Qwen2.5 requires custom code support |
| `dtype` | `"auto"` | Auto-select, can also specify `"bfloat16"` |
| `max_model_len` | 32768 | Max context length (Qwen2.5 default) |

### 7.2 SamplingParams parameters

| Parameter | Recommended | Notes |
|-----------|-------------|-------|
| `temperature` | 0.7 | Sampling temperature (0=deterministic, 1=high randomness) |
| `top_p` | 0.8 | Nucleus sampling threshold |
| `top_k` | 50 | Top-K sampling |
| `max_tokens` | 512–2048 | Generation length limit |
| `repetition_penalty` | 1.05 | Repetition penalty |
| `stop` | Custom | Stop token list |

### 7.3 BV150-specific optimization

```python
# Memory optimization configuration
llm = LLM(
    model=MODEL_PATH,
    enforce_eager=True,
    max_num_batched_tokens=4096,    # Lower to save memory
    max_num_seqs=16,                # Lower parallelism to save memory
    gpu_memory_utilization=0.85,    # Lower memory utilization
    dtype="float16",                # Use float16 to save memory
    max_model_len=16384,            # Shorten context length
)
```

---

## 8. Benchmark performance

### 8.1 Expected performance of Qwen2.5-1.5B on BV150

> Data based on Iluvatar BI-V150 (CoreX) environment testing.

| Metric | Value |
|--------|-------|
| Model load time | ~2–5 minutes |
| Prefill throughput | ~1000–3000 tokens/s |
| Decode throughput | ~20–50 tokens/s |
| First token latency | ~1–5 seconds |
| GPU memory usage | ~4–6 GB |
| Peak memory | ~8 GB |

### 8.2 Performance factors

- **enforce_eager**: Disabling CUDA Graph reduces decode performance, but BV150 requires it
- **FlagGems acceleration**: Enabling FlagGems can improve attention and FFN operator performance
- **Batch size**: Increasing `max_num_seqs` improves throughput but increases memory usage

---

## 9. FAQ

### Q1: Model load fails with `_symmetric_memory` error

```
AttributeError: module 'torch' has no attribute '_symmetric_memory'
```

**Cause**: Unsupported symbol in torch-corex. vLLM's `parallel_state.py` attempts to import `_symmetric_memory`.

**Solution**:
```bash
# Find the file
grep -r "_symmetric_memory" $(python3 -c "import vllm; print(vllm.__path__[0])")

# Comment out the relevant lines
# import _symmetric_memory
```
Or use vllm-corex (already fixed).

### Q2: OOM (Out of Memory) during inference

**Cause**: Model + KV Cache exceeds BV150 memory capacity.

**Solution**:
```python
llm = LLM(
    model=MODEL_PATH,
    enforce_eager=True,
    gpu_memory_utilization=0.80,     # Lower utilization
    max_num_batched_tokens=2048,     # Reduce batch
    max_num_seqs=8,                  # Reduce parallel sequences
    max_model_len=8192,              # Shorten context
)
```

### Q3: Inference speed much slower than expected

**Checklist**:
1. Is `enforce_eager=True` set (required)
2. Are `VLLM_PLUGINS=fl` and `FLAGTREE_BACKEND=iluvatar` enabled
3. Is FlagGems correctly loaded (`import flag_gems; flag_gems.enable()`)
4. Is GPU running single-card only (`CUDA_VISIBLE_DEVICES=0`)

### Q4: Model download fails (network restricted)

**Cause**: Days cluster cannot access HuggingFace.

**Solution**:
```bash
# Use ModelScope
pip install modelscope
python3 -c "
from modelscope import snapshot_download
snapshot_download('Qwen/Qwen2.5-1.5B', cache_dir='/data/model')
"

# Or copy from existing image/local path
cp -r /data/iluv/model/Qwen2___5-1___5B /your/cache/
```

### Q5: `RuntimeError: No HIP GPUs are available`

**Cause**: FlagGems imported before CUDA/CoreX initialization.

**Solution**:
```python
import torch
_ = torch.cuda.device_count()  # Initialize first
import flag_gems               # Then import
```

### Q6: Output is garbled or meaningless

**Checklist**:
1. Is `trust_remote_code=True` set (Qwen2.5 requires it)
2. Is `tokenizer` loaded correctly
3. Is the model path correct (note ModelScope directory names use `___` escaping)

### Q7: `ModuleNotFoundError: No module named 'triton'`

**Cause**: FlagTree installed without backend suffix.

**Solution**: Use `flagtree===0.5.1+iluvatar3.1` (with `+iluvatar` suffix).

### Q8: `libcudart.so.12` not found

**Cause**: Upstream vLLM used instead of vllm-corex.

**Solution**: Must use vllm-corex.

### Q9: `Vendor 'iluvatar' not found in VENDOR_DEVICE_MAP`

**Cause**: vllm-plugin-FL version too old.

**Solution**: Upgrade to latest version.

### Network-restricted environment alternatives

```bash
# pip use Tsinghua mirror
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# Git use Gitee mirror (if available)
git clone https://gitee.com/mirrors/FlagGems

# Model download use ModelScope
pip install modelscope
python3 -c "
from modelscope import snapshot_download
snapshot_download('Qwen/Qwen2.5-1.5B', cache_dir='/path/to/cache')
"

# Or use locally downloaded models
# Copy from local paths like /data/iluv/model/
```

### vLLM version compatibility

| vllm-plugin-FL version | vLLM version | Notes |
|------------------------|-------------|-------|
| v0.1.x | **v0.13.0** (vllm-corex) | BV150 recommended version |
| latest (main) | v0.18.1 / v0.20.2 | Primarily designed for NVIDIA |

**BV150 must use v0.13.0 series vllm-corex.**

### Docker image recommendations

```bash
# FlagTree Iluvatar image
docker pull harbor.baai.ac.cn/flagtree/flagtree-iluvatar-py312-torch2.7.1-4.4.0release:latest

# FlagGems Iluvatar test image
docker pull harbor.baai.ac.cn/flaggems/iluvatar-flaggems-test-bi-v150:latest
```
