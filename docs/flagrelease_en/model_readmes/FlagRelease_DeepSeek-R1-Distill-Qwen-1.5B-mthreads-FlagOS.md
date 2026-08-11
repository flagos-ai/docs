---
license: apache-2.0
language:
- zh
- en
---

# Introduction
We introduce our first-generation reasoning models, DeepSeek-R1-Zero and DeepSeek-R1. DeepSeek-R1-Zero is trained via large-scale reinforcement learning (RL) without supervised fine-tuning (SFT) as an initial stage, and it delivers outstanding reasoning capabilities. Through RL training, DeepSeek-R1-Zero naturally exhibits numerous powerful and intriguing reasoning behaviors.
Nevertheless, DeepSeek-R1-Zero suffers from issues such as endless repetition, poor readability, and mixed-language outputs. To address these flaws and further boost reasoning performance, we developed DeepSeek-R1, which incorporates cold-start data prior to the RL phase. DeepSeek-R1 achieves performance comparable to OpenAI o1 on mathematical, coding, and reasoning tasks.
To support the research community, we have open-sourced DeepSeek-R1-Zero, DeepSeek-R1, as well as six dense models distilled from DeepSeek-R1 based on the Llama and Qwen architectures. DeepSeek-R1-Distill-Qwen-32B outperforms OpenAI o1-mini across a wide range of benchmarks, setting a new state-of-the-art record among dense models.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | DeepSeek-R1-Distill-Qwen-1.5B-Nvidia-Origin | DeepSeek-R1-Distill-Qwen-1.5B-Mthreads-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| musr_generative | 0.3320 | 0.3294 |
| mmlu_pro | 0.1371 | 0.1397 |
| aime | 0 | 0 |
| livebench_new | 0.0949 | 0.0967 |
| gpqa_generative_cot | 0.0646 | 0.0654 |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 27.5.1, build 9f9e405 |
| Operating System | 22.04.4 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/external-cooperation/deepseek-r1-distill-qwen-1.5b-mthreads-tree_0.5.1_mthreads3.2-gems_4.2.1rc0-vllm_0.13.1.dev44_g3d4cc4bc7.d20260310.musa-plugin_0.1.1-cx_none-python_3.10.12-torch_2.7.1-pcp_musa4.3.5-mtt_s5000-arc_x86_64-driver_3.3.5:2608071332
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/DeepSeek-R1-Distill-Qwen-1.5B-mthreads-FlagOS --local_dir /data/vllm-plugin-fl/DeepSeek-R1-Distill-Qwen-1.5B
```

### Start the Container
```bash
docker run -itd --name=flagos --privileged --network=host --pid=host --ipc=host --shm-size=80g -v /data:/data -v /dev:/dev -v /usr/bin/mthreads-gmi:/usr/bin/mthreads-gmi:ro -e MTHREADS_VISIBLE_DEVICES=all harbor.baai.ac.cn/external-cooperation/deepseek-r1-distill-qwen-1.5b-mthreads-tree_0.5.1_mthreads3.2-gems_4.2.1rc0-vllm_0.13.1.dev44_g3d4cc4bc7.d20260310.musa-plugin_0.1.1-cx_none-python_3.10.12-torch_2.7.1-pcp_musa4.3.5-mtt_s5000-arc_x86_64-driver_3.3.5:2608071332 sleep infinity
docker exec -it flagos bash
```
### Start the Server
```bash
MUSA_VISIBLE_DEVICES=0 VLLM_PLUGINS=fl USE_FLAGGEMS=1 VLLM_FL_FLAGOS_WHITELIST=rotary_embedding,ones,scatter,masked_fill_,lt,gather,cumsum_out,sin,sort,le,where_self_out,softmax,where_self,exponential_,fill,argmax,sort_stable,zeros,cat vllm serve --model /data/vllm-plugin-fl/DeepSeek-R1-Distill-Qwen-1.5B --served-model-name DeepSeek-R1-Distill-Qwen-1.5B --port 46840 --enforce-eager
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:46840/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "DeepSeek-R1-Distill-Qwen-1.5B",
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
The model weights are derived from deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
