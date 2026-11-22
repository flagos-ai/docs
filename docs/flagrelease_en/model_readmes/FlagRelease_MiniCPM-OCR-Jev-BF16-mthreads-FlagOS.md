---
license: apache-2.0
language:
- zh
- en
---

# Introduction
ModelBest, together with OpenBMB, has open-sourced the MiniCPM-OCR series for document parsing and text recognition, comprising two models: MiniCPM-OCR 1.0 (1.3B) and MiniCPM-OCR Jev (2B). Built on a unified multi-chip software stack, the FlagOS community provides Day-0 cross-chip adaptation for both models, covering 12 platforms in total: T-Head, NVIDIA, Huawei Ascend, Hygon, KUNLUNXIN, MetaX, Moore Threads, Tsingmicro, Iluvatar CoreX, Xiwang, Mac (ARM), and CIX. In this round of evaluation, the FlagOS build of Jev reached 98.7% of NVIDIA native compute throughput, while on the same platform OCR 1.0 delivered up to 1.69× native P50 throughput per unit of peak compute. On ARM edge devices, Jev completes a page-block assessment in an average of 1.20 seconds using the M5 CPU alone. Backed by FlagOS support for both multi-chip servers and ARM terminals, industry users can pick a document parsing and quality-inspection deployment that matches their business requirements and existing compute resources.

MiniCPM-OCR 1.0 targets real-world document scenarios — scans, photos, curved pages, and re-photographed screens — with support for text, formula, and complex table parsing as well as key information extraction. In official evaluations, this lightweight 1.3B-parameter model scored 93.68 on Real5-OmniDocBench, and with DSpark decoding acceleration its end-to-end processing efficiency improved by 55%. To address the problem that parsed output still needs manual verification, the 2B-parameter MiniCPM-OCR Jev acts as an "AI quality inspector" for documents: it scores the reliability of parsing results and can be plugged into different OCR models to help flag content that requires human review. Its overall AUROC on JevOCRBench reaches 0.936, close to the 0.938 of Qwen3.5-397B-A17B.


### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniCPM-OCR-Jev-Nvidia-Origin | MiniCPM-OCR-Jev-Mthreads-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| ocr_rm_mini(12 entries) avg_prob_1 | 0.4817                         | 0.4820                               |
| omnidocbench-render-compare(60 entries) avg_prob_1 | 0.2397                         | 0.241336                             |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 29.3.1 |
| Operating System | 22.04.5 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/jev-value-mthreads001-gems5.4.0-tree0.7.0-cx0.14.0-pluginnone-vllmnone-sglangnone-sglangflnone-cp310-pt210-musa52-x64-3.3.5-server:202610271059
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-OCR-Jev-BF16-mthreads-FlagOS --local_dir /models/jev-value
```

### Start the Container
```bash
docker run -d \
  --name jev-value-release-tp1-20261027 \
  --runtime mthreads \
  --network host \
  --ipc host \
  --security-opt label=disable \
  --ulimit memlock=-1 \
  --ulimit stack=67108864 \
  -e MTHREADS_VISIBLE_DEVICES=2 \
  -e MTHREADS_DRIVER_CAPABILITIES=all \
  -e MUSA_VISIBLE_DEVICES=0 \
  --mount type=bind,src=/data/adaptation/jev/sglang/mthreads_s5000/20261019-tp1/unpacked/rm_hf_infer_demo_v1_20261015_with_ckpt/qwen35_2b_l2_triple_value_checkpoint-3000,dst=/models/jev-value,readonly,bind-propagation=rprivate \
  -v /data:/data \
  -v /data/adaptation/jev-value/torch_fl/mthreads_s5000/20261027-release/digest/logs:/var/log/jev \
  -v /data/adaptation/jev-value/torch_fl/mthreads_s5000/20261027-release/digest/cache:/var/cache/jev \
  --entrypoint /bin/bash \
  harbor.baai.ac.cn/flagrelease-public/jev-value-mthreads001-gems5.4.0-tree0.7.0-cx0.14.0-pluginnone-vllmnone-sglangnone-sglangflnone-cp310-pt210-musa52-x64-3.3.5-server:202610271059 \
  -lc 'exec sleep infinity'
