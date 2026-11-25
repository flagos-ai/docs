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
- Released **FlagOS-Tsingmicro** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniCPM-OCR-1.0-Nvidia-Origin | MiniCPM-OCR-1.0-Tsingmicro-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| OcrBench     | 80.5                           | 77.1                                 |
| omni_doc_bench_v1_6 | 96.4585                        | Evaluating                           |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 29.1.3 |
| Operating System | 22.04.4 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minicpm-ocr-1.0-tsingmicro001-gems5.4.0-treenone-cx0.1.0-plugin0.0.0-vllm0.24.0-sglangnone-sglangflnone-cp310-pt211-raisa1.4.0-x64-v0.30279.6:202610260708
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-OCR-1.0-tsingmicro-FlagOS --local_dir /data/MiniCPM-OCR-1.0
```

### Start the Container
```bash
docker run --privileged -dit --name tsingmicro-minicpm-ocr-test
--network host --ipc=host -v /sys:/sys -v /dev:/dev -v /lib/modules:/lib/modules
-v /usr/local/kuiper/:/usr/local/kuiper/ -v /mnt/nvme_data:/mnt/nvme_data harbor.baai.ac.cn/flagrelease-public/minicpm-ocr-1.0-tsingmicro001-gems5.4.0-treenone-cx0.1.0-plugin0.0.0-vllm0.24.0-sglangnone-sglangflnone-cp310-pt211-raisa1.4.0-x64-v0.30279.6:202610260708 /bin/bash
```
### Start the Server
```bash
cd /home/qwen_env
source env_ocr.sh
bash server_dp.sh
tail -f logs/*
```

## Service Invocation
### Invocation Script
```bash
python3 -c "import base64,json;json.dump({'model':'/home/qwen_env/models/merge_rl_mergedp1_7140_hf5_4x','messages':[{'role':'user','content':[{'type':'image_url','image_url':{'url':'data:image/png;base64,'+base64.b64encode(open('/home/qwen_env/dog.png','rb').read()).decode()}},{'type':'text','text':\"What's in this picture?\"}]}],'temperature':0,'max_tokens':25},open('/tmp/req.json','w'))" && curl -s http://10.1.15.137:9001/v1/chat/completions -H 'Content-Type: application/json' -d @/tmp/req.json | python3 -m json.tool
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
The model weights are derived from OpenBMB/MiniCPM-OCR-1.0 and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
