---
frameworks:
- ""
language: zh
library_name: transformers
license: apache-2.0
pipeline_tag: text-generation
tags:
- moonlight
- ascend
- vllm
- moe
- FlagOS
tasks: []
---

# Introduction

**Moonlight-16B-A3B** is a high-performance large language model optimized for the ascend GPU platform. Built on a Mixture of Experts (MoE) architecture, the model features a total of 16 billion parameters with approximately 3 billion active parameters per inference, striking an optimal balance between high performance and efficient inference throughput. Deeply optimized for ascend GPU hardware, Moonlight-16B-A3B supports the vLLM inference framework, making it well-suited for large-scale deployment scenarios.

### Integrated Deployment

- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-ascend** container image supporting deployment within minutes

### Consistency Validation

- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results

## Benchmark Result

| Metrics          | Moonlight-16B-A3B-Nvidia-Origin | Moonlight-16B-A3B-ascend-FlagOS |
|------------------|--------------------------------|-----------------------------------|
| GPQA_Diamond     | 0.1384                         | 0.1091                            |
| LiveBench New    | 0.0475                         | 0.0382                            |
| musr             | 0.0172                         | 0.0820                            |
| mmlu_pro         | 0.1986                         | 0.2657                            |
| aime             | 0.0000                         | 0.0000                            |

# User Guide

## Environment Setup

| Item | Version |
|------|----------|
| Docker Version | Docker version 20.10.8, build 3967b7d |
| Operating System | openEuler 22.03 LTS-SP4 Kernel: 5.10.0 Arch: aarch64|

## Operation Steps

### Download FlagOS Image

```bash
docker pull harbor.baai.ac.cn/external-cooperation/moonlight-16b-a3b-ascend-tree_0.5.0_ascend3.2-gems_5.0.2-vllm_0.13.0_empty-plugin_0.1.1-cx_none-python_3.11.14-torch_2.8.0-pcp_none-npu_ascend910c-arc_aarch64-driver_25.5.0:2607301800
```

### Download Open-source Model Weights

```bash
pip install modelscope

modelscope download \
  --model FlagRelease/Moonlight-16B-A3B-ascend-FlagOS \
  --local_dir /data/Moonlight-16B-A3B-ascend-FlagOS
```

### Start the Container

```bash
docker run -itd \
  --name flagos \
  --privileged \
  --ipc=host \
  --network host \
  --shm-size=32g \
  -v /usr/local/Ascend/driver:/usr/local/Ascend/driver \
  -v /usr/local/sbin/npu-smi:/usr/local/sbin/npu-smi \
  -v /usr/local/dcmi:/usr/local/dcmi \
  -v /usr/local/sbin:/usr/local/sbin \
  -v /etc/ascend_install.info:/etc/ascend_install.info \
  -v /data/Moonlight-16B-A3B-ascend-FlagOS:/data/Moonlight-16B-A3B-ascend-FlagOS \
  --workdir /workspace \
harbor.baai.ac.cn/external-cooperation/moonlight-16b-a3b-ascend-tree_0.5.0_ascend3.2-gems_5.0.2-vllm_0.13.0_empty-plugin_0.1.1-cx_none-python_3.11.14-torch_2.8.0-pcp_none-npu_ascend910c-arc_aarch64-driver_25.5.0:2607301800
```

### Enter the Container

```bash
docker exec -it flagos /bin/bash
```

### Start the Server

Inside the container:

```bash
export ASCEND_RT_VISIBLE_DEVICES=0,1
export VLLM_FL_FLAGOS_WHITELIST=cos,sin,lt_scalar,lt,arange,repeat_interleave_self_int,all,embedding
export VLLM_PLUGINS=fl
export USE_FLAGGEMS=1
nohup vllm serve \
    --model /data/Moonlight-16B-A3B-ascend-FlagOS \
    --served-model-name moonlight-16b-a3b-flagos \
    --port 8003 \
    --trust-remote-code \
    --tensor-parallel-size 2 \
    --enforce-eager \
    > /workspace/flagos_server.log 2>&1 &
```

## Service Invocation

### Invocation Script

```bash
curl http://localhost:8003/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "moonlight-16b-a3b-flagos",
    "messages": [{"role": "user", "content": "hello!"}]
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
- Configure core LLM parameters:
  - API URL: http://localhost:8003/v1
  - Model: moonlight-16b-a3b-flagos
- Click "Save Settings" to apply changes

#### 3. Model Interaction

- After model loading is complete:
- Click **"New Conversation"**
- Enter your question (e.g., "Explain the basics of quantum computing")
- Click the send button to get a response

# Technical Overview

FlagOS is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a "develop once, run anywhere" workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads.

With core technologies such as FlagScale, together with vllm-plugin-fl, distributed training/inference framework, FlagGems universal operator library, FlagCX communication library, and FlagTree unified compiler, the FlagRelease platform leverages the FlagOS stack to automatically produce and release various combinations of <chip + open-source model>.

This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.

## FlagGems

FlagGems is a high-performance, generic operator library implemented in Triton language. It is built on a collection of backend-neutral kernels that aims to accelerate LLM training and inference across diverse hardware platforms.

## FlagTree

FlagTree is an open-source unified compiler for multiple AI chips. It provides unified compilation capabilities across multiple backends and rapidly implements single-repository multi-backend support.

## FlagScale and vllm-plugin-fl

FlagScale is a comprehensive toolkit designed to support the entire lifecycle of large models. It integrates capabilities from Megatron-LM and vLLM to provide an end-to-end solution for training and inference.

vllm-plugin-fl is a vLLM plugin built on the FlagOS unified multi-chip backend.

## FlagCX

FlagCX is a scalable and adaptive cross-chip communication library for distributed AI workloads.

## FlagEval Evaluation Framework

FlagEval is a comprehensive evaluation system and open platform for large models. It supports large-scale benchmark evaluation across NLP, CV, Audio, and Multimodal tasks.

# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support

# License

The model weights are derived from moonshotai/Moonlight-16B-A3B and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

