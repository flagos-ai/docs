---
base_model:
- ""
language:
- zh
- en
license: apache-2.0
---

# Introduction
BAAI-Cardiac-Agent is an intelligent cardiac MRI analysis system developed by the Beijing Academy of Artificial Intelligence (BAAI). It adopts an Agent-Expert architecture: a multimodal Agent built on a fine-tuned LLaVA model serves as the core for task understanding and scheduling, while multiple specialized deep learning models act as Expert Workers to carry out specific analyses. The system supports DICOM/NIfTI image input and automates the full pipeline including cardiac sequence identification, structural segmentation, disease screening (three categories), cardiomyopathy subtype classification (five subtypes), cardiac quantitative metric calculation, and PDF report generation.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Hygon** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	

# Evaluation Results

## Benchmark Result
Overall Functions: Passed  

Sub-functions: All consistency metrics passed  

Diagnosis: The two are consistent  


| Metrics      | BAAI-Cardiac-Agent-Nvidia-Origin | BAAI-Cardiac-Agent-Hygon-FlagOS |
|--------------|--------------------------------------|--------------------------------------|
| LVEF | 31.7 | 31.7 |
| LVEDV |155.5  | 155.5 |
| LVESV | 106.1 | 106.1 |
| SV | 49.4  | 49.4 |
|  LVM  | 157.2   | 157.2   |
| LVEDD  | 49.2  |  49.2 | 

 

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 28.2.2, build 28.2.2-0ubuntu1~22.04.1 |
| Operating System | Ubuntu 22.04.4 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/cardiac-agent-hygon:2026052515
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/BAAI-Cardiac-Agent-hygon-FlagOS --local_dir /data/BAAI-Cardiac-Agent
```

### Start the Container
```bash
docker run -itd --name flagos --network host --ipc host --privileged --shm-size=32g -v /data:/data harbor.baai.ac.cn/flagrelease-public/cardiac-agent-hygon:2026052515 /bin/bash
docker exec -it flagos /bin/bash
```

## Service Invocation
### Invocation Script
```bash
cd /workspace/Cardiac-Agent && bash app/start_hygon.sh full
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
- Enter your question (e.g., “Explain the basics of quantum computing”)
- Click the send button to get a response
# Technical Overview
**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a “develop once, run anywhere” workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of \<chip + open-source model\>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.
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
The model weights are derived from TaipingQu/BAAI-Cardiac-Agent and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

