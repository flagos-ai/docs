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
Meta developed and released the Meta Llama 3 family of Large Language Models (LLMs), a suite of generative text models available in pre-trained and instruction-tuned variants with parameter sizes of 8B and 70B. The instruction-tuned Llama 3 models are optimized for dialogue scenarios and outperform many existing open-source chat models on mainstream industry benchmarks. Additionally, great emphasis was placed on enhancing model helpfulness and safety throughout the development process.
Model Developer: Meta
Variants: Llama 3 comes in two parameter sizes (8B and 70B), with both pre-trained and instruction-tuned releases available.
Input: The model only accepts text inputs.
Output: The model generates only text and code.
Model Architecture: Llama 3 is an autoregressive language model built on an optimized Transformer architecture. Its instruction-tuned variants leverage Supervised Fine-Tuning (SFT) and Reinforcement Learning from Human Feedback (RLHF) to align outputs with human preferences regarding helpfulness and safety.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.


# Evaluation Results
## Benchmark Result
| Metrics      | Meta-Llama-3-8B-Instruct-Nvidia-Origin | Meta-Llama-3-8B-Instruct-Mthreads-FlagOS |
|--------------------|----------------------------------------|------------------------------------------|
| musr_generative    |              0.4524                    |                0.4484                    |
| mmlu_pro           |              0.204                     |                0.2279                    |
| aime               |                 0                      |                     0                    |
| livebench_new      |              0.2835                    |                 0.2795                   |
| gpqa_generative_cot|              0.3154                    |                0.3003                    |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 27.5.1, build 9f9e405 |
| Operating System | 22.04.4 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/external-cooperation/meta_llama_3_8b_instruct-mthreads-tree_0.5.1-gems_5.0.2_vllm_0.13.0_plugin_0.1.0_cx_none_python_3.10.12_torch_2.7.1_pcp_musa_4.3.5_mtt_s5000_x86_64_driver_2.3.2:2608051949
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Meta-Llama-3-8B-Instruct-mthreads-FlagOS --local_dir /data/models/Meta-Llama-3-8B-Instruct-mthreads-FlagOS
```

### Start the Container
```bash
docker run -itd \
  --name=Meta-Llama-3-8B-Instruct-mthreads-FlagOS \
  --network=host \
  --pid=host \
  --ipc=host \
  --shm-size=80g \
  -v /data/models:/data/models \
  -v /dev:/dev \
  -v /usr/bin/mthreads-gmi:/usr/bin/mthreads-gmi:ro \
  -e LD_LIBRARY_PATH=/opt/musa/lib \
  -e MTHREADS_VISIBLE_DEVICES=all \
  harbor.baai.ac.cn/external-cooperation/meta_llama_3_8b_instruct-mthreads-tree_0.5.1-gems_5.0.2_vllm_0.13.0_plugin_0.1.0_cx_none_python_3.10.12_torch_2.7.1_pcp_musa_4.3.5_mtt_s5000_x86_64_driver_2.3.2:2608051949 \
  sleep infinity

docker exec -it Meta-Llama-3-8B-Instruct-mthreads-FlagOS bash
```
### Start the Server
```bash
export VLLM_PLUGINS=fl
export TRITON_ALL_BLOCKS_PARALLEL=1 
export USE_FLAGGEMS=1
nohup vllm serve /data/models/Meta-Llama-3-8B-Instruct-mthreads-FlagOS \
  --served-model-name Meta-Llama-3-8B-Instruct-mthreads-FlagOS \
  --port 8888 \
  --max-num-batched-tokens 2048 \
  --enforce-eager \
  > serve.log 2>&1 &
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8888/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Meta-Llama-3-8B-Instruct-mthreads-FlagOS",
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
The model weights are derived from LLM-Research/Meta-Llama-3-8B-Instruct and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
