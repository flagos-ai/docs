---
license: apache-2.0
language:
- zh
- en
---

# Introduction
Tencent Hunyuan has officially open-sourced its multimodal model Hy4 Flash. Based on the unified multi-chip software stack FlagOS, the Zhongzhi FlagOS community has completed Day 0 cross-chip adaptation, covering nine chip vendors: T-Head, NVIDIA, Huawei Ascend, Hygon, Kunlunxin, Muxi, Moore Threads, TsingMicro and Iluvatar CoreX. Benefiting from the performance optimizations in FlagOS 2.2, overall evaluation results show that the FlagOS build running on NVIDIA H100 delivers up to a 35.9% increase in output throughput and up to a 29.1% reduction in time-to-first-token latency compared with the native NVIDIA stack. Industry users may deploy the FlagOS image of Hy4 Flash across diverse hardware by matching it with their existing computing resources and service workloads.

Hy4 Flash is designed for workloads including deep search, document processing, PPT generation and Computer Use for daily office scenarios. It has approximately 220 billion total parameters (including around 64 billion Engram parameters), with roughly 12 billion parameters activated per token. It natively supports text and image inputs and text outputs, alongside a maximum context length of 1 million tokens. Built with hybrid attention, Latent MoE and Engram architectures, its KV Cache footprint is only one-sixth that of Hy4. In Tencent Hunyuan’s internal WorkIndex benchmark, Hy4 Flash scores 42.1, outperforming Hy4 Preview’s 39.7, while boasting lower per-task costs.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-T-Head** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | HY4-flash-Nvidia-Origin | HY4-flash-T-Head-FlagOS |
|---|---|---|
| Math-500     | 96                             | 95.2                                 |
| GPQA_Diamond | 92,42                          | 87.88                                |
| mmbench      | 92.6                           | Evaluating                           |
| mmstar       | 80.93                          | Evaluating                           |
# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | PPU-ZW810E x8卡 |
| Docker Version | 26.1.3 |
| Operating System | 5.10.134-16.3.al8.x86_64 |
| Driver | 2.1.1-rbd225 |
| SDK | 1.7.0-84b81c-cuda-12.3.0 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/hy4-flash-pp001-gems0.0-tree0.6.2-cxnone-plugin0.0.0-vllm0.24.0-cp312-pt210-hggc130-x64-2.1.1-rbd225:202611182115
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Hy4-flash-INT8-zhenwu-FlagOS
```

### Start the Container
```bash
sudo docker run --privileged -dit \
-e HOST_HOSTNAME=$(hostname) \
--network=host \
--device=/dev/infiniband \
--ipc=host \
--device=/dev/alixpu_ctl \
--device=/dev/alixpu \
--ulimit memlock=-1 \
--ulimit stack=67108864 \
--init \
-v /mnt:/mnt \
-w /mnt/cpfs/baai-ea/flagos/jinghao \
--name hy4-flash \
harbor.baai.ac.cn/flagrelease-public/hy4-flash-pp001-gems0.0-tree0.6.2-cxnone-plugin0.0.0-vllm0.24.0-cp312-pt210-hggc130-x64-2.1.1-rbd225:202611182115
docker exec -it hy4-flash /bin/bash
```

### Start the Inference Server
```bash
vllm serve \
    /mnt/cpfs/baai-ea/flagos/models/Hy4-flash-testing-W8A8-no-MTP \
    --served-model-name hy4-flash-w8a8 \
    --host 0.0.0.0 \
    --port 8000 \
    --tensor-parallel-size 8 \
    --dtype bfloat16 \
    --kv-cache-dtype bfloat16 \
    --block-size 64 \
    --max-model-len 65536 \
    --max-num-seqs 64 \
    --max-num-batched-tokens 4096 \
    --async-scheduling \
    --compilation-config '{"cudagraph_mode":"FULL"}' \
    --enable-prefix-caching
```

## Service Invocation
### Invocation Script (Text)
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "hy4-flash-w8a8",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

### Invocation Script (Image)
```bash
IMAGE_BASE64=$(base64 -w 0 "/public-flash/example.jpg")

curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  --data-binary @- <<EOF
{
  "model": "hy4-flash-w8a8",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "请描述这张图片中的内容。"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,${IMAGE_BASE64}"
          }
        }
      ]
    }
  ]
}
EOF
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
The model weights are derived from Hy4-flash and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

