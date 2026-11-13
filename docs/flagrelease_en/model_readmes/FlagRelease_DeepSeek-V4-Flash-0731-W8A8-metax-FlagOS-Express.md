---
base_model:
- ""
language:
- zh
- en
license: apache-2.0
---

# Introduction
This is a W8A8-INT8 fully quantized inference variant of DeepSeek-V4-Flash-0731. Both weights and activations are quantized to INT8 for native INT8 GEMM. Based on the 284B MoE baseline (13B activated params per token), optimized for agents, code generation and tool calling with a 1M-token context window. It preserves core model capabilities while cutting VRAM usage and improving throughput, ideal for offline and high-concurrency on-premise deployment. 

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Metax** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | DeepseekV4-flash-Metax-FlagOS |
|---|---|
| GPQA | 88.38 |
| Math-500 | 95.6 |

# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | MetaX C550 x8卡 |
| Docker Version | 29.1.3 |
| Operating System | Ubuntu 22.04.5 LTS |
| Driver | MetaX 3.8.1 |
| SDK | MACA 3.7.0.38 |

## Operation Steps

### Step 0. Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/deepseekv4-flash-metax001-gems5.5.0-tree0.7.0-cxnone-plugin0.3.0-vllm0.24.0-sglangnone-sglangflnone-cp312-pt210-maca38-x64-3.8.1:202611091757
```

### Step 1. Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/DeepSeek-V4-Flash-0731-W8A8-metax-FlagOS-Express
```

### Step 2. Start the Container
```bash
docker run -itd \
  --name deepseekV4-flash \
  --hostname "$(hostname)" \
  --privileged \
  --ipc=host \
  --network=host \
  -v /public-flash:/public-flash:rw,rprivate \
  -v /data:/data:rw,rslave \
  -w /public-flash \
  --entrypoint /bin/bash \
harbor.baai.ac.cn/flagrelease-public/deepseekv4-flash-metax001-gems5.5.0-tree0.7.0-cxnone-plugin0.3.0-vllm0.24.0-sglangnone-sglangflnone-cp312-pt210-maca38-x64-3.8.1:202611091757
```

### Step 3. Start the Inference Server
```bash
export GEMS_VENDOR=metax
export VLLM_PLUGINS=fl
export TORCH_ALLOW_TF32_CUBLAS_OVERRIDE=1

nohup /opt/conda/bin/vllm serve \
  FlagRelease/DeepSeek-V4-Flash-0731-W8A8-metax-FlagOS-Express \
  --served-model-name deepseek-v4-flash-w8a8 \
  --host 0.0.0.0 --port 18001 \
  --tensor-parallel-size 8 \
  --kv-cache-dtype fp8 --block-size 256 \
  --max-model-len 66560 --max-num-seqs 64 \
  --max-num-batched-tokens 4096 \
  --gpu-memory-utilization 0.85 \
  --disable-custom-all-reduce \
  --compilation-config '{"cudagraph_mode":"FULL_DECODE_ONLY","custom_ops":["all"],"cudagraph_capture_sizes":[1,2,4,8,16,32,64]}' \
  --hf-overrides '{"expert_dtype":"int8"}' \
  --enable-prefix-caching \
  --default-chat-template-kwargs '{"thinking":true}' \
  --cudagraph-metrics \
  > service.log 2>&1 &
```

## Service Invocation
### Invocation Script (Text)
```bash
curl http://localhost:18001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4-flash-w8a8",
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
The model weights are derived from T-HEAD/DeepSeek-V4-Flash-0731-Quant-W-INT8-PerChannel-A-INT8-PerToken and are open-sourced under the Apache License 2.0.


