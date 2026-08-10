---
frameworks:
- ""
tags:
- flagOS
- mthreads
tasks: []
---

# Introduction
Phi-3.5-MoE is a lightweight, state-of-the-art open model built upon datasets used for Phi-3 - synthetic data and filtered publicly available documents - with a focus on very high-quality, reasoning dense data. The model supports multilingual and comes with 128K context length (in tokens). The model underwent a rigorous enhancement process, incorporating supervised fine-tuning, proximal policy optimization, and direct preference optimization to ensure precise instruction adherence and robust safety measures.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.


# Evaluation Results
## Benchmark Result
| Metrics             | Phi-3.5-MoE-instruct-Nvidia-Origin | Phi-3.5-MoE-instruct-Mthreads-FlagOS |
|---------------------|------------------------------------|--------------------------------------|
|        aime         | 0.0334                             | 0                                    |
| gpqa_generative_cot | 0.3171                             | 0.3263                               |
|      mmlu_pro       | 0.5336                             | 0.5320                               |
|   musr_generative   | 0.5040                             | 0.5132                               |
|    livebench_new    | 0.2863                             | 0.2863                               |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 24.0.9, build 2936816 |
| Operating System | 22.04.4 LTS (Jammy) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/external-cooperation/phi-3.5-moe-instruct-mthreads-tree_0.5.1_mthreads3.2-gems_5.0.2-vllm_0.13.1.dev44_g3d4cc4bc7.d20260310.musa-plugin_0.1.1-cx_0.8.0-python_3.10.12-torch_2.7.1-pcp_musa4.3.5-mtt_s5000-arc_x86_64-driver_3.3.5:2608061810
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Phi-3.5-MoE-instruct-mthreads-FlagOS --local_dir /data/Phi-3.5-MoE-instruct-mthreads-FlagOS
```

### Start the Container
```bash
docker run -itd \
--name=phi-3.5-moe-instruct-mthreads-flagos \
--network=host \
--pid=host \
--ipc=host \
--shm-size=80g \
-v /data:/data \
-v /dev:/dev \
-w /workspace \
-e LD_LIBRARY_PATH=/opt/musa/lib \
-v /usr/bin/mthreads-gmi:/usr/bin/mthreads-gmi:ro \
-e MTHREADS_VISIBLE_DEVICES=all \
harbor.baai.ac.cn/external-cooperation/phi-3.5-moe-instruct-mthreads-tree_0.5.1_mthreads3.2-gems_5.0.2-vllm_0.13.1.dev44_g3d4cc4bc7.d20260310.musa-plugin_0.1.1-cx_0.8.0-python_3.10.12-torch_2.7.1-pcp_musa4.3.5-mtt_s5000-arc_x86_64-driver_3.3.5:2608061810 \
sleep infinity

docker exec -it phi-3.5-moe-instruct-mthreads-flagos bash

```
### Start the Server
```bash
export MUSA_VISIBLE_DEVICES=4,5
export VLLM_MUSA_ENABLE_MOE_MATE=1
export VLLM_MUSA_ENABLE_MOE_TRITON=1
export VLLM_PLUGINS=fl
export TRITON_ALL_BLOCKS_PARALLEL=1
export USE_FLAGGEMS=1
export VLLM_FL_FLAGOS_WHITELIST=zero_,arange,true_divide,reciprocal,cos,sin,to_copy,fill_scalar_,embedding,index_select,zeros,index,rand_like,full,argmax,lt_scalar,where_self,where_self_out,lt,cumsum_out,le,scatter,pow_scalar,mul,exponential_,moe_sum,moe_align_block_size
nohup vllm serve /data/Phi-3.5-MoE-instruct-mthreads-FlagOS \
  --served-model-name phi-3.5-moe-instruct-mthreads-flagos \
  --host 0.0.0.0 \
  --port 8230 \
  --trust-remote-code \
  --enforce-eager \
  --tensor-parallel-size 2 \
  --gpu-memory-utilization 0.9 \
  --max-model-len 30000 \
  > Phi-3.5-MoE.log 2>&1 &

```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8230/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "phi-3.5-moe-instruct-mthreads-flagos",
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
The model weights are derived from LLM-Research/Phi-3.5-MoE-instruct-mthreads-FlagOS and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

