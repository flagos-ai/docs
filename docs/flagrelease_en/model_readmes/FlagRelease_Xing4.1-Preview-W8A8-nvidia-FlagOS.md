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
- Released **FlagOS-Nvidia** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | Xing4.1-Preview-Nvidia-Origin | Xing4.1-Preview-Nvidia-FlagOS |
|---|---|---|
| Math-500     | 95.20                          | 94.53                                |
| GPQA_Diamond | 89.8                           | 90.31                                |
# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | H100 x8卡 |
| Docker Version | 29.1.3 |
| Operating System | Ubuntu 22.04.4 LTS |
| Driver | 580.105.08 |
| SDK | 580.105.08 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/xing4.1-preview-rl-1114-w8a8-nvidia003-gems0.0.0-treenone-cxnone-plugin0.0.0-vllm0.24.0-sglangnone-sglangflnone-cp312-pt211-cu129-x64-580.105.08:202611201406
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Xing4.1-Preview-W8A8-nvidia-FlagOS
```

### Start the Container
```bash
docker run -d \
  --name xing41-formal \
  --network host \
  --ipc host \
  --entrypoint /bin/bash \
  --device /dev/nvidia0 \
  --device /dev/nvidia1 \
  --device /dev/nvidia2 \
  --device /dev/nvidia3 \
  --device /dev/nvidia4 \
  --device /dev/nvidia5 \
  --device /dev/nvidia6 \
  --device /dev/nvidia7 \
  --device /dev/nvidiactl \
  --device /dev/nvidia-uvm \
  --device /dev/nvidia-uvm-tools \
  -v /usr/lib/x86_64-linux-gnu/libcuda.so.580.105.08:/usr/lib/x86_64-linux-gnu/libcuda.so.1:ro \
  -v /usr/lib/x86_64-linux-gnu/libnvidia-ml.so.580.105.08:/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1:ro \
  -v /usr/lib/x86_64-linux-gnu/libnvidia-ptxjitcompiler.so.580.105.08:/usr/lib/x86_64-linux-gnu/libnvidia-ptxjitcompiler.so.1:ro \
  -v /usr/lib/x86_64-linux-gnu/libnvidia-nvvm.so.580.105.08:/usr/lib/x86_64-linux-gnu/libnvidia-nvvm.so.4:ro \
  -v /data/xing41-formal/logs:/logs \
  -v /data/xing41-formal/cache:/cache \
  --mount type=bind,source=/public/models/Xing4.1-Preview-RL-1114-W8A8-FlagOS-20261119-172125,target=/models/xing41-w8a8,readonly \
  harbor.baai.ac.cn/flagrelease-public/xing4.1-preview-rl-1114-w8a8-nvidia003-gems0.0.0-treenone-cxnone-plugin0.0.0-vllm0.24.0-sglangnone-sglangflnone-cp312-pt211-cu129-x64-580.105.08:202611201406 \
  -c 'sleep infinity'
docker exec -it xing41-formal /bin/bash
```

### Start the Inference Server
```bash
export VLLM_PLUGINS=fl && \
export VLLM_FL_PREFER=flagos && \
export VLLM_FL_PREFER_ENABLED=1 && \
export USE_FLAGGEMS=1 && \
export VLLM_FL_USE_FLAGGEMS_VLLM=1 && \
export VLLM_FL_FLAGOS_WHITELIST="softmax,softmax_out,argmax,cumsum_out,bmm_out,scatter_,where_self,where_self_out,clone" && \
export FLAGGEMS_ENABLE_OPLIST_PATH=/logs/flaggems_oplist.log && \
export TRITON_CACHE_DIR=/cache/triton && \
export TORCHINDUCTOR_CACHE_DIR=/cache/inductor && \
export VLLM_CACHE_ROOT=/cache/vllm && \
export TRITON_LIBCUDA_PATH=/usr/lib/x86_64-linux-gnu && \
export LD_LIBRARY_PATH=/usr/local/nvidia/lib:/usr/local/nvidia/lib64 && \
export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True && \
nohup /usr/bin/python3 /usr/local/bin/vllm serve /models/xing41-w8a8 \
  --served-model-name xing41-w8a8 \
  --trust-remote-code \
  --reasoning-parser deepseek_v3 \
  --tensor-parallel-size 8 \
  --max-model-len 65536 \
  --gpu-memory-utilization 0.88 \
  --max-num-seqs 64 \
  --max-num-batched-tokens 16384 \
  --port 8022 \
  --host 0.0.0.0 \
  --no-enable-prefix-caching \
  --hf-overrides '{"index_topk": 2048}' \
  --compilation-config '{"cudagraph_mode":"FULL_DECODE_ONLY","max_cudagraph_capture_size":64}' \
  > /logs/vllm-serve.log 2>&1 &
```

## Service Invocation
### Invocation Script (Text)
```bash
curl -s -m 300 -X POST http://127.0.0.1:8022/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"xing41-w8a8","messages":[{"role":"user","content":"What is 27 times 27? Answer with the number only."}],"temperature":0,"max_tokens":100}'
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

