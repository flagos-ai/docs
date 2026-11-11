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
- Released **FlagOS-Hygon** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | Qwen3.8-2.7B-Nvidia-Origin | Qwen3.8-27B-Hygon-FlagOS |
|--------------|----------------------------|--------------------------|
| musr_murder_mysteries| 76.8                      | 78.31                    |
| GPQA_Diamond | 90.4                      | 90.91                    |

## Performance Benchmark
| Test Scenario                            | 4k & 1k 64 Concurrent | 
|------------------------------------------|-----------------------|
| Speedup Ratio (Hygon-flagos / NV-native) | 82.98%                | 

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 20.10.5, build 55c4c88 |
| Operating System | Ubuntu 22.04.4 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/qwen3.8-27b-hygon001-gems5.0.2-tree0.6.1-cxnone-plugin0.1.1-vllm0.20.0-cp310-pt210-dtk2604-x64-6.3.30-v1.4.1a:202608131925
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.8-27B-BF16-hygon-FlagOS --local_dir /data/Qwen3.8-27B
```

### Start the Container
```bash
docker run \
    --name flagos \
    --network=host \
    --ipc=host \
    --device=/dev/kfd \
    --device=/dev/mkfd \
    --device=/dev/dri \
    -v /opt/hyhal:/opt/hyhal \
    -v /public-flash:/baai \
    -v /data:/data \
    --group-add video \
    --cap-add=SYS_PTRACE \
    --security-opt seccomp=unconfined \
    -itd \
    harbor.baai.ac.cn/flagrelease-public/qwen3.8-27b-hygon001-gems5.0.2-tree0.6.1-cxnone-plugin0.1.1-vllm0.20.0-cp310-pt210-dtk2604-x64-6.3.30-v1.4.1a:202608131925 \
    bash
docker exec -it flagos bash
```
### Start the Server
```bash
export VLLM_FL_FLAGOS_WHITELIST="cos,cumsum,fill,full,gather,gt,le,lt,max,mul,sin,softmax,to,where,zeros,zeros_like"
export HIP_VISIBLE_DEVICES="0,1"
export VLLM_SPARSE_THRESHOLD=0.01
export VLLM_FL_USE_FLASH_PREFILL_ONE_SEQ=1
export VLLM_FL_HYGON_CUSTOM_AR=2
export GEMS_VENDOR="hygon" 
export VLLM_PLUGINS="fl"
vllm serve /data/Qwen3.8-27B \
    --served-model-name qwen38 \
    --port 8000 \
    --trust-remote-code \
    --dtype bfloat16 \
    --tensor-parallel-size 2 \
    --gpu-memory-utilization 0.925 \
    --max-model-len 262144 \
    --reasoning-parser qwen3 \
    --no-enable-log-requests \
    --max-num-batched-tokens 8192 \
    --no-enable-prefix-caching
```

## Service Invocation
### Invocation Script
```bash
curl http://127.0.0.1:8000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
    "model": "qwen38",
    "messages": [{"role": "user", "content": "HI"}],
    "temperature": 0.6,
    "max_tokens": 512
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
The model weights are derived from Qwen/Qwen3.8-27B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
