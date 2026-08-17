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
Seed-OSS is a series of open-source large language models developed by ByteDance's Seed Team, designed for powerful long-context, reasoning, agent and general capabilities, and versatile developer-friendly features. Although trained with only 12T tokens, Seed-OSS achieves excellent performance on several popular open benchmarks.
We release this series of models to the open-source community under the Apache-2.0 license.
Key Features
    Flexible Control of Thinking Budget: Allowing users to flexibly adjust the reasoning length as needed. This capability of dynamically controlling the reasoning length enhances inference efficiency in practical application scenarios.
    Enhanced Reasoning Capability: Specifically optimized for reasoning tasks while maintaining balanced and excellent general capabilities.
    Agentic Intelligence: Performs exceptionally well in agentic tasks such as tool-using and issue resolving.
    Research-Friendly: Given that the inclusion of synthetic instruction data in pre-training may affect the post-training research, we released pre-trained models both with and without instruction data, providing the research community with more diverse options.
    Native Long Context: Trained with up-to-512K long context natively.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Ascend** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.


# Evaluation Results
## Benchmark Result
| Metrics             | ByteDance-Seed/Seed-OSS-36B-Instruct-Nvidia-Origin | ByteDance-Seed/Seed-OSS-36B-Instruct-Ascend-FlagOS |
|---------------------|----------------------------------------------------|----------------------------------------------------|
| gpqa_generative_cot |  0.6149                                            |  0.6414                                            |
| aime                |  0.6667                                            |  0.7667                                            |
| musr_generative     |  0.4167                                            |  0.3902                                            |
| livebench_new       |  0.5115                                            |  0.5246                                            |
| mmlu_pro            |  0.4886                                            |  0.4932                                            |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 20.10.8, build 3967b7d |
| Operating System | Linux 5.10.0-216.0.0.115.oe2203sp4.aarch64 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/external-cooperation/seed-oss-36b-instruct-ascend-tree_0.5.0-ascend3.2-gems_0.5.2-vllm_0.13.0-empty-plugin_0.1.1-cx_none-python_3.11.14-torch_2.8.0-pcp_none-npu_ascend910c-arc_aarch64-driver_25.5.0:2607100123
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Seed-OSS-36B-Instruct-ascend-FlagOS --local_dir /data/Seed-OSS-36B-Instruct-ascend-FlagOS
```

### Start the Container
```bash
docker run -itd \
  --name=seed-oss-36b-flagos \
  --network=host \
  --privileged \
  -v /data/Seed-OSS-36B-Instruct-ascend-FlagOS:/data/Seed-OSS-36B-Instruct-ascend-FlagOS \
  -v /usr/local/Ascend/driver:/usr/local/Ascend/driver \
  -v /usr/local/sbin/npu-smi:/usr/local/sbin/npu-smi \
  --device=/dev/davinci0 \
  --device=/dev/davinci1 \
  --device=/dev/davinci2 \
  --device=/dev/davinci3 \
  --device=/dev/davinci4 \
  --device=/dev/davinci5 \
  --device=/dev/davinci6 \
  --device=/dev/davinci7 \
  --device=/dev/davinci_manager \
  --device=/dev/devmm_svm \
  --device=/dev/hisi_hdc \
  harbor.baai.ac.cn/external-cooperation/seed-oss-36b-instruct-ascend-tree_0.5.0-ascend3.2-gems_0.5.2-vllm_0.13.0-empty-plugin_0.1.1-cx_none-python_3.11.14-torch_2.8.0-pcp_none-npu_ascend910c-arc_aarch64-driver_25.5.0:2607100123
sudo docker exec -it seed-oss-36b-flagos bash
```
### Start the Server
```bash
export ASCEND_VISIBLE_DEVICES=14,15
export VLLM_PLUGINS=fl
export TRITON_ALL_BLOCKS_PARALLEL=1
export USE_FLAGGEMS=1
export VLLM_FL_FLAGOS_WHITELIST="pow_scalar,zero_,cos,sin,where_self,lt_scalar,le,masked_fill_"
nohup vllm serve --model /data/Seed-OSS-36B-Instruct-ascend-FlagOS/ --served-model-name seed-oss-36b-flagos --port 8000 --tensor-parallel-size 2 --trust-remote-code --max-model-len 26000 --enforce-eager >eager-seed-oss-gems.log 2>&1 &
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "seed-oss-36b-flagos",
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
The model weights are derived from unsloth/Seed-OSS-36B-Instruct and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

