---
frameworks:
- ""
language:
- zh
- en
license: apache-2.0
tasks: []
---
# Introduction
ERNIE-4.5-0.3B-PT is a lightweight foundational LLM from Baidu Wenxin series. This release is fully adapted to Ascend910 NPU with FlagGems acceleration stack. Precompiled Triton cache, FlagGems operator logs and benchmark test data are embedded in the environment. It supports out-of-the-box vLLM inference via vllm-plugin-FL, with obvious throughput improvement compared with native PyTorch implementation on Ascend hardware.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Ascend** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.


# Evaluation Results
## Benchmark Result
| Metrics             | ERNIE-4.5-0.3B-PT-Nvidia-Origin| ERNIE-4.5-0.3B-PT-Ascend-FlagOS      |
|---------------------|--------------------------------|--------------------------------------|
| musr_generative     | 0.377                          | 0.3743                               |
| mmlu_pro            | 0.1737                         | 0.1752                               |
| gpqa_generative_cot | 0.25                           | 0.2466                               |
| livebench_new       | 0.1495                         | 0.1534                               |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 20.10.8, build 3967b7d |
| Operating System | Linux 5.10.0-216.0.0.115.oe2203sp4.aarch64 |

## Operation Steps

### Download FlagOS Image
```bash
  docker pull harbor.baai.ac.cn/external-cooperation/ernie-4.5-0.3b-pt-ascend-tree_0.5.0_ascend3.2-gems_5.0.2-vllm_0.13.0_empty-plugin_0.1.1-cx_none-python_3.11.14-torch_2.8.0-pcp_none-npu_ascend910-arc_aarch64-driver_25.5.0:2607201512
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/ERNIE-4.5-0.3B-PT-ascend-FlagOS --local_dir /data/vllm-plugin-fl/ERNIE-4.5-0.3B-PT
```

### Start the Container
```bash
docker run -itd \
  --name ernie-4.5-0.3b-flagos \
  --network host \
  -v /data/vllm-plugin-fl:/data/vllm-plugin-fl \
  -v /usr/local/Ascend/driver:/usr/local/Ascend/driver:ro \
  -v /usr/local/sbin/npu-smi:/usr/local/sbin/npu-smi:ro \
  -v /etc/ascend_install.info:/etc/ascend_install.info:ro \
  --device=/dev/davinci0 \
  --device=/dev/davinci1 \
  --device=/dev/davinci2 \
  --device=/dev/davinci3 \
  --device=/dev/davinci4 \
  --device=/dev/davinci5 \
  --device=/dev/davinci6 \
  --device=/dev/davinci7 \
  --device=/dev/davinci_manager \
  --device=/dev/hisi_hdc \
  --device=/dev/devmm_svm \
  harbor.baai.ac.cn/external-cooperation/ernie-4.5-0.3b-pt-ascend-tree_0.5.0_ascend3.2-gems_5.0.2-vllm_0.13.0_empty-plugin_0.1.1-cx_none-python_3.11.14-torch_2.8.0-pcp_none-npu_ascend910-arc_aarch64-driver_25.5.0:2607201512 \
  sleep infinity

docker exec -it ernie-4.5-0.3b-flagos bash
```
### Start the Server
```bash
export VLLM_PLUGINS=fl
export TRITON_ALL_BLOCKS_PARALLEL=1
export USE_FLAGGEMS=1
nohup vllm serve /data/vllm-plugin-fl/ERNIE-4.5-0.3B-PT \
--served-model-name ernie-4.5-0.3b-flagos \
--port 9011 \
--tensor-parallel-size 1 \
--enforce-eager \
--trust-remote-code \
> ernie_flagos.log 2>&1 &
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:9011/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "ernie-4.5-0.3b-flagos",
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
The model weights are derived from PaddlePaddle/ERNIE-4.5-0.3B-PT and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

