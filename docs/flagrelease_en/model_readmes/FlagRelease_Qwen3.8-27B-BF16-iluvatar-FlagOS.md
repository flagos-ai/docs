---
license: apache-2.0
language:
- zh
- en
---

# Introduction
Alibaba open‑sources the vision‑language model Qwen3.8‑27B, and the Zhongzhi (众智) FlagOS community simultaneously completes Day 0 multi‑chip adaptation; based on the FlagOS unified open‑source technology stack, Qwen3.8‑27B has finished multi‑chip adaptation, precision alignment and deployment verification across 11 AI chips including T-Head（平头哥）、NVIDIA（英伟达）、Moore Threads（摩尔线程）、MetaX（沐曦）、Kunlunxin（昆仑芯）、Ascend（华为昇腾）、Hygon（海光）、Iluvatar CoreX（天数智芯）、Tsingmicro（清微智能）、Enflame（燧原科技）and Sunrise（曦望）, among which NVIDIA and Moore Threads support FP8 precision deployment while the rest run on BF16, and FlagOS has for the first time extended the adaptation of the latest Qwen model to ARM edge‑side platforms with a W4A8 low‑bit version, enabling developers to directly obtain corresponding out‑of‑the‑box solutions.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Iluvatar** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics | Qwen3.8-27B-Nvidia-Origin | Qwen3.8-27B-Iluvatar-FlagOS |
|--------------|---------------------------|-----------------------------|
| musr_murder_mysteries| 76.8                      | Evaluating                  |
| GPQA_Diamond | 90.4                      | 87.37                       |


# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 20.10.25, build 20.10.25-0ubuntu1~20.04.1 |
| Operating System | Ubuntu 20.04.6 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-qwen3.8-iluvatar-tree_none-gems_5.0.0-vllm_0.20.0-plugin_main-cx_none-python_3.12.11-torch_2.10.0_corex.4.5.0-pcp_ixml4.4.0-gpu_iluvatar001-arc_amd64-driver_4.5.0:202608141637
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.8-27B-BF16-iluvatar-FlagOS --local_dir /data/Qwen3.8-27B
```

### Start the Container
```bash
IMAGE="harbor.baai.ac.cn/flagrelease-public/flagrelease-qwen3.8-iluvatar-tree_none-gems_5.0.0-vllm_0.20.0-plugin_main-cx_none-python_3.12.11-torch_2.10.0_corex.4.5.0-pcp_ixml4.4.0-gpu_iluvatar001-arc_amd64-driver_4.5.0:202608141637" 
# 对应plugin-FL 分支 ilvita-int8-main
docker run -d --rm --network host --privileged --ipc=host \
    -v /dev:/dev -v /lib/modules:/lib/modules \
    -v /sys:/sys -v /data:/data -v /mnt:/mnt -v /mnt/share/models/:/models -w /workspace \
    --name vllm_qwen38_27b -it ${IMAGE}
docker exec -it vllm_qwen38_27b  bash

```
### Start the Server
```bash
# 单机35B
export VLLM_PLUGINS=fl
export CUDA_VISIBLE_DEVICES=8,9,10,11,12,13,14,15
export VLLM_ENGINE_ITERATION_TIMEOUT_S=72000
export VLLM_RPC_TIMEOUT=72000000
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=7200
MODEL="/data/Qwen3.8-27B"
MODEL_NAME="qwen-38-27b"
PORT="8077"
TP=8 # benchmark 性能时换成4卡 评测指标用8卡 可以开更高并发

vllm serve ${MODEL} \
    --tensor-parallel-size ${TP} \
    --served-model-name ${MODEL_NAME} \
    --chat-template ${MODEL}/chat_template.jinja \
    --port ${PORT} \
    --enforce-eager \
    --trust-remote-code | tee -a /models/server_test.log
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8077/v1/models
curl http://localhost:8077/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{
  "model": "qwen-38-27b",
  "messages": [{"role": "user", "content": "中国的首都是哪里？"}],
  "temperature": 0.7,
  "max_tokens": 1024,
  "chat_template_kwargs": {     
     "enable_thinking": false   
  }
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
**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a "develop once, run anywhere" workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of \<chip + open-source model\>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.
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
The model weights are derived from Qwen/Qwen3.8-27B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

