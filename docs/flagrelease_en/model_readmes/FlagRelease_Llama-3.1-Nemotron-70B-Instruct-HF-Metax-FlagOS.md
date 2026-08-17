# Introduction
Llama-3.1-Nemotron-70B-Instruct-HF is a large language model from NVIDIA, derived from Meta's Llama-3.1 architecture and tuned for instruction following and reasoning. This release ports the model to the FlagOS software stack on Metax accelerators, enabling out-of-the-box deployment without vendor-specific adaptation.

> **Note (Experimental Release):** On this hardware/software combination the FlagOS build shows an accuracy gap versus the native stack (GPQA_Diamond 44.0 vs 52.0, a 15.4% relative drop) that exceeds the ≤5% alignment threshold. This release is provided as an **experimental** artifact for evaluation and further operator tuning; it is **not** a consistency-validated release. Use with awareness of the accuracy gap.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Metax** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.


# Evaluation Results
## Benchmark Result
| Metrics      | Llama-3.1-Nemotron-70B-Instruct-HF-Metax-FlagOS-Origin | Llama-3.1-Nemotron-70B-Instruct-HF-Metax-FlagOS-FlagOS |
|--------------|----------------------------------------------------------|----------------------------------------------------------|
| GPQA_Diamond | 52.0 | 44.0 |
| ERQA | - | - |
| Aime24 | - | - |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 24.0.7 |
| Operating System | Ubuntu 22.04.3 LTS |
| FlagGems | 5.0.2 |
| FlagTree | 0.5.1 |
| vLLM | Version: 0.20.2 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/llama-3.1-nemotron-70b-instruct-hf-metax001-gems5.0.2-tree0.5.1-cxnone-plugin0.2.0-vllm0.20.2-cp312-pt28-maca37-x64-3.3.12:202608121239-v2
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Llama-3.1-Nemotron-70B-Instruct-HF-Metax-FlagOS --local_dir /data/models/nvidia/Llama-3.1-Nemotron-70B-Instruct-HF
```

### Start the Container
```bash
docker run -d --name Llama-3.1-Nemotron-70B-Instruct-HF-flagos --net=host --ipc=host --privileged --shm-size=64g --group-add video --ulimit memlock=-1 --security-opt seccomp=unconfined --security-opt apparmor=unconfined --device=/dev/dri --device=/dev/mxcd -v /data/models/nvidia/Llama-3.1-Nemotron-70B-Instruct-HF:/data/models/nvidia/Llama-3.1-Nemotron-70B-Instruct-HF harbor.baai.ac.cn/flagrelease-public/llama-3.1-nemotron-70b-instruct-hf-metax001-gems5.0.2-tree0.5.1-cxnone-plugin0.2.0-vllm0.20.2-cp312-pt28-maca37-x64-3.3.12:202608121239-v2 sleep infinity
```
### Start the Server
```bash
VLLM_PLUGINS=fl vllm serve /data/models/nvidia/Llama-3.1-Nemotron-70B-Instruct-HF --host 0.0.0.0 --port 8000 --served-model-name Llama-3.1-Nemotron-70B-Instruct-HF --tensor-parallel-size 4 --max-model-len 32768 --trust-remote-code
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Llama-3.1-Nemotron-70B-Instruct-HF",
    "messages": [{"role": "user", "content": "Explain the basics of quantum computing"}]
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
The model weights are derived from nvidia/Llama-3.1-Nemotron-70B-Instruct-HF and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
