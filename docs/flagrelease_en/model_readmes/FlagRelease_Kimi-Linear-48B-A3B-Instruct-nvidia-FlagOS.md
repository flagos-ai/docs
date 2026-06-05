# Introduction
Kimi-Linear-48B-A3B-Instruct is a high-efficiency large language model developed by MoonshotAI. Built with an innovative hybrid linear attention architecture and equipped with 48B total parameters, it is specially optimized for long-context comprehension, multi-turn dialogue and complex reasoning scenarios, supporting an ultra-long context window up to 1 million tokens.

Adopting a 3:1 structural ratio of Kimi Delta Attention and global MLA, this model greatly cuts down KV cache occupancy and improves inference throughput while maintaining strong comprehensive capability. It achieves outstanding results on multiple authoritative benchmarks, natively compatible with Transformers and vLLM frameworks, and can be quickly deployed for long document parsing, knowledge question answering and industrial intelligent conversation services.


### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Nvidia** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics             | Kimi-Linear-48B-A3B-Instruct-nvidia-FlagOS-Nvidia-Origin | Kimi-Linear-48B-A3B-Instruct-nvidia-FlagOS-Nvidia-FlagOS |
|---------------------|----------------------------------------------------------|--------------------------------------|
| aime                | 0.4667                                                   | 0.4667                               |
| musr_generative     | 0.5926                                                   | 0.5635                               |
| mmlu_pro            | 0.515                                                    | 0.5315                               |
| gpqa_generative_cot | 0.4295                                                   | 0.4295                               |
| livebench_new       | 0.5438                                                   | 0.5178                               |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 24.0.0, build 98fdcd7 |
| Operating System | 22.04.4 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/external-cooperation/kimi-linear-48b-a3b-instruct-nvidia-tree_0.5.0_3.5-gems_5.0.2-vllm_0.13.0-plugin_0.1-cx_none-python_3.12.3-torch_2.9.0_cu128-pcp_cuda12.8-gpu_nvidia003-arc_amd64-driver_570.158.01:2605110300
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Kimi-Linear-48B-A3B-Instruct-nvidia-FlagOS --local_dir /data/Kimi-Linear-48B-A3B-Instruct-nvidia-FlagOS
```

### Start the Container
```bash
docker run -itd --name=xxx --gpus=all --network=host -v /data:/data harbor.baai.ac.cn/external-cooperation/kimi-linear-48b-a3b-instruct-nvidia-tree_0.5.0_3.5-gems_5.0.2-vllm_0.13.0-plugin_0.1-cx_none-python_3.12.3-torch_2.9.0_cu128-pcp_cuda12.8-gpu_nvidia003-arc_amd64-driver_570.158.01:2605110300 sleep infinity

docker exec -it xxx  bash
```
### Start the Server
```bash
export VLLM_PLUGINS=fl
export TRITON_ALL_BLOCKS_PARALLEL=1
nohup vllm serve \
--model /data/Kimi-Linear-48B-A3B-Instruct/ \
--served-model-name kimi-linear \
--host 0.0.0.0 \
--port 6677 \
--trust-remote-code \
--tensor-parallel-size 2 \
--enforce-eager \
> kimi-flagos.log 2>&1 &

tail -f imi-flagos.log
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "flagOS",
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
The model weights are derived from /data/vllm-plugin-fl/Kimi-Linear-48B-A3B-Instruct and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
