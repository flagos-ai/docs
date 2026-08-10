---
language:
- zh
- en
license: apache-2.0
---

# Introduction
The first open-weight release of Qwen3.6 is now available. Building on the Qwen3.5 series released in February and shaped by direct community feedback, Qwen3.6 prioritizes stability and real-world utility to deliver a more intuitive, responsive, and productive coding experience. Key improvements include enhanced agentic coding capabilities for frontend workflows and repository-level reasoning, along with a new thinking preservation option that retains reasoning context from historical messages to streamline iterative development.


### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Metax** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | Qwen3.6-27B-Nvidia-Origin | Qwen3.6-27B-Metax-FlagOS |
|--------------|---------------------------|--------------------------|
| GPQA_Diamond | 85.86                     | 84.34                   |
| ERQA         | 59.25                        | 58.25                     |

## Performance Benchmark Result
|Metric|	1k&1k 64 Concurrency|	4k&1k 64 Concurrency|	16k&1k 64 Concurrency|64k&1k 64 Concurrency|
|--------------|---------------------------|--------------------------|---|---|
|Equal Computing Power Ratio (flagos/H100)|	96.35%	|97.36%|	83.33%|90.31%|

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 27.5.1, build 27.5.1-0ubuntu3~22.04.2 |
| Operating System | Ubuntu 22.04.5 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/qwen3.6-27b-metax001-gems5.4.0-tree0.5.1-cxnone-plugin0.2.0-vllm0.20.2-cp312-pt28-maca37-x64-3.8.1:202607220155
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.6-27B-metax-FlagOS-Express --local_dir /data/Qwen3.6-27B
```

### Start the Container
```bash
docker run -itd \
    --name flagos \
    --privileged \
    --network=host \
    --security-opt seccomp=unconfined \
    --security-opt apparmor=unconfined \
    --shm-size '100gb' \
     --ulimit memlock=-1 \
     --group-add video \
     --device=/dev/dri \
     --device=/dev/mxcd \
     --device=/dev/mem \
     --device=/dev/infiniband \
     -v /usr/local/:/usr/local/ \
     -v /data/:/data/ \
    harbor.baai.ac.cn/flagrelease-public/qwen3.6-27b-metax001-gems5.4.0-tree0.5.1-cxnone-plugin0.2.0-vllm0.20.2-cp312-pt28-maca37-x64-3.8.1:202607220155 \
    /bin/bash
docker exec -it flagos /bin/bash
```
### Start the Server
```bash
export FLAGGEMS_VENDOR=metax
export CUDA_VISIBLE_DEVICES=6,7
export VLLM_FL_FLAGOS_WHITELIST=cat,cos,cumsum,fill,full,gather,gt,le,lt,max,mul,sin,softmax,to,where,zeros,zeros_like
export VLLM020_CONTIGUOUS_SINGLE_PREFILL=1
vllm serve  /data/Qwen3.6-27B \
    --tensor-parallel-size 2 --port 8000 --trust-remote-code --dtype bfloat16 \
    --served-model-name qwen36-27b \
    --max-num-batched-tokens 16384
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "qwen36-27b",
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
The model weights are derived from Qwen/Qwen3.6-27B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

