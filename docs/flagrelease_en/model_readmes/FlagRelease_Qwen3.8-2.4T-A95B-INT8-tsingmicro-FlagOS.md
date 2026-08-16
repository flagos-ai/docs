---
base_model:
- ""
frameworks:
- ""
language:
- zh
- en
license: apache-2.0
---

# Introduction
Alibaba open-sources the ultra-large-scale MoE model Qwen3.8-2.4T-A95B, with the FlagOS Community simultaneously completing Day0 multi-chip adaptation. Qwen3.8-2.4T-A95B has completed multi-chip adaptation, precision alignment, and  deployment verification based on the FlagOS unified open-source technology stack on 10 AI chips including Alibaba T-Head, NVIDIA, Moore Threads, Huawei Ascend, Metax, Kunlunxin, Hygon, Tianshu Zhixin, Tsingmicro, and Enflame. The model provides multiple precision versions including BF16, FP8, and INT8 tailored to different chip configurations, allowing developers to directly access ready-to-use solutions for their respective chips.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Tsingmicro** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | Qwen3.8-2.4T-A95B-Nvidia-Origin | Qwen3.8-2.4T-A95B-Tsingmicro-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| GPQA_Diamond | 91.41                           | Evaluating                      |
|musr_murder_mysteries | 79.2                            | Evaluating                      |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 29.1.3, build 29.1.3-0ubuntu3~22.04.2 |
| Operating System | Ubuntu 22.04.4 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/qwen3.8-2.4t-a95b-int8-tsingmicro001-gems4.2.1-treenone-cx0.1.0-plugin0.0.0-vllm0.20.2-cp310-pt211-raisa0.2879-x64-v0.28791.2:202608130636
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.8-2.4T-A95B-INT8-tsingmicro-FlagOS --local_dir /data/Qwen3.8-2.4T-A95B-INT8
```

### Start the Container
```bash
docker run --privileged -dit --name flagos --shm-size=128g --network host --ipc=host -v /sys:/sys -v /dev:/dev -v /lib/modules:/lib/modules -v /data:/data harbor.baai.ac.cn/flagrelease-public/qwen3.8-2.4t-a95b-int8-tsingmicro001-gems4.2.1-treenone-cx0.1.0-plugin0.0.0-vllm0.20.2-cp310-pt211-raisa0.2879-x64-v0.28791.2:202608130636 /bin/bash
docker exec -it flagos /bin/bash
```
### Start the Server
```bash
source /home/secure/260629145101/vllm-397B/test_env.sh
# in node 0 (master)
bash serve.sh master
# in node 1 (worker)
bash serve.sh worker
```

## Service Invocation
### Invocation Script
```bash
curl -X POST http://localhost:9001/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "${weights_path}",
    "prompt": "中国的首都是哪里？",
    "max_tokens": 50,
    "temperature": 0.7
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
The model weights are derived from Qwen/Qwen3.8-2.4T-A95B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt


