---
license: apache-2.0
language:
- zh
- en
---

# Introduction
ModelBest, together with OpenBMB, has open-sourced the next-generation on-device multimodal large model MiniCPM-V4.7, releasing two variants at once: 1B and 35B-A3B (MoE). The Zhongzhi FlagOS community completed day-0 cross-chip adaptation covering 12 platforms — T-Head, NVIDIA, Huawei Ascend, Hygon, Kunlunxin, MetaX, Moore Threads, Tsingmicro, Iluvatar CoreX, Sunrise, Mac (M5 Pro), and CIX P1 — based on the FlagOS unified multi-chip software stack. Model images are now live on ModelScope and HuggingFace simultaneously. This adaptation extends both variants to ARM edge CPU platforms as well, enabling a viable deployment path for multimodal understanding on both data-center and end-user devices. The 35B-A3B model is the world’s first open-source MoE multimodal large model capable of lossless and smooth on-device operation, with 35B total parameters and approximately 3B activated parameters. Its core technology, Lookahead Expert Scheduling (LES), cuts on-device inference latency by preloading experts and performing computation and reading in parallel. According to official benchmarks, when paired with the on-device optimization scheme, the model achieves a generation speed of over 13 tokens per second on an iPhone 17 Pro Max. The model retains the early-compression-within-ViT technique and 4×/16× visual token compression, and supports DSpark speculative decoding to balance visual detail and inference efficiency. In official Instruct-mode evaluations, the 35B-A3B and 1B models attained higher overall scores than Qwen3.6-35B-A3B and Qwen3.5-0.8B respectively, with shorter inference time.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Tsingmicro** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniCPM-V-4.7-35B-A3B-Nvidia-Origin | MiniCPM-V-4.7-35B-A3B-Tsingmicro-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| Math_500     | 94.80                               | 94                                      |
| GPQA_Diamond | 81.31                               | 80.3                                    |
| ERQA         | 52.26                               | 51.75                                   |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 29.1.3 |
| Operating System | 22.04.4 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minicpm-v47-35b-a3b-tsingmicro001-gems5.4.0-tree0.7.0-cxnone-plugin0.2.2-vllm0.20.2-sglangnone-sglangflnone-cp310-pt211-raisa1.4.0-x64-v0.29842.5:202610120850

```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-V-4.7-35B-A3B-BF16-tsingmicro-FlagOS --local_dir /data/MiniCPM-V-4.7-35B-A3B
```

### Start the Container
```bash
docker run --privileged -dit --name minicpm-v47-35b-a3b --network host --ipc=host \
  -v /sys:/sys -v /dev:/dev -v /lib/modules:/lib/modules \
  -v /usr/local/kuiper/:/usr/local/kuiper/ -v /mnt/nvme_data:/mnt/nvme_data -v /data:/data \
  harbor.baai.ac.cn/flagrelease-public/minicpm-v47-35b-a3b-tsingmicro001-gems5.4.0-tree0.7.0-cxnone-plugin0.2.2-vllm0.20.2-sglangnone-sglangflnone-cp310-pt211-raisa1.4.0-x64-v0.29842.5:202610120850 /bin/bash

docker exec -it minicpm-v47-35b-a3b /bin/bash
```
### Start the Server
```bash
cd /home/MiniCPM-V-4.7-35B/script
source env.sh
bash server.sh
tail -f logs/*
```

## Service Invocation
### Invocation Script
```bash
curl -X POST http://127.0.0.1:9005/v1/completions -H "Content-Type:
  application/json" -d '{
  "model": "",
  "prompt": "中国的首都是哪里？",
  "max_tokens": 30,
  "temperature": 0.0
}'
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
The model weights are derived from OpenBMB/MiniCPM-V-4.7-35B-A3B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
