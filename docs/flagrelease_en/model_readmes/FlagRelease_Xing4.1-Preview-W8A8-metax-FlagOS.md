---
license: apache-2.0
language:
- zh
- en
---

# Introduction
Xing4.1-Preview is an MoE model from the Xingchen Semantic Large Model family designed for agent programming and long-horizon complex tasks. It has a total parameter count of 285B with approximately 17B parameters activated per token and natively supports a 1M context window. Adopting MLA for compressed KV representation and DSA sparse attention, the model uses a 45-layer Transformer backbone, 42 of which are MoE layers. For each token, it selects 8 experts out of 256 routed experts together with 1 shared expert. For practical applications, it supports thinking mode switching, tool calling and structured output, and can be applied to multi-step office workflows, in-depth research, code generation and document-intensive business scenarios. The Xing 4 series was trained on fully domestic computing platforms, and this FlagOS adaptation further broadens the inference deployment options for Xing4.1-Preview.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Metax** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | Xing4.1-Preview-Nvidia-Origin | Xing4.1-Preview-Metax-FlagOS |
|---|---|---|
| Math-500     | 95.20                          | 91.92                                |
| GPQA_Diamond | 89.8                           | 87.38                                |
# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | MetaX C550 x8卡 |
| Docker Version | 29.1.3 |
| Operating System | Ubuntu 22.04.5 LTS (kernel 5.15.0-119-generic) |
| Driver | 3.8.1 (mx-smi 2.3.1) |
| SDK | MACA 3.8.1.3 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/xing4.1-preview-thead001-gems5.5.0-tree0.7.0-cxnone-plugin0.3.0-vllm0.32.0-sglangnone-sglangflnone-cp312-pt210-hggcnone-x64-none:202611241536
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Xing4.1-Preview-W8A8-metax-FlagOS
```

### Start the Container
```bash
docker run -itd \
    --name xing4.1-preview \
    --privileged \
    --ipc=host \
    --network=host \
    --shm-size 64g \
    --device /dev/dri:/dev/dri:rwm \
    --device /dev/mxcd:/dev/mxcd:rwm \
    -v /public-flash:/public-flash \
    -v /data:/data \
    -w /public-flash \
    harbor.baai.ac.cn/flagrelease-public/xing4.1-preview-thead001-gems5.5.0-tree0.7.0-cxnone-plugin0.3.0-vllm0.32.0-sglangnone-sglangflnone-cp312-pt210-hggcnone-x64-none:202611241536
docker exec -it xing4.1-preview /bin/bash
```

### Start the Inference Server
```bash
export VLLM_FL_FLAGOS_BLACKLIST=masked_fill,masked_fill_,linear,mm,bmm,mm_out,bmm_out,add,clamp,abs,neg,round,true_divide,stack,to_copy
/opt/conda/bin/python3.12 /opt/conda/bin/vllm serve /public-flash/models/Xing4.1-Preview-RL-1114-W8A8-FlagOS-20261119-172125 \
  --served-model-name Xing4.1-Preview \
  --tokenizer-mode hf \
  --default-chat-template-kwargs '{"enable_thinking": true}' \
  --host 0.0.0.0 \
  --port 8000 \
  --api-server-count 1 \
  --dtype bfloat16 \
  --tensor-parallel-size 4 \
  --data-parallel-size 2 \
  --data-parallel-size-local 2 \
  --enable-expert-parallel \
  --all2all-backend allgather_reducescatter \
  --block-size 64 \
  --max-model-len 65536 \
  --max-num-seqs 64 \
  --max-num-batched-tokens 4096 \
  --gpu-memory-utilization 0.90 \
  --compilation-config '{"cudagraph_mode":"FULL_DECODE_ONLY"}' \
  --enable-prefix-caching

```

## Service Invocation
### Invocation Script (Text)
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Xing4.1-Preview",
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
The model weights are derived from Xing4.1-Preview and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

