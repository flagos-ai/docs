---
license: apache-2.0
language:
- zh
- en
---

# Introduction
China Telecom Artificial Intelligence Technology Co., Ltd. has officially released Xing4.0-29B-A4B, a new-generation Xingchen large model built for the AI agent era. The FlagOS open-source community completed Day-0 multi-chip adaptation in parallel. Xing4.0-29B-A4B has finished multi-chip adaptation, accuracy alignment and deployment verification on nine chip platforms, including T-Head, NVIDIA, Moore Threads, Huawei Ascend, MetaX, Hygon, Iluvatar CoreX, Tsingmicro and ARM, based on the unified FlagOS open-source technology stack. Seven of these AI chips operate at BF16 precision, while the ARM platform offers a W4A8 quantized version. The multi-chip variants have been published on ModelScope and Hugging Face, allowing developers to obtain ready-to-use deployment solutions for respective hardware platforms.

Built upon the TeleChat1-3 series, Xing4.0-29B-A4B is a comprehensively upgraded Xingchen large model. It features a total parameter count of 29B with only 4B activated parameters, adopting the mHC+MLA+MTP architecture. It natively supports a 256K context window, which can be extended to 512K. As China’s first tens-of-billion-parameter large model fully trained on domestic computing power and domestic frameworks, it is deeply optimized for complex engineering tasks. Designed for Agent scenarios, it can efficiently handle long-horizon tasks, support multi-step planning, tool invocation and the execution of complex reasoning chains, delivering powerful agent capabilities at a relatively small parameter scale.


### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Metax** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | Xing4.0-29B-A4B-Nvidia-Origin | Xing4.0-29B-A4B-Metax-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| GPQA_Diamond | 62.23 | Evaluating  |
| Math-500        | 84.80 | 92.60 |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 29.3.1 |
| Operating System | 22.04 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/metax-vllm-0.24.0-pluginfl-tree3.6:xingchen4-0907
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Xing4.0-29B-A4B-BF16-metax-FlagOS --local_dir /data/Xing4.0-29B-A4B
```

### Start the Container
```bash
docker run -d --name flagos --net=host --ipc=host --privileged --shm-size=64g --group-add video --ulimit memlock=-1 --security-opt seccomp=unconfined --security-opt apparmor=unconfined --device=/dev/dri --device=/dev/mxcd -v /data:/data harbor.baai.ac.cn/flagrelease-public/metax-vllm-0.24.0-pluginfl-tree3.6:xingchen4-0907 sleep infinity
```
### Start the Server
```bash
export GEMS_VENDOR=metax
export VLLM_PLUGINS=fl
export MACA_VISIBLE_DEVICES=0,1
export VLLM_WORKER_MULTIPROC_METHOD=spawn
export VLLM_FL_FLAGOS_BLACKLIST=mm,mm_out,sort,stable_sort,masked_fill,masked_fill_,slice
export VLLM_FL_USE_FLAGGEMS_ATTN=0
export VLLM_ENGINE_ITERATION_TIMEOUT_S=7200
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=7200

vllm serve /data/Xing4.0-29B-A4B \
  --served-model-name xingchen429 \
  --dtype bfloat16 \
  --tensor-parallel-size 2 \
  --max-model-len 32768 \
  --gpu-memory-utilization 0.9 \
  --port 8032 \
  --enforce-eager \
  --no-enable-chunked-prefill \
  --trust-remote-code
```

## Service Invocation
### Invocation Script
```bash
curl -s http://localhost:8032/v1/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"xingchen429","prompt":"问:中国的首都是哪个城市呢？答:","max_tokens":16,"temperature":0}'
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
The model weights are derived from XingChen-AGI/Xing4.0-29B-A4B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
