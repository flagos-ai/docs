---
frameworks:
- ""
language:
- zh
- en
license: apache-2.0
tasks: []
---
# Introduction

**Moonlight-16B-A3B** is a high-performance large language model released by Moonshot AI, built on a Mixture of Experts (MoE) architecture. The model leverages an advanced MoE design that significantly expands model capacity while maintaining efficient inference performance. Moonlight-16B-A3B delivers strong results across a wide range of natural language processing tasks, including text generation, code understanding, mathematical reasoning, and knowledge-based question answering, making it a powerful foundation model for both academic research and industrial applications.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Nvidia** container image supporting deployment within minutes

### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Task                | Moonlight-16B-A3B-Nvidia-Origin | Moonlight-16B-A3B-Nvidia-FlagOS |
| ------------------- | -------------------- | -------------------- |
| aime                | 0.0000               | 0.0000               |
| gpqa_generative_cot | 0.1384               | 0.1367               |
| LiveBench New       | 0.0475               | 0.0495               |
| musr_generative     | 0.0159               | 0.0066               |
| mmlu_pro            | 0.1986               | 0.2008               |

# User Guide

## Environment Setup

| Item             | Version                              |
|------------------|--------------------------------------|
| Docker Version   | Docker version 24.0.0, build 98fdcd7 |
| Operating System | Ubuntu 22.04.4 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/external-cooperation/moonlight-16b-a3b-nvidia-tree_0.5.0_3.5-gems_5.0.2-vllm_0.13.0-plugin_0.1-cx_none-python_3.12.3-torch_2.9.0_cu128-pcp_cuda12.8-gpu_nvidia003-arc_amd64-driver_570.133.20:2606031430
```

### Download Open-source Model Weights
```bash
pip install modelscope

modelscope download \
  --model FlagRelease/Moonlight-16B-A3B-nvidia-FlagOS \
  --local_dir /data/Moonlight-16B-A3B-nvidia-FlagOS
```

### Start the Container
```bash
docker run -itd \
  --name flagos \
  --gpus all \
  --ipc=host \
  --ulimit memlock=-1 \
  --ulimit stack=67108864 \
  --network host \
  -v /data/Moonlight-16B-A3B-nvidia-FlagOS:/data/Moonlight-16B-A3B-nvidia-FlagOS \
  harbor.baai.ac.cn/external-cooperation/moonlight-16b-a3b-nvidia-tree_0.5.0_3.5-gems_5.0.2-vllm_0.13.0-plugin_0.1-cx_none-python_3.12.3-torch_2.9.0_cu128-pcp_cuda12.8-gpu_nvidia003-arc_amd64-driver_570.133.20:2606031430
```

### Enter the Container
```bash
docker exec -it flagos /bin/bash
```

### Start the Server
Inside the container:
```bash
#建议按实际卡号调整
export VLLM_PLUGINS=fl
export TRITON_ALL_BLOCKS_PARALLEL=1
export USE_FLAGGEMS=1
VLLM_USE_MODELSCOPE=true CUDA_VISIBLE_DEVICES=3,4 nohup vllm serve \
    /data/Moonlight-16B-A3B-nvidia-FlagOS \
    --served-model-name moonlight-16b-a3b-flagos \
    --port 8003 \
    --trust-remote-code \
    --max-model-len 8192 \
    --gpu-memory-utilization 0.95 \
    --tensor-parallel-size 2 \
    > /workspace/flagos_server.log 2>&1 &
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8003/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "moonlight-16b-a3b-flagos",
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
**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a "develop once, run anywhere" workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads.

With core technologies such as **FlagScale**, together with **vllm-plugin-fl** (distributed training/inference framework), **FlagGems** (universal operator library), **FlagCX** (communication library), and **FlagTree** (unified compiler), the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of `<chip + open-source model>`. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.

## FlagGems
FlagGems is a high-performance, generic operator library implemented in [Triton](https://github.com/openai/triton) language. It is built on a collection of backend-neutral kernels that aims to accelerate LLM training and inference across diverse hardware platforms.

## FlagTree
FlagTree is an open-source, unified compiler for multiple AI chips. It provides unified compilation capabilities across multiple backends and rapidly implements single-repository multi-backend support.

## FlagScale and vllm-plugin-fl
**FlagScale** is a comprehensive toolkit designed to support the entire lifecycle of large models. It builds on the strengths of several prominent open-source projects, including [Megatron-LM](https://github.com/NVIDIA/Megatron-LM) and [vLLM](https://github.com/vllm-project/vllm), to provide a robust, end-to-end solution for managing and scaling large models.

**vllm-plugin-fl** is a vLLM plugin built on the FlagOS unified multi-chip backend, to help FlagScale support multi-chip on the vLLM framework.

## FlagCX
**FlagCX** is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.

## FlagEval Evaluation Framework
**FlagEval** is a comprehensive evaluation system and open platform for large models launched in 2023. It aims to establish scientific, fair, and open benchmarks, methodologies, and tools to help researchers assess model and training algorithm performance. It features:
- **Multi-dimensional Evaluation**: Supports 800+ model evaluations across NLP, CV, Audio, and Multimodal fields, covering 20+ downstream tasks including language understanding and image-text generation.
- **Industry-Grade Use Cases**: Has completed horizontal evaluations of mainstream large models, providing authoritative benchmarks for chip-model performance validation.

# Contributing
We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support

# License
The model weights are derived from moonshotai/Moonlight-16B-A3B and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

