---
base_model:
- ""
language:
- zh
- en
---

# Introduction
Tencent Hunyuan has officially open-sourced its multimodal model Hy4 Flash. Based on the unified multi-chip software stack FlagOS, the Zhongzhi FlagOS community has completed Day 0 cross-chip adaptation, covering nine chip vendors: T-Head, NVIDIA, Huawei Ascend, Hygon, Kunlunxin, Muxi, Moore Threads, TsingMicro and Iluvatar CoreX. Benefiting from the performance optimizations in FlagOS 2.2, overall evaluation results show that the FlagOS build running on NVIDIA H100 delivers up to a 35.9% increase in output throughput and up to a 29.1% reduction in time-to-first-token latency compared with the native NVIDIA stack. Industry users may deploy the FlagOS image of Hy4 Flash across diverse hardware by matching it with their existing computing resources and service workloads.

Hy4 Flash is designed for workloads including deep search, document processing, PPT generation and Computer Use for daily office scenarios. It has approximately 220 billion total parameters (including around 64 billion Engram parameters), with roughly 12 billion parameters activated per token. It natively supports text and image inputs and text outputs, alongside a maximum context length of 1 million tokens. Built with hybrid attention, Latent MoE and Engram architectures, its KV Cache footprint is only one-sixth that of Hy4. In Tencent Hunyuan’s internal WorkIndex benchmark, Hy4 Flash scores 42.1, outperforming Hy4 Preview’s 39.7, while boasting lower per-task costs.
### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Pre-built **FlagOS-Nvidia** container image plus a pinned vLLM 0.32 / FlagGems stack for deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.



### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Nvidia** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.


# Evaluation Results

| Metrics | Hy4-flash-Nvidia-Origin | Hy4-flash-Nvidia-FlagOS |
|---|---|---|
| Math-500     | 96                             | 96.2                                 |
| GPQA_Diamond | 92,42                          | 90.86                                |
| mmbench      | 92.6                           | 92.5                                 |
| mmstar       | 80.93                          | 81.2                                 |
## Benchmark Result

| Input/Output | Avg TTFT (ms) | P99 TTFT (ms) | Output(tok/s) | Total(tok/s) | Avg TPOT (ms) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 4K/1K | 5764.6064 | 10752.9663 | 2093.5250 | 10467.6252 | 24.7680 |
| 16K/1K | 12087.5226 | 43197.6946 | 1032.1656 | 17546.8155 | 49.6946 |
| 32K/1K | 24274.1482 | 88528.6541 | 603.1481 | 19903.8868 | 81.3524 |

# User Guide
Environment Setup

