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
- Released **FlagOS-Hygon** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | Xing4.1-Preview-Nvidia-Origin | Xing4.1-Preview-Hygon-FlagOS |
|---|---|---|
| Math-500     | 95.20                          | 96.20                                |
| GPQA_Diamond | 89.8                           | 90.58                                |
# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | DCU BW1000 x16卡 |
| Docker Version | 27.3.1 |
| Operating System | Ubuntu 22.04 LTS |
| Driver | 6.3.30-V1.4.1a |
| SDK | DTK 25.04.4 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/xing4.1-preview-hygon001-gems5.4.0-tree0.7.0-cxnone-plugin0.3.0-vllm0.24.0-sglangnone-sglangflnone-cp310-pt210-dtk2604-x64-none:202611232024
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Xing4.1-Preview-BF16-hygon-FlagOS
```

### Start the Container
```bash
docker run -d \
  --name xing41-formal-headless \
  --network host --ipc host \
  --device /dev/kfd --device /dev/dri --device /dev/infiniband \
  --cap-add IPC_LOCK --cap-add SYS_RESOURCE --cap-add SYS_ADMIN \
  --ulimit memlock=-1 --ulimit nofile=65536 \
  --shm-size 64g \
  -e MASTER_ADDR=10.232.2.30 -e MASTER_PORT=31886 -e NODE_RANK=1 \
  -e VLLM_HOST_IP=10.232.2.31 \
  -v /opt/hyhal:/opt/hyhal \
  -v /public-flash/models:/public-flash/models \
  -v /sys/class/infiniband:/sys/class/infiniband \
  -v /data/xing41-formal-headless/logs:/logs \
  -v /data/xing41-formal-headless/cache:/cache \
  --entrypoint /bin/bash \
  harbor.baai.ac.cn/flagrelease-public/xing4.1-preview-hygon001-gems5.4.0-tree0.7.0-cxnone-plugin0.3.0-vllm0.24.0-sglangnone-sglangflnone-cp310-pt210-dtk2604-x64-none:202611232024 -c 'source /opt/dtk/env.sh 2>/dev/null; exec sleep infinity'
docker exec -it xing41-formal-headless /bin/bash

docker run -d \
  --name xing41-formal \
  --network host --ipc host \
  --device /dev/kfd --device /dev/dri --device /dev/infiniband \
  --cap-add IPC_LOCK --cap-add SYS_RESOURCE --cap-add SYS_ADMIN \
  --ulimit memlock=-1 --ulimit nofile=65536 \
  --shm-size 64g \
  -e MASTER_ADDR=10.232.2.30 -e MASTER_PORT=31886 -e NODE_RANK=0 \
  -e VLLM_HOST_IP=10.232.2.30 \
  -v /opt/hyhal:/opt/hyhal \
  -v /public-flash/models:/public-flash/models \
  -v /sys/class/infiniband:/sys/class/infiniband \
  -v /data/xing41-formal/logs:/logs \
  -v /data/xing41-formal/cache:/cache \
  --entrypoint /bin/bash \
  harbor.baai.ac.cn/flagrelease-public/xing4.1-preview-hygon001-gems5.4.0-tree0.7.0-cxnone-plugin0.3.0-vllm0.24.0-sglangnone-sglangflnone-cp310-pt210-dtk2604-x64-none:202611232024 -c 'source /opt/dtk/env.sh 2>/dev/null; exec sleep infinity'
