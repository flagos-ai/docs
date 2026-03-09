---
base_model:
- ""
frameworks:
- ""
---
# Introduction

**FlagOS** is a unified heterogeneous computing software stack for large models, co-developed with leading global chip manufacturers. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of \<chip + open-source model\>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.

Based on this, the **MiniCPM-o-4.5-zhen-FlagOS** model is adapted for the zhenwu chip using the FlagOS software stack, enabling:

### Integrated Deployment

- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS** container image supporting deployment within minutes

### Consistency Validation

- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Technical Overview

## FlagGems

FlagGems is a high-performance, generic operator library implemented in [Triton](https://github.com/openai/triton) language. It is built on a collection of backend-neutral kernels that aims to accelerate LLM (Large-Language Models) training and inference across diverse hardware platforms.

## FlagTree

FlagTree is an open source, unified compiler for multiple AI chips project dedicated to developing a diverse ecosystem of AI chip compilers and related tooling platforms, thereby fostering and strengthening the upstream and downstream Triton ecosystem. Currently in its initial phase, the project aims to maintain compatibility with existing adaptation solutions while unifying the codebase to rapidly implement single-repository multi-backend support. For upstream model users, it provides unified compilation capabilities across multiple backends; for downstream chip manufacturers, it offers examples of Triton ecosystem integration.

## FlagScale and vllm-plugin-fl

FlagScale is a comprehensive toolkit designed to support the entire lifecycle of large models. It builds on the strengths of several prominent open-source projects, including [Megatron-LM](https://github.com/NVIDIA/Megatron-LM) and [vLLM](https://github.com/vllm-project/vllm), to provide a robust, end-to-end solution for managing and scaling large models.
vllm-plugin-fl is a vLLM plugin built on the FlagOS unified multi-chip backend, to help flagscale support multi-chip on vllm framework.

## **FlagCX**

FlagCX is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.

## **FlagEval Evaluation Framework**

FlagEval is a comprehensive evaluation system and open platform for large models launched in 2023. It aims to establish scientific, fair, and open benchmarks, methodologies, and tools to help researchers assess model and training algorithm performance. It features:
  - **Multi-dimensional Evaluation**: Supports 800+ model evaluations across NLP, CV, Audio, and Multimodal fields, covering 20+ downstream tasks including language understanding and image-text generation.
  - **Industry-Grade Use Cases**: Has completed horizontal evaluations of mainstream large models, providing authoritative benchmarks for chip-model performance validation.

# Evaluation Results

Accuracy Difference between USE_FLAGGEMS=1 on Zhenwu and launch vllm server directly on Nvidia。

| Metrics(avg@1)                | Difference with Nvidia-CUDA |
| ---------------------- | ---------------------  |
| CMMMU ↑ | 3.50%                  |
| MMMU ↑ | 1.18%                  |
| MMMU_Pro_standard ↑ | 0.22%                  |
| MM-Vet v2 ↑ | 1.33%                  |
| OCRBench ↑ | 1.00%                  |
| CII-Bench ↑ | 0.13%                 |
| Blink ↑ | 2.19%                 |

# User Guide

## Environment Setup

| Item | Version               |
| ------------------------------- | ---------------------------------------- |
| FlagGems                        | Version: 4.2.1rc0                        |
| vllm & vllm-plugin-fl           | Version: 0.13.0 + vllm_fl 0.0.0                        |

## Download FlagOS Image

```bash
docker pull baai-cp-registry.cn-wulanchabu.cr.aliyuncs.com/flagos/flagos:vllm-plugin-fl
```

## Download Open-source Model Weights

```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-o-4.5-zhenwu-FlagOS --local_dir /share/MiniCPMO45
```

## Start the Container

```bash
#Container Startup
docker run --init --detach --net=host --user 0 --ipc=host \
           -v /share:/share --security-opt=seccomp=unconfined \
           --privileged --ulimit=stack=67108864 --ulimit=memlock=-1 \
           --shm-size=512G --gpus all \
           --name flagos baai-cp-registry.cn-wulanchabu.cr.aliyuncs.com/flagos/flagos:vllm-plugin-fl
docker exec -it flagos bash
```

## Serve and use MiniCPM-o-4.5 with vllm

Notes: you can refers to https://github.com/vllm-project/vllm to know how to use vllm

You can use 

```bash
vllm serve /share/MiniCPMO45 --trust-remote-code
```
to launch server without FlagOS, and use

```bash
USE_FLAGGEMS=1 vllm serve /share/MiniCPMO45 --trust-remote-code
```
to launch server with FlagOS.

After that, you can do whatever you want with the vllm's server at 0.0.0.0:8000!

# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support

# License

The weight files are from https://github.com/OpenBMB/MiniCPM-o, open source with apache2.0 licensehttps://www.apache.org/licenses/LICENSE-2.0.txt.