```
### Start the Server
```bash
export PATH=/opt/jev/venv/bin:/opt/musa-5.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export FLAGOS_STARTUP_PROFILE=minimal TORCH_DEVICE_BACKEND_AUTOLOAD=0 MUSA_VISIBLE_DEVICES=0
export MUSA_HOME=/opt/musa-5.2 MUSA_PATH=/opt/musa-5.2
export LD_LIBRARY_PATH=/opt/jev/venv/lib/python3.10/site-packages/torch_fl/lib:/opt/musa-5.2/lib
export FLAGGEMS_CACHE_DIR=/var/cache/jev/flaggems PYTHONPYCACHEPREFIX=/var/cache/jev/pycache
export TMPDIR=/var/cache/jev/tmp
mkdir -p /var/cache/jev/tmp
export XDG_CACHE_HOME=/var/cache/jev TORCH_HOME=/var/cache/jev/torch
export TORCHINDUCTOR_CACHE_DIR=/var/cache/jev/inductor TRITON_CACHE_DIR=/var/cache/jev/triton
export HF_HOME=/var/cache/jev/huggingface HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1
export FLAGOS_LOG=fallback FLAGOS_MUSA_ASYNC_MUDNN=1
export JEV_FUSED_NORM=0 JEV_SDPA_BF16_MATH=0 JEV_CAPTURE_FUSED_NORM=0 JEV_FASTPATH=1
export JEV_CAPTURE_KERNELS=0 JEV_VISION_FP32_ACCUM=1 JEV_COMPILED_PLAIN=0
export OMP_NUM_THREADS=8 MKL_NUM_THREADS=8 OPENBLAS_NUM_THREADS=8
unset PYTHONPATH FLAGOS_OP_mm FLAGOS_OP_bmm FLAGOS_FORCE_BACKEND FLAGOS_BACKEND_CONFIG FLAGOS_OP_add__Tensor FLAGOS_OP_mul__Tensor
cd /opt/jev
/opt/jev/venv/bin/python -u -m serve_value --checkpoint /models/jev-value --host 0.0.0.0 --port 18510 --max-token-len 12000 > /var/log/jev/server.log 2>&1 &
JEV_PID=$!
/opt/jev/venv/bin/python - "$JEV_PID" <<'PY'
import json,sys,time,urllib.request
from pathlib import Path
pid=int(sys.argv[1]);deadline=time.monotonic()+300
while time.monotonic()<deadline:
    if not Path(f'/proc/{pid}').exists():
        raise SystemExit('Service exited; inspect /var/log/jev/server.log')
    try:
        with urllib.request.urlopen('http://127.0.0.1:18510/health',timeout=3) as r:
            result=json.load(r)
        if result['status']=='ready' and result['model']=='jev-value':
            print(json.dumps(result));break
    except (OSError,ValueError):pass
    time.sleep(2)
else:raise SystemExit('Readiness exceeded 300 seconds; inspect /var/log/jev/server.log')
PY
```

## Service Invocation
### Invocation Script
```bash
curl --fail-with-body --silent --show-error \
  --connect-timeout 5 --max-time 300 \
  http://127.0.0.1:18510/score \
  -H 'Content-Type: application/json' \
  --data-binary @/data/adaptation/jev-value/torch_fl/mthreads_s5000/20261027-release/request-s01.json

```


### AnythingLLM Integration Guide

#### 1. Download & Install

- Visit the official site: https://anythingllm.com/
- Choose the appropriate version for your OS (Windows/macOS/Linux)
- Follow the installation wizard to complete the setup

#### 2. Configuration

- Launch AnythingLLM
- Open settings (bottom left, fourth tab)
- Configure core LLM parameters
- Click "Save Settings" to apply changes

#### 3. Model Interaction

- After model loading is complete:
- Click **"New Conversation"**
- Enter your question (e.g., "Explain the basics of quantum computing")
- Click the send button to get a response
# Technical Overview
**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a "develop once, run anywhere" workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of <chip + open-source model>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.
## FlagGems
FlagGems is a high-performance, generic operator libraryimplemented in [Triton](https://github.com/openai/triton) language. It is built on a collection of backend-neutralkernels that aims to accelerate LLM (Large-Language Models) training and inference across diverse hardware platforms.
## FlagTree
FlagTree is an open source, unified compiler for multipleAI chips project dedicated to developing a diverse ecosystem of AI chip compilers and related tooling platforms, thereby fostering and strengthening the upstream and downstream Triton ecosystem. Currently in its initial phase, the project aims to maintain compatibility with existing adaptation solutions while unifying the codebase to rapidly implement single-repository multi-backend support. Forupstream model users, it provides unified compilation capabilities across multiple backends; for downstream chip manufacturers, it offers examples of Triton ecosystem integration.
## FlagScale and vllm-plugin-fl
Flagscale is a comprehensive toolkit designed to supportthe entire lifecycle of large models. It builds on the strengths of several prominent open-source projects, including [Megatron-LM](https://github.com/NVIDIA/Megatron-LM) and [vLLM](https://github.com/vllm-project/vllm), to provide a robust, end-to-end solution for managing and scaling large models.
vllm-plugin-fl is a vLLM plugin built on the FlagOS unified multi-chip backend, to help flagscale support multi-chip on vllm framework.
## **FlagCX**
FlagCX is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.

## **FlagEval Evaluation Framework**
 FlagEval is a comprehensive evaluation system and open platform for large models launched in 2023. It aims to establish scientific, fair, and open benchmarks, methodologies, and tools to help researchers assess model and training algorithm performance. It features:
 - **Multi-dimensional Evaluation**: Supports 800+ modelevaluations across NLP, CV, Audio, and Multimodal fields,covering 20+ downstream tasks including language understanding and image-text generation.
 - **Industry-Grade Use Cases**: Has completed horizonta1 evaluations of mainstream large models, providing authoritative benchmarks for chip-model performance validation.

# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support
# License
The model weights are derived from OpenBMB/MiniCPM-OCR-Jev and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
