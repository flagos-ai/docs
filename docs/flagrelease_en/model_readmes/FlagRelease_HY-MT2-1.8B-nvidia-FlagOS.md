---
base_model:
- ""
---
# Introduction
Hy-MT2 is a multilingual translation model series open-sourced by Tencent Hunyuan. It includes three sizes — Hy-MT2-1.8B, Hy-MT2-7B, and Hy-MT2-30B-A3B — all supporting translation across 33 languages and 5 Chinese ethnic minority / dialect translation pairs. The 30B-A3B uses a MoE architecture (30B total parameters / 3B activated), while the 1.8B and 7B are dense models. Compared to the previous generation Hy-MT1.5, MT2 brings improvements in domain-specific translation, instruction following, and on-device deployment:

The 7B and 30B-A3B achieve 96.9% and 98.1% of Gemini 2.5 Pro's performance respectively on the FLORES-200 general translation benchmark, surpassing open-source models such as DeepSeek-V4-Pro and Kimi K2.6; the 1.8B outperforms leading commercial translation APIs overall.
The 30B-A3B achieves a GEMBA score of 99.0% of Gemini 2.5 Pro's on the DomainMTBench benchmark across vertical domains including finance, politics, and education.
Supports translation instructions such as glossary/terminology control, style transformation, and structured output (HTML/JSON), with instruction-following capability exceeding open-source models of the same size.
The 1.8B offers a 1.25-bit quantized version based on the Sherry framework, requiring only ~440 MB of storage, enabling local inference on mobile chips from Apple, Qualcomm, MediaTek, and others.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Nvidia** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics(chrf)      | HY-MT2-1.8B-Nvidia-Origin | HY-MT2-1.8B-Nvidia-FlagOS |
|--------------|---------------------------|---------------------------|
| flores_ca | 45.32 | 45.32 |
| wmt16 | 57.2 | 57.22 |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | 29.4.3 |
| Operating System | Ubuntu 24.04.4 LTS (Noble Numbat) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-hy-mt2-1.8b-nvidia-tree_0.5.0_3.5-gems_5.0.1rc0-vllm_0.20.2-plugin_0.0.0-cx_none-python_3.12.3-torch_2.11.0-pcp_cuda13.2-gpu_nvidia003-arc_amd64-driver_570.158.01:202605191822
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/HY-MT2-1.8B-nvidia-FlagOS --local_dir /data/HY-MT2-1.8B
```

### Start the Container
```bash
docker run --init --detach --net=host --uts=host --ipc=host --security-opt=seccomp=unconfined --privileged=true --ulimit stack=67108864 --ulimit memlock=-1 --ulimit nofile=1048576:1048576 --shm-size=32G -v /data:/data --gpus all --name flagos harbor.baai.ac.cn/flagrelease-public/flagrelease-hy-mt2-1.8b-nvidia-tree_0.5.0_3.5-gems_5.0.1rc0-vllm_0.20.2-plugin_0.0.0-cx_none-python_3.12.3-torch_2.11.0-pcp_cuda13.2-gpu_nvidia003-arc_amd64-driver_570.158.01:202605191822 sleep infinity
docker exec -it flagos /bin/bash
```
### Start the Server
```bash
vllm serve /data/HY-MT2-1.8B \
--host 0.0.0.0 --port 8000 \
--tensor-parallel-size 1 \
--served-model-name flagOS \
--enforce-eager
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "flagOS",
    "messages": [{"role": "user", "content": "你好"}]
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
**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a "develop once, run anywhere" workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of \<chip + open-source model\>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.
## FlagGems
FlagGems is a high-performance, generic operator library implemented in [Triton](https://github.com/openai/triton) language. It is built on a collection of backend-neutral kernels that aims to accelerate LLM (Large-Language Models) training and inference across diverse hardware platforms.
## FlagTree
FlagTree is an open source, unified compiler for multiple AI chips project dedicated to developing a diverse ecosystem of AI chip compilers and related tooling platforms, thereby fostering and strengthening the upstream and downstream Triton ecosystem. Currently in its initial phase, the project aims to maintain compatibility with existing adaptation solutions while unifying the codebase to rapidly implement single-repository multi-backend support. For upstream model users, it provides unified compilation capabilities across multiple backends; for downstream chip manufacturers, it offers examples of Triton ecosystem integration.
## FlagScale and vllm-plugin-fl
Flagscale is a comprehensive toolkit designed to support the entire lifecycle of large models. It builds on the strengths of several prominent open-source projects, including [Megatron-LM](https://github.com/NVIDIA/Megatron-LM) and [vLLM](https://github.com/vllm-project/vllm), to provide a robust, end-to-end solution for managing and scaling large models.
vllm-plugin-fl is a vLLM plugin built on the FlagOS unified multi-chip backend, to help flagscale support multi-chip on vllm framework.
## **FlagCX**
FlagCX is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.

## **FlagEval Evaluation Framework**
 FlagEval is a comprehensive evaluation system and open platform for large models launched in 2023. It aims to establish scientific, fair, and open benchmarks, methodologies, and tools to help researchers assess model and training algorithm performance. It features:
 - **Multi-dimensional Evaluation**: Supports 800+ model evaluations across NLP, CV, Audio, and Multimodal fields, covering 20+ downstream tasks including language understanding and image-text generation.
 - **Industry-Grade Use Cases**: Has completed horizontal evaluations of mainstream large models, providing authoritative benchmarks for chip-model performance validation.

# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support
# License
The model weights are derived from Tencent-Hunyuan/HY-MT2-1.8B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt


