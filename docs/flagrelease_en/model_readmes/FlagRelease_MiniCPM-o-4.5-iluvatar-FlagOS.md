---
base_model:
- ""
frameworks:
- ""
---
# Introduction

**FlagOS** is a unified heterogeneous computing software stack for large models, co-developed with leading global chip manufacturers. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of \<chip + open-source model\>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.

Based on this, the **MiniCPM-o-4.5-iluvatar-FlagOS** model is adapted for the Iluvatar chip using the FlagOS software stack, enabling:

## Integrated Deployment

- Deep integration with the open-source [FlagScale framework](https://github.com/FlagOpen/FlagScale)
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Iluvatar** container image supporting deployment within minutes

## Consistency Validation

- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Technical Overview

## FlagGems

FlagGems is a high-performance, generic operator library implemented in [Triton](https://github.com/openai/triton) language. It is built on a collection of backend-neutral kernels that aims to accelerate LLM (Large-Language Models) training and inference across diverse hardware platforms.

## FlagTree

FlagTree is an open source, unified compiler for multiple AI chips project dedicated to developing a diverse ecosystem of AI chip compilers and related tooling platforms, thereby fostering and strengthening the upstream and downstream Triton ecosystem. Currently in its initial phase, the project aims to maintain compatibility with existing adaptation solutions while unifying the codebase to rapidly implement single-repository multi-backend support. For upstream model users, it provides unified compilation capabilities across multiple backends; for downstream chip manufacturers, it offers examples of Triton ecosystem integration.

## **FlagScale**

FlagScale is a comprehensive toolkit designed to support the entire lifecycle of large models. It builds on the strengths of several prominent open-source projects, including [Megatron-LM](https://github.com/NVIDIA/Megatron-LM) and [vLLM](https://github.com/vllm-project/vllm), to provide a robust, end-to-end solution for managing and scaling large models.

## **FlagCX**

FlagCX is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.

## **FlagEval Evaluation Framework**

FlagEval is a comprehensive evaluation system and open platform for large models launched in 2023. It aims to establish scientific, fair, and open benchmarks, methodologies, and tools to help researchers assess model and training algorithm performance. It features:
  - **Multi-dimensional Evaluation**: Supports 800+ model evaluations across NLP, CV, Audio, and Multimodal fields, covering 20+ downstream tasks including language understanding and image-text generation.
  - **Industry-Grade Use Cases**: Has completed horizontal evaluations of mainstream large models, providing authoritative benchmarks for chip-model performance validation.

# Evaluation Results

In the following table, +x means FlagOS performs better than CUDA with x accuracy score, while -x means CUDA performs better. For FlagEval's benchmarks avg@1, +-5.00 means there's no significant difference between two AI-ecosystems.

## Transformers version
Accuracy Difference between using FLAGOS on Iluvatar backend and Nvidia-CUDA
| Metrics                | Difference with Nvidia-CUDA  |
| ---------------------- | ---------------------  |
| Video-MME 0-shot avg@1 ↑	 |          1.83%       |

# User Guide

**Environment Setup**

| Accelerator Card Driver Version | Driver Version:  4.4.0 |
| ------------------------------- | ---------------------- |
| IX-ML                           | Version: 4.4.0         |
| FlagGems                        | Version: 4.2.0         |

## Operation Steps

### Download FlagOS Image
```
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-iluvatar-release-model_minicpm-o-45-tree_none-gems_4.2.0-scale_none-cx_none-python_3.12.11-torch_2.7.1_corex.4.4.0-pcp_ix-ml4.4.0-gpu_iluvatar001-arc_amd64-driver_4.4.0:latest
```

### Download Open-source Model Weights

``` shell
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-o-4.5-iluvatar-FlagOS --local_dir /share/MiniCPMO45
```

### Start the Container

```bash
#Container Startup
docker run --shm-size="32g" -itd --privileged --cap-add=ALL --pid=host --net=host -v /share:/share --name flagos harbor.baai.ac.cn/flagrelease-public/flagrelease-iluvatar-release-model_minicpm-o-45-tree_none-gems_4.2.0-scale_none-cx_none-python_3.12.11-torch_2.7.1_corex.4.4.0-pcp_ix-ml4.4.0-gpu_iluvatar001-arc_amd64-driver_4.4.0:latest

docker exec -it flagos bash
```

## User Reference

MiniCPM-o-4.5 is a model that supports Omni-input and offers a wide range of usage scenarios. FlagRelease only provides migration results of the FlagOS software ecosystem across various chips and does not impose any restrictions on how users choose to utilize the model. You are encouraged to refer to the official OpenBMB README for flexible and comprehensive usage guidance. That said, we do provide a basic example: performing video-based question answering with spoken audio output.

```
cd /root
ln -s /share/MiniCPMO45/ ./MiniCPMO45
python3 openbmb_main.py
```

# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support

# License

The weight files are from https://github.com/OpenBMB/MiniCPM-o, open source with apache2.0 licensehttps://www.apache.org/licenses/LICENSE-2.0.txt.
