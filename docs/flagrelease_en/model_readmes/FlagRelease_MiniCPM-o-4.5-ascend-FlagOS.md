---
base_model:
- ""
frameworks:
- ""
---
# Introduction

**FlagOS** is a unified heterogeneous computing software stack for large models, co-developed with leading global chip manufacturers. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of <chip + open-source model>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.

Based on this, the **MiniCPM-o-4.5-ascend-FlagOS** model is adapted for the Hygon chip using the FlagOS software stack, enabling:

## Integrated Deployment

- Deep integration with the open-source [FlagScale framework](https://github.com/FlagOpen/FlagScale)
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Ascend** container image supporting deployment within minutes

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
Accuracy Difference between using FLAGOS and Ascend on Nvidia-CUDA

| Metrics                | Difference with Nvidia-CUDA |
| ---------------------- | ----------------------------------------------------- |
| Video-MME 0-shot avg@1 ↑  |                                  0.50%                     |

# User Guide

**Environment Setup**

| Accelerator Card Driver Version | Driver Version: 6.3.13-v1.12.0a |
| ------------------------------- | ------------------------------- |
| CANN                            | Version: 25.2.0                 |
| FlagGems                        | Version: 4.2.0                  |

## Operation Steps

### Download FlagOS Image

```Plaintext
docker pull  harbor.baai.ac.cn/flagrelease-public/flagrelease-ascend-release-model_minicpm-o-45-tree_none-gems_4.2.0-scale_none-cx_none-python_3.11.13-torch_npu2.8.0-pcp_cann8.3.0.2.220_8.3.rc2-gpu_ascend001-arc_arm64-driver_25.2.0:latest
```

### Download Open-source Model Weights

```Shell
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-o-4.5-ascend-FlagOS --local_dir /share/MiniCPMO45
```

### Start the Container

```Bash
#Container Startup
docker run -itd --name=ascend --privileged --ipc=host --network=host --shm-size=500G -w /workspace/cpmo -v /data/workspace-video-mme/video-mme:/data -v /usr/local/Ascend/driver:/usr/local/Ascend/driver -v /usr/local/Ascend/firmware:/usr/local/Ascend/firmware -v /usr/local/sbin/npu-smi:/usr/local/sbin/npu-smi -v /usr/local/dcmi:/usr/local/dcmi -v /usr/local/sbin:/usr/local/sbin -v /usr/bin/hostname:/usr/bin/hostname -v /etc/ascend_install.info:/etc/ascend_install.info -v /var/log/npu/:/usr/slog -v /etc/hccn.conf:/etc/hccn.conf -v /etc/localtime:/etc/localtime -v /etc/hosts:/etc/hosts -v /root/.cache:/root/.cache -v /share:/share harbor.baai.ac.cn/flagrelease-public/flagrelease-ascend-release-model_minicpm-o-45-tree_none-gems_4.2.0-scale_none-cx_none-python_3.11.13-torch_npu2.8.0-pcp_cann8.3.0.2.220_8.3.rc2-gpu_ascend001-arc_arm64-driver_25.2.0:latest
docker exec -it ascend bash
```

## User Reference

MiniCPM-o-4.5 is a model that supports Omni-input and offers a wide range of usage scenarios. FlagRelease only provides migration results of the FlagOS software ecosystem across various chips and does not impose any restrictions on how users choose to utilize the model. You are encouraged to refer to the official OpenBMB README for flexible and comprehensive usage guidance. That said, we do provide a basic example: performing video-based question answering with spoken audio output.

```Plaintext
cd /root/code
ln -s /share/MiniCPMO45 ./MiniCPMO45
python openbmb_main.py
```

# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support

# License

The weight files are from https://github.com/OpenBMB/MiniCPM-o, open source with apache2.0 licensehttps://www.apache.org/licenses/LICENSE-2.0.txt.
