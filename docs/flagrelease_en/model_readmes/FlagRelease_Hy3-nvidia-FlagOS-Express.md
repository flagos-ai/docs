---
license: apache-2.0
language:
- zh
- en
---

# Introduction
Hy3 is Tencent Hunyuan team's next-generation MoE large model with integrated fast and slow thinking: 295B total parameters, 21B active parameters (plus 3.8B MTP layer parameters), 192 experts with top-8 activation, supporting 256K context. Compared to the Preview version released in late April, Hy3 has achieved a comprehensive leap in intelligence through incorporating real-world business feedback, scaling up RL compute, and improving post-training data quality, significantly outperforming open-source models of similar size.


### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Nvidia** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | Hy3-Nvidia-Origin | Hy3-Nvidia-FlagOS |
|--------------|--------------------------------|-------------------|
| GPQA_Diamond | 83.33                              | 85.86             |
| arc_challenge_chat        | 96.33                              | 95.99             |
| math_500 | 94.6                              | 93.6              |

## Performance Benchmark
| Test Scenario                          | 4k & 1k 64 Concurrent | 16k & 1k 64 Concurrent | 32k & 1k 64 Concurrent |
|----------------------------------------|-----------------------|------------------------|------------------------|
| Speedup Ratio (NV-flagos / NV-native)  | 107.19%               | 104.59%                | 103.23%                |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 24.0.0, build 98fdcd7 |
| Operating System | 22.04.4 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/hy3-nvidia003-gems5.4.0-tree0.6.0-cxnone-plugin0.2.0-vllm0.20.2-cp312-pt211-cu130-x64-580.95.05:202607021605
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Hy3-nvidia-FlagOS --local_dir /data/Hy3
```

### Start the Container
```bash
docker run -itd \
    --name flagos \
    --entrypoint /bin/bash \
    --gpus all \
    --ipc=host \
    --net host \
    --shm-size 512g \
    -v /data/:/data \
    harbor.baai.ac.cn/flagrelease-public/hy3-nvidia003-gems5.4.0-tree0.6.0-cxnone-plugin0.2.0-vllm0.20.2-cp312-pt211-cu130-x64-580.95.05:202607021605
docker exec -it flagos /bin/bash
```
### Start the Server
```bash
export VLLM_FL_FLAGOS_WHITELIST=invoke_fused_moe_triton_kernel,exponential_ 
vllm serve /data/Hy3/ \
    --tensor-parallel-size 8 \
    --port 8000 \
    --gpu-memory-utilization 0.95 \
    --served-model-name hy3 \
    --reasoning-parser hy_v3
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
    "model": "hy3",
    "messages": [{"role": "user", "content": "hi!"}]
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
The model weights are derived from Tencent-Hunyuan/Hy3 and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
