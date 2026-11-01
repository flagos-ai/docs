---
license: apache-2.0
language:
- zh
- en
---

# Introduction
MiniMax has released MiniMax-M3.1-Flash, its new-generation Flash model. Zhongzhi FlagOS Community has completed Day-0 cross-chip enablement across platforms from nine chip vendors — T-Head, NVIDIA, Huawei Ascend, Hygon, Kunlunxin, MetaX, Moore Threads, Tsingmicro(清微智能) and Iluvatar CoreX — and developers can download and use the model via ModelScope and Hugging Face. Thanks to optimizations in FlagOS 2.2, benchmarks show that on NVIDIA H100 the FlagOS build delivers, out of the box, up to 59.2% lower first-token latency and up to 10.6% higher output throughput than NVIDIA's native stack. With 32K-token inputs, the FlagOS builds on T-Head, Huawei Ascend, Kunlunxin and other platforms reach throughput per unit of compute equal to 165.0%, 99.5% and 85.9% of NVIDIA's native performance — results ranging from close to parity to well above it. The model brings further gains in agent tasks, coding, computer use and cybersecurity, supporting use cases such as complex business processes, software development and operations across applications. It uses a more aggressive sparse-attention architecture to further improve inference efficiency. According to MiniMax, it delivers 200+ tokens/s in everyday use and cuts the total cost of agentic tasks by 70% versus the previous generation.


### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Nvidia** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniMax-M3.1-Flash-Nvidia-Origin | MiniMax-M3.1-Flash-Nvidia-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| Math_500     | 93.40                            | 92.80                                |
| GPQA_Diamond | 88.89                            | 89.39                                |
| ERQA         | 65.75                            | 64.25                                |
## Serving Performance (source configuration)

| Input / output tokens | Concurrency | Output tokens/s | Total tokens/s | Mean TTFT (ms) | Mean TPOT (ms) |
|---|---:|---:|---:|---:|---:|
| 16384 / 1024 | 64 | 905.90 | 15400.23 | 26306.14 | 36.29 |

R1 was warmup; values are the arithmetic means of R2/R3, each with 128 successful requests and an independent seed per request. The published image passed digest re-pull and CPU verification of 839 source files and its frozen settings. GPU serving was not rerun after packaging.

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | 20.10.5 |
| Operating System | Ubuntu 22.04.4 LTS |
| GPU | 8 × NVIDIA H100 80GB |
| NVIDIA Driver | 580.126.20 |
| CUDA Runtime | 12.9 |
| Python | 3.12.3 |
| PyTorch | 2.13.0+cu129 |
| vLLM | 0.28.0+cu129 |
| vllm-plugin-fl | 0.4.0.dev0+gdf2488c |
| FlagGems | 5.4.1.dev0+gb5d988e.oai6 |
| FlagTree | 0.7.0+gite86aa7cf |
| FlagCX | Not installed |


## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_minimax-m3.1-flash-tree_0.7.0.gite86aa7cf-gems_5.4.1.dev0.gb5d988e.oai6-cx_none-python_3.12.3-torch_cuda-2.13.0.cu129-pcp_cuda12.9-gpu_nvidia004-arc_amd64-driver_580.126.20:202610221753
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniMax-M3.1-Flash-W8A8-nvidia-FlagOS-Express --local_dir /data/MiniMax-M3.1-Flash
```
Use the MiniMax-M3.1-Flash **W8A8** checkpoint used for validation. This container release does not publish a separate model-weight repository. Set the host path before starting the container; the validated host uses:
```bash
export M31_MODEL_DIR=/data/yjwu/m31-028-oai4/checkpoint-20261019
```

### Start the Container
```bash
docker run -dit --name minimax-m31-flagrelease \
  --gpus all --network host --ipc host --shm-size 64g \
  --mount type=bind,source="$M31_MODEL_DIR",target=/model,readonly \
  -v minimax-m31-cache:/var/cache/minimax \
  --entrypoint /bin/bash \
  harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_minimax-m3.1-flash-tree_0.7.0.gite86aa7cf-gems_5.4.1.dev0.gb5d988e.oai6-cx_none-python_3.12.3-torch_cuda-2.13.0.cu129-pcp_cuda12.9-gpu_nvidia004-arc_amd64-driver_580.126.20:202610221753

docker exec -it minimax-m31-flagrelease /bin/bash
```
### Start the Server
```bash
python3 /opt/minimax/launch.py
```

## Service Invocation
### Invocation Script
```bash
curl http://127.0.0.1:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"MiniMax-M3.1-W8A8-FlagOS","messages":[{"role":"user","content":"你好"}],"max_tokens":64,"seed":42}'
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
The model weights are derived from MiniMaxAI/MiniMax-M3.1-Flash and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
