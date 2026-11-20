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
- Released **FlagOS-Nvidia** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniCPM-OCR-Jev-Nvidia-Origin | MiniCPM-OCR-Jev-Nvidia-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| ocr_rm_mini(12 entries) avg_prob_1 | 0.4817                         | 0.4817                               |
| omnidocbench-render-compare(60 entries) avg_prob_1 | 0.2397                         | 0.2397                               |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 24.0.0 |
| Operating System | 22.04.4 LTS |
| Python | 3.12.3, virtual environment at `/opt/torch-fl-venv` |
| PyTorch | `torch 2.10.0+cpu` — this is a CPU build; the CUDA kernels are loaded from `torch_fl/lib/libtorch_cuda.so`, `torch_fl/lib/libtorch_cuda_linalg.so` and `torch_fl/lib/libc10_cuda.so` through `LD_PRELOAD` |
| torch_fl | Source checkout at `/opt/fl-src/PyTorch-Plugin-FL` (on `PYTHONPATH`); PrivateUse1 device named `flagos`; boxing build with `KERNELS = ('boxing', 'flaggems', 'tileops', 'vendor')`; backend conf `backends_nvidia.conf` (FlagGems-primary) |
| flag_gems | 5.4.0 |
| flagtree | 0.7.0 |
| flagcx | 0.14.0rc2.post2+cuda13.3 |
| transformers | installed in the venv (no separate pin recorded) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/qwen3-5-2b-jev-nvidia003-gems5.4.0-tree0.7.0-cx0.14.0-pluginnone-vllmnone-sglangnone-sglangflnone-cp312-pt210-cu131-x64-580.126.20:202610270750
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-OCR-Jev-BF16-nvidia-FlagOS --local_dir /data/jev/qwen35_2b_l2_triple_value_checkpoint-3000
```

### Start the Container
```bash
docker run -dit --name flagos-jev-nvidia --privileged --network host --ipc=host --shm-size=16g --gpus all  -v /data:/data  --mount type=bind,src=/data/jev/qwen35_2b_l2_triple_value_checkpoint-3000,dst=/models/jev/qwen35_2b_l2_triple_value_checkpoint-3000,readonly harbor.baai.ac.cn/flagrelease-public/qwen3-5-2b-jev-nvidia003-gems5.4.0-tree0.7.0-cx0.14.0-pluginnone-vllmnone-sglangnone-sglangflnone-cp312-pt210-cu131-x64-580.126.20:202610270750 bash

docker exec -it flagos-jev-nvidia bash
```
### Start the Server
The service is started in the background, then the wait loop polls `/health` once every 3 seconds for up to 60 attempts (180 seconds) and finally prints the health document. Model load takes about 21-27 seconds on H100; if the loop times out, inspect the log at `/tmp/jev_service.log` rather than restarting blindly.
```bash
source /opt/torch-fl-env.sh
nohup /opt/torch-fl-venv/bin/python -m torch_fl.compat.jev_service --checkpoint /data/jev/qwen35_2b_l2_triple_value_checkpoint-3000 --device flagos:0 --host 0.0.0.0 --port 8000 > /tmp/jev_service.log 2>&1 &
for i in $(seq 1 60); do curl -sf -o /dev/null http://127.0.0.1:8000/health && break; sleep 3; done
curl -s http://127.0.0.1:8000/health
```

`GET /health` returns `{"status", "model", "device", "loaded"}`. When the
service is ready, `status` is `ok` and `loaded` is `true`.

## Service Invocation
### Invocation Script

Run on the **host** that runs the container (`--network host` is used, so the service listens on the host's own `127.0.0.1:8000`). Sample files are read from the host's `/data/jev/samples`.

```bash
curl -s -X POST http://127.0.0.1:8000/score \
  -F orig_image=@/data/jev/samples/images/s05_orig.png \
  -F render_image=@/data/jev/samples/images/s05_render.png \
  -F "ocr_text=<</data/jev/samples/texts/s05.txt"
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
