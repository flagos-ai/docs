---
license: apache-2.0
language:
- zh
- en
---

# Introduction
Alibaba open‑sources the vision‑language model Qwen3.8‑27B, and the Zhongzhi (众智) FlagOS community simultaneously completes Day 0 multi‑chip adaptation; based on the FlagOS unified open‑source technology stack, Qwen3.8‑27B has finished multi‑chip adaptation, precision alignment and deployment verification across 11 AI chips including T-Head（平头哥）、NVIDIA（英伟达）、Moore Threads（摩尔线程）、MetaX（沐曦）、Kunlunxin（昆仑芯）、Ascend（华为昇腾）、Hygon（海光）、Iluvatar CoreX（天数智芯）、Tsingmicro（清微智能）、Enflame（燧原科技）and Sunrise（曦望）, among which NVIDIA and Moore Threads support FP8 precision deployment while the rest run on BF16, and FlagOS has for the first time extended the adaptation of the latest Qwen model to ARM edge‑side platforms with a W4A8 low‑bit version, enabling developers to directly obtain corresponding out‑of‑the‑box solutions.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Zhenwu** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics | Qwen3.8-27B-Nvidia-Origin | Qwen3.8-27B-Zhenwu-FlagOS |
|--------------|--------------------------------|---------------------------|
| musr_murder_mysteries| 76.8                   | 78.51                     |
| GPQA_Diamond | 90.4                      | 88.38                     |

## Performance Benchmark
| Test Scenario                             | 4k & 1k 64 Concurrent | 16k & 1k 64 Concurrent | 
|-------------------------------------------|-----------------------|------------------------|
| Speedup Ratio (Zhenwu-flagos / NV-native) | 188.68%               | 121.39%                | 


# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 28.1.0, build 4d8c241 |
| Operating System | Ubuntu 24.04.2 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/qwen3.8-27b-pp001-gems0.0-treenone-cxnone-plugin0.2.0-vllm0.24.0-cp312-pt210-hggc130-x64-1.3.2-d7f5a2:202608141100
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.8-27B-BF16-zhenwu-FlagOS --local_dir /data/Qwen3.8-27B
```

### Start the Container
```bash
docker run -dit \
    --name qwen3.8-27B \
    --shm-size=64g \
    --network=host \
    --device /dev/alixpu \
    --device /dev/alixpu_ctl \
    --device /dev/alixpu_ppu0 \
    --device /dev/alixpu_ppu1 \
    --device /dev/alixpu_ppu2 \
    --device /dev/alixpu_ppu3 \
    --device /dev/alixpu_ppu4 \
    --device /dev/alixpu_ppu5 \
    --device /dev/alixpu_ppu6 \
    --device /dev/alixpu_ppu7 \
    --device /dev/alixpu_ppu8 \
    --device /dev/alixpu_ppu9 \
    --device /dev/alixpu_ppu10 \
    --device /dev/alixpu_ppu11 \
    --device /dev/alixpu_ppu12 \
    --device /dev/alixpu_ppu13 \
    --device /dev/alixpu_ppu14 \
    --device /dev/alixpu_ppu15 \
    -v /mnt/:/mnt/ \
    harbor.baai.ac.cn/flagrelease-public/qwen3.8-27b-pp001-gems0.0-treenone-cxnone-plugin0.2.0-vllm0.24.0-cp312-pt210-hggc130-x64-1.3.2-d7f5a2:202608141100
```
### Start the Server
```bash
VLLM_FL_FLAGOS_BLACKLIST=index nohup vllm serve  /data/Qwen3.8-27B \
    --port 8020 \
    --trust-remote-code \
    --served-model-name Qwen3.8-27B-someges \
    --tensor-parallel-size 2 \
    --max-model-len 50000 \
    --gpu-memory-utilization 0.85 \
    --reasoning-parser qwen3 \
    --compilation-config '{"cudagraph_mode":"FULL_DECODE_ONLY"}'
```

## Service Invocation
### Invocation Script
```bash
curl http://127.0.0.1:8020/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "中国首都是？",
    "max_tokens": 128
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
The model weights are derived from Qwen/Qwen3.8-27B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