```

### Start the Inference Server

```bash
# node 1
docker exec -d xing41-formal bash -c '
export GEMS_VENDOR=hygon VLLM_PLUGINS=fl USE_FLAGGEMS=1
export VLLM_FL_USE_FLAGGEMS_VLLM=1 VLLM_FL_PREFER=flagos
export HIP_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export NCCL_IB_DISABLE=0 NCCL_IB_HCA=shca_0,shca_1,shca_2,shca_3
export NCCL_SOCKET_IFNAME=bond1 GLOO_SOCKET_IFNAME=bond1
export NCCL_NET_PLUGIN=/opt/rccl-rdma-sharp-plugins/lib/librccl-net.so
export LD_LIBRARY_PATH=/opt/rccl-rdma-sharp-plugins/lib:/opt/dtk/lib:$LD_LIBRARY_PATH
export TRITON_CACHE_DIR=/cache/triton XDG_CACHE_HOME=/cache
export VLLM_CACHE_ROOT=/cache/vllm TORCHINDUCTOR_CACHE_DIR=/cache/inductor
export VLLM_WORKER_MULTIPROC_METHOD=spawn
setsid nohup /usr/bin/python3 /usr/local/bin/vllm serve /public-flash/models/Xing4.1-Preview \
  --served-model-name Xing4.1-Preview --trust-remote-code --tokenizer-mode hf \
  --chat-template /public-flash/models/Xing4.1-Preview/chat_template.jinja \
  --dtype bfloat16 --max-model-len 65536 \
  --compilation-config "{\"mode\":3,\"cudagraph_mode\":\"FULL_AND_PIECEWISE\",\"cudagraph_capture_sizes\":[1,2,4,8,16,32,64],\"max_cudagraph_capture_size\":64,\"cudagraph_num_of_warmups\":3}" \
  --tensor-parallel-size 8 --pipeline-parallel-size 2 --distributed-executor-backend mp \
  --nnodes 2 --node-rank "${NODE_RANK}" --master-addr "${MASTER_ADDR}" --master-port "${MASTER_PORT}" \
  --host 0.0.0.0 --port 30120 --block-size 64 \
  --gpu-memory-utilization 0.85 --max-num-seqs 64 --max-num-batched-tokens 4160 \
  --reasoning-parser deepseek_v3 \
  > /logs/serve.log 2>&1 < /dev/null &'
```

```bash
# node 2
docker exec -d xing41-formal-headless bash -c '
export GEMS_VENDOR=hygon VLLM_PLUGINS=fl USE_FLAGGEMS=1
export VLLM_FL_USE_FLAGGEMS_VLLM=1 VLLM_FL_PREFER=flagos
export HIP_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export NCCL_IB_DISABLE=0 NCCL_IB_HCA=shca_0,shca_1,shca_2,shca_3
export NCCL_SOCKET_IFNAME=bond1 GLOO_SOCKET_IFNAME=bond1
export NCCL_NET_PLUGIN=/opt/rccl-rdma-sharp-plugins/lib/librccl-net.so
export LD_LIBRARY_PATH=/opt/rccl-rdma-sharp-plugins/lib:/opt/dtk/lib:$LD_LIBRARY_PATH
export TRITON_CACHE_DIR=/cache/triton XDG_CACHE_HOME=/cache
export VLLM_CACHE_ROOT=/cache/vllm TORCHINDUCTOR_CACHE_DIR=/cache/inductor
export VLLM_WORKER_MULTIPROC_METHOD=spawn
setsid nohup /usr/bin/python3 /usr/local/bin/vllm serve /public-flash/models/Xing4.1-Preview \
  --served-model-name Xing4.1-Preview --trust-remote-code --tokenizer-mode hf \
  --chat-template /public-flash/models/Xing4.1-Preview/chat_template.jinja \
  --dtype bfloat16 --max-model-len 65536 \
  --compilation-config "{\"mode\":3,\"cudagraph_mode\":\"FULL_AND_PIECEWISE\",\"cudagraph_capture_sizes\":[1,2,4,8,16,32,64],\"max_cudagraph_capture_size\":64,\"cudagraph_num_of_warmups\":3}" \
  --tensor-parallel-size 8 --pipeline-parallel-size 2 --distributed-executor-backend mp \
  --nnodes 2 --node-rank "${NODE_RANK}" --master-addr "${MASTER_ADDR}" --master-port "${MASTER_PORT}" \
  --host 0.0.0.0 --port 30120 --block-size 64 \
  --gpu-memory-utilization 0.85 --max-num-seqs 64 --max-num-batched-tokens 4160 \
  --reasoning-parser deepseek_v3 --headless \
  > /logs/serve.log 2>&1 < /dev/null &'
```

## Service Invocation
### Invocation Script (Text)
```bash
curl -s --max-time 500 http://127.0.0.1:30120/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"Xing4.1-Preview","messages":[{"role":"user","content":"The capital of France is"}],"max_tokens":300,"temperature":0,"chat_template_kwargs":{"enable_thinking":true}}'
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

