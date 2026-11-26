---
language:
- en
---

# Introduction

Tencent Hunyuan has officially open-sourced its multimodal model Hy4 Flash. Based on the unified multi-chip software stack FlagOS, the Zhongzhi FlagOS community has completed Day 0 cross-chip adaptation, covering nine chip vendors: T-Head, NVIDIA, Huawei Ascend, Hygon, Kunlunxin, Muxi, Moore Threads, TsingMicro and Iluvatar CoreX. Benefiting from the performance optimizations in FlagOS 2.2, overall evaluation results show that the FlagOS build running on NVIDIA H100 delivers up to a 35.9% increase in output throughput and up to a 29.1% reduction in time-to-first-token latency compared with the native NVIDIA stack. Industry users may deploy the FlagOS image of Hy4 Flash across diverse hardware by matching it with their existing computing resources and service workloads.

Hy4 Flash is designed for workloads including deep search, document processing, PPT generation and Computer Use for daily office scenarios. It has approximately 220 billion total parameters (including around 64 billion Engram parameters), with roughly 12 billion parameters activated per token. It natively supports text and image inputs and text outputs, alongside a maximum context length of 1 million tokens. Built with hybrid attention, Latent MoE and Engram architectures, its KV Cache footprint is only one-sixth that of Hy4. In Tencent Hunyuan’s internal WorkIndex benchmark, Hy4 Flash scores 42.1, outperforming Hy4 Preview’s 39.7, while boasting lower per-task costs.

### Integrated Deployment

- One server with eight Kunlunxin P800 OAM accelerators, 96 GiB per device.
- Tensor parallelism: TP8. Expert parallelism: EP8.
- W8A8 quantization for the main projection and expert layers, with BF16 for selected computation and FP32 for selected tensor-parallel reductions.
- Reference serving configuration: 204,800-token context limit, up to 64 concurrent sequences, and a scheduler token budget of 512. Eager execution with MTP and DFly disabled.

### Consistency Validation

The reference configuration completed a text-generation smoke test and all 64 requests in the benchmark below.

# Evaluation Results
| Metrics | Hy4-Nvidia-Origin | Hy4-Kunlunxin-FlagOS |
|---|---|---|
| Math-500     | 96.2                           | Evaluating                                                           |
| GPQA_Diamond | 93.65                          | Evaluating                                                           |
| mmbench      | 91.2                           | Evaluating                           |
| mmstar       | 79.67                          | Evaluating                           |

# User Guide

Environment Setup

| Item | Reference environment |
| --- | --- |
| Accelerator | 8 × Kunlunxin P800 OAM |
| Docker | 24.0 |
| Operating system | Ubuntu 22.04 LTS |
| Kunlunxin driver / XPU runtime | 5.0.21.47 / 5.0.21 |

## Operation Steps

### Download FlagOS Image

```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-kunlunxin-release-model_hy4-flash-testing-w8a8-no-mtp-tree_0.7.0rc2.xpu3.6-gems_5.4.0rc2.post1-cx_0.13.0-python_3.10.18-torch_cuda-2.9.0-pcp_xrt5.0.21-gpu_kunlunxin001-arc_amd64-driver_5.0.21.47:202611241528

export HY4_FLASH_IMAGE="harbor.baai.ac.cn/flagrelease-public/flagrelease-kunlunxin-release-model_hy4-flash-testing-w8a8-no-mtp-tree_0.7.0rc2.xpu3.6-gems_5.4.0rc2.post1-cx_0.13.0-python_3.10.18-torch_cuda-2.9.0-pcp_xrt5.0.21-gpu_kunlunxin001-arc_amd64-driver_5.0.21.47:202611241528"

```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Hy4-flash-INT8-kunlunxin-FlagOS
```
Obtain the Hy4 Flash W8A8 checkpoint with MTP disabled from your model provider. Set `HY4_FLASH_MODEL_DIR` to its absolute local directory. The container mounts the checkpoint read-only at `/models/hy4-flash`.

### Start the Container

Save this script as `start-hy4-flash-p800.sh`. It uses the image entrypoint and mounts only the model weights. Make sure the Kunlunxin driver exposes the eight P800 devices.

```bash
#!/usr/bin/env bash
set -euo pipefail

[[ $# -eq 1 ]] || { echo "Usage: $0 MODEL_DIR" >&2; exit 2; }
model=$(realpath -e -- "$1")
image="${HY4_FLASH_IMAGE:?Set HY4_FLASH_IMAGE to your image reference}"
test -r "$model/config.json"

devices=(--device /dev/xpuctrl)
for id in {0..7}; do
  devices+=(--device "/dev/xpu$id")
done

exec docker run -d --name hy4-flash-p800 --shm-size 128g \
  "${devices[@]}" --publish 127.0.0.1:8000:8000 \
  --mount "type=bind,src=$model,dst=/models/hy4-flash,readonly" \
  "$image"
```

### Start the Server

Set `HY4_FLASH_IMAGE` and `HY4_FLASH_MODEL_DIR` before running the script.

```bash
bash start-hy4-flash-p800.sh "$HY4_FLASH_MODEL_DIR"
# Check readiness and get the served model ID once the model has loaded.
curl -fsS http://127.0.0.1:8000/v1/models
```

## Service Invocation

### Invocation Script

Set `HY4_FLASH_MODEL_ID` to the model ID returned by `/v1/models`.

```bash
model_id="${HY4_FLASH_MODEL_ID:?Set HY4_FLASH_MODEL_ID from /v1/models}"
python3 -c 'import json, sys; print(json.dumps({
    "model": sys.argv[1],
    "messages": [{"role": "user", "content": "What is 7 plus 5?"}],
    "temperature": 0,
    "max_tokens": 24
}))' "$model_id" |
  curl --fail-with-body http://127.0.0.1:8000/v1/chat/completions \
    -H 'Content-Type: application/json' --data-binary @-
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
