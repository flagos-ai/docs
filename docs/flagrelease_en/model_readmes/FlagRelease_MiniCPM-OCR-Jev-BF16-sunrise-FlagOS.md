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
- Released **FlagOS-Sunrise** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniCPM-OCR-Jev-Nvidia-Origin | MiniCPM-OCR-Jev-Sunrise-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| ocr_rm_mini(12 entries) avg_prob_1 | 0.4817                         | 0.48242                              |
| omnidocbench-render-compare(60 entries) avg_prob_1 | 0.2397                         | 0.24171                              |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 28.5.1 |
| Operating System | 22.04.5 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/jev-value-sunrise001-gems0.0-tree0.6.0-cxnone-plugin0.0.0-vllm0.24.0-sglangnone-sglangflnone-cp310-ptpu0.2.3-tang0.25.0-x64-0.25.0:202610271048

```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-OCR-Jev-BF16-sunrise-FlagOS --local_dir /data/MiniCPM-OCR-Jev
```

### Start the Container
```bash
docker run -d \
  --name jev-release-digest-20261027 \
  --network host \
  --ipc host \
  --security-opt label=disable \
  --device /dev/ptpu3 \
  --device /dev/ptpuctrl \
  --mount type=bind,src=/data/adaptation/jev-value/vllm/sunrise/jev-tp1-20261025/reference/rm_hf_infer_demo_v1_20261015_with_ckpt/qwen35_2b_l2_triple_value_checkpoint-3000,dst=/models/jev-value,readonly,bind-propagation=rprivate \
  --mount type=bind,src=/usr/local/tangrt,dst=/usr/local/tangrt,readonly,bind-propagation=rprivate \
  --mount type=bind,src=/usr/local/pccl,dst=/usr/local/pccl,readonly,bind-propagation=rprivate \
  -v /data:/data \
  -v /data/adaptation/jev-value/vllm/sunrise/release-20261027/digest-cold/logs:/logs:rprivate \
  -v /data/adaptation/jev-value/vllm/sunrise/release-20261027/digest-cold/cache:/cache:rprivate \
  harbor.baai.ac.cn/flagrelease-public/jev-value-sunrise001-gems0.0-tree0.6.0-cxnone-plugin0.0.0-vllm0.24.0-sglangnone-sglangflnone-cp310-ptpu0.2.3-tang0.25.0-x64-0.25.0:202610271048 \
  sleep infinity
```
### Start the Server
```bash
set -euo pipefail
export TANG_VISIBLE_DEVICES=3
unset PYTHONPATH
export VLLM_PLUGINS=fl
export VLLM_FL_PREFER_ENABLED=True VLLM_FL_PREFER=flagos
export VLLM_FL_FLAGOS_BLACKLIST_APPEND=linear,broadcast_to,index,empty,sort,sort_stable
export VLLM_FL_SUNRISE_GDN_BV8=1
export BATCH_INVARIANT=0 VLLM_BATCH_INVARIANT=0
export VLLM_FL_SUNRISE_SAFE_VISION_SDPA=1
export VLLM_FL_SUNRISE_OCR_VISION_OUTPUT_ONLY=1
export VLLM_FL_SUNRISE_SAFE_FLASH_VLLM=1
export VLLM_FL_SUNRISE_OCR_TO_COPY_1D=0
export VLLM_USE_FLASHINFER_SAMPLER=0
export FLAGGEMS_CACHE_DIR=/cache/flaggems TRITON_CACHE_DIR=/cache/triton
export HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1
export OMP_NUM_THREADS=8 MKL_NUM_THREADS=8 OPENBLAS_NUM_THREADS=8
mkdir -p "$FLAGGEMS_CACHE_DIR" "$TRITON_CACHE_DIR"
export FLAGGEMS_ENABLE_OPLIST_PATH=/logs/flaggems.log
export LIBRARY_PATH=/usr/local/tangrt/targets/linux-x86_64/lib
export LD_LIBRARY_PATH=/usr/local/tangrt/targets/linux-x86_64/lib:/usr/local/tangrt/lib/linux-x86_64:/usr/local/pccl/lib
cd /tmp
export JEV_CPU_POSITION_INTERPOLATION=hf5104
export JEV_TOKEN_CLASSIFY_LAST=1
export JEV_SCORE_BEFORE_POOLING=0
nohup /flagos/bin/python -m jev_value_runtime.server --mm-processor-kwargs '{"size":{"shortest_edge":65536,"longest_edge":16777216}}' > /logs/server.log 2>&1 < /dev/null &
/flagos/bin/python - <<'WAIT'
import json,time,urllib.request
op=urllib.request.build_opener(urllib.request.ProxyHandler({}));deadline=time.monotonic()+900
while time.monotonic()<deadline:
    try:
        with op.open('http://127.0.0.1:18510/health',timeout=3) as r:
            info=json.load(r)
            assert info['status']=='ready' and info['model']=='jev-value'
            print('JEV_HTTP_READY');break
    except (OSError,ValueError,AssertionError):time.sleep(5)
else:raise SystemExit('900s startup timeout; inspect /logs/server.log; no automatic restart')
WAIT
```

## Service Invocation
### Invocation Script
```bash
curl --noproxy "*" --fail-with-body --silent --show-error --max-time 300 \
  http://10.21.8.11:18510/score \
  -H 'Content-Type: application/json' \
  --data-raw '{"model":"jev-value","orig_image":"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","ocr_text":"FLAGOS JEV 12345","render_image":"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"}'
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
