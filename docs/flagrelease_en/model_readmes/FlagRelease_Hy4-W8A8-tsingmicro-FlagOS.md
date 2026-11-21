---
license: apache-2.0
language:
- zh
- en
---

# Introduction
Tencent Hunyuan officially open-sources its multimodal model Hy4. The FlagOS community, building on FlagOS's unified multi-chip software stack, completed Day-0 cross-chip adaptation, covering platforms from 9 chip vendors—Hygon, Kunlunxin, T-Head (Pingtouge), NVIDIA, Huawei Ascend, MetaX, Moore Threads, Tsing Micro, and Iluvatar CoreX—and **provided** a W8A8 version of the model. Drawing on the FlagOS 2.2 software stack together with framework- and operator-level co-optimization tailored to Hy4, in a dual-node, 16-GPU, 64-concurrency test on NVIDIA platforms, the FlagOS version raised output throughput by up to 32.1% and reduced average per-token latency by up to 39.2% compared with NVIDIA's native solution. On domestic platforms such as T-Head, Huawei Ascend, Hygon, and Moore Threads, it also achieved per-unit-compute throughput approaching or exceeding that of NVIDIA's native version in some of the tested scenarios. Backed by the FlagOS technology stack, Hy4 demonstrates competitive inference efficiency across a range of chips, letting industry users flexibly choose deployment options for cutting-edge multimodal large models based on their existing compute and workloads.

Hy4 is a multimodal model released by Tencent Hunyuan for real-world productivity scenarios. Compared with **the Hy4 preview**, the official version scales up both pre-training and post-training, introduces visual understanding and computer operation capabilities for the first time, and further improves instruction following, long-text comprehension, long-horizon task execution, and deep research. The model combines image perception, reasoning, and tool use to handle complex charts, operate professional software, and serve front-end and game development, financial office work, and scientific research tasks. In the evaluations published by Tencent Hunyuan, Hy4's score on Terminal-Bench 4.0 rose from the preview's 26.3 to 44.4, and on AutomationBench v1.0.6 from 36.3 to 56.2.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Tsingmicro** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | Hy4-Nvidia-Origin | Hy4-Tsingmicro-FlagOS |
|---|---|---|
| Math-500     | 96.2                           | Evaluating                           |
| GPQA_Diamond | 93.65                          | Evaluating                           |
| mmbench      | 91.2                           | Evaluating                           |
| mmstar       | 79.67                          | Evaluating                           |
# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | TX8110 x32卡 |
| Docker Version | 29.1.3 |
| Operating System | Ubuntu 22.04.4 LTS |
| Driver | Tsm_driver_0.30279.6 |
| SDK | Tsm_driver_0.30279.6 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/hy4-w8a8-tsingmicro001-gems5.4.0-treenone-cx0.1.0-plugin0.0.0-vllm0.24.0-sglangnone-sglangflnone-cp310-pt211-raisa1.4.0-x64-v0.30279.6:202611180848
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Hy4-W8A8-tsingmicro-FlagOS
```

### Start the Container
```bash
docker run --privileged -dit --name hy4 --network host --ipc=host -v /sys:/sys -v /dev:/dev -v /lib/modules:/lib/modules -v /usr/local/kuiper/:/usr/local/kuiper/ -v /mnt/nvme_data:/mnt/nvme_data harbor.baai.ac.cn/flagrelease-public/hy4-w8a8-tsingmicro001-gems5.4.0-treenone-cx0.1.0-plugin0.0.0-vllm0.24.0-sglangnone-sglangflnone-cp310-pt211-raisa1.4.0-x64-v0.30279.6:202611180848 /bin/bash
docker exec -it hy4 /bin/bash
```

### Start the Inference Server
```bash
cd /home/hy4
source env.sh
python -u test_hy4_precision_offline.p --max-tokens 30 --tp 32 --bs 1 2>&1 | tee
offline.log
```

## Service Invocation
### Invocation Script (Text)
```bash
python -u test_hy4_precision_offline.p --max-tokens 30 --tp 32 --bs 1 2>&1 | tee
offline.log
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
The model weights are derived from Hy4 and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