| Item | Version |
|---|---|
| Hardware (GPU) | 8× NVIDIA H100 |
| Docker Version | 20.10.5 on the validated host |
| Operating System | Ubuntu 24.04 (container), Linux amd64, NVIDIA driver 580.126.20 on the validated host |
| Deployment | Hy4 Flash W8A8 no-MTP |
| vLLM | 0.32.0 |
| vllm-plugin-FL | 0.5.0.dev0+g814b6d3 |
| FlagGems | 5.4.1.dev0+g4897cc3.hy4.2 |
| FlagTree | 0.7.0 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_hy4-flash-testing-w8a8-no-mtp-tree_0.7.0-gems_5.4.1.dev0.g4897cc3.hy4.2-cx_none-python_3.12.3-torch_cuda-2.13.0.cu130-pcp_cuda13.0-gpu_nvidia004-arc_amd64-driver_580.126.20:202611191716
```

### Download Open-source Model Weights
This is an image-only release. The W8A8 no-MTP weights were not uploaded as part of this release. Set `HY4_WEIGHTS_DIR` to the authorized checkpoint directory. The container mounts it read-only at `/model`.

```bash
modelscope download --model FlagRelease/Hy4-flash-INT8-nvidia-FlagOS
test -d "${HY4_WEIGHTS_DIR:?Set HY4_WEIGHTS_DIR to the authorized W8A8 no-MTP checkpoint directory}"
```

### Start the Container
```bash
# Use the eight H100 devices and driver library layout from the validated serving host.
docker run -d --name flagrelease-hy4 --device=/dev/nvidia0 --device=/dev/nvidia1 --device=/dev/nvidia2 --device=/dev/nvidia3 --device=/dev/nvidia4 --device=/dev/nvidia5 --device=/dev/nvidia6 --device=/dev/nvidia7 --device=/dev/nvidiactl --device=/dev/nvidia-uvm --device=/dev/nvidia-uvm-tools --mount type=bind,src=/usr/lib/x86_64-linux-gnu/libcuda.so.580.126.20,dst=/driver/libcuda.so.1,readonly --mount type=bind,src=/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.580.126.20,dst=/driver/libnvidia-ml.so.1,readonly --mount type=bind,src=/usr/lib/x86_64-linux-gnu/libnvidia-ptxjitcompiler.so.580.126.20,dst=/driver/libnvidia-ptxjitcompiler.so.1,readonly --mount type=bind,src=/usr/lib/x86_64-linux-gnu/libnvidia-nvvm.so.580.126.20,dst=/driver/libnvidia-nvvm.so.4,readonly --network none --shm-size 16g --mount "type=bind,src=${HY4_WEIGHTS_DIR:?set HY4_WEIGHTS_DIR},dst=/model,readonly" harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_hy4-flash-testing-w8a8-no-mtp-tree_0.7.0-gems_5.4.1.dev0.g4897cc3.hy4.2-cx_none-python_3.12.3-torch_cuda-2.13.0.cu130-pcp_cuda13.0-gpu_nvidia004-arc_amd64-driver_580.126.20:202611191716
```
### Start the Server
```bash
# The image entrypoint starts the server. Check readiness with:
docker exec flagrelease-hy4 curl -fsS http://127.0.0.1:18080/v1/models
```

## Service Invocation
### Invocation Script
```bash
docker exec flagrelease-hy4 curl -fsS http://127.0.0.1:18080/v1/chat/completions -H 'Content-Type: application/json' -d '{"model": "Hy4-flash-testing-W8A8-no-MTP", "messages": [{"role": "user", "content": "Hello"}], "max_tokens": 128}'
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

The pre-package 32K/1K C64 W8A8 run confirmed **21 distinct FlagGems-family entries** in rank 0 prefill and Graph decode samples.

- **FlagGems (1).** `rms_norm`.
- **FlagGems-vLLM (20).** `dynamic_per_token_quant_int8`, `grouped_topk`, `hy4_flash_concat_and_cache_mla`, `hy4_flash_concat_mla_q`, `hy4_flash_expand_groups`, `hy4_flash_expert_quant_int8`, `hy4_flash_fwht_quant_fp8`, `hy4_flash_gated_pool`, `hy4_flash_ihc_post`, `hy4_flash_ihc_pre`, `hy4_flash_int8_scaled_mm`, `hy4_flash_moe_align`, `hy4_flash_moe_sum`, `hy4_flash_mrope`, `hy4_flash_paged_mqa`, `hy4_flash_rotate_indexer`, `hy4_flash_select_groups`, `hy4_flash_sparse_mla`, `hy4_flash_write_pool`, `silu_and_mul`.

## FlagTree
FlagTree is an open source, unified compiler for multipleAI chips project dedicated to developing a diverse ecosystem of AI chip compilers and related tooling platforms, thereby fostering and strengthening the upstream and downstream Triton ecosystem. Currently in its initial phase, the project aims to maintain compatibility with existing adaptation solutions while unifying the codebase to rapidly implement single-repository multi-backend support. Forupstream model users, it provides unified compilation capabilities across multiple backends; for downstream chip manufacturers, it offers examples of Triton ecosystem integration.

The same trace confirms two additional paths. `hy4_flash_fp32_router_gemm` used the FlagTree router overlay. `invoke_fused_moe_triton_kernel` used the tuned W8A8 expert path.

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


