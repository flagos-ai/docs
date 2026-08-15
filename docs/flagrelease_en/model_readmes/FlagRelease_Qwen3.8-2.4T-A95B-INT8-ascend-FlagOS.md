---
base_model:
- ""
frameworks:
- ""
language:
- zh
- en
license: apache-2.0
---

# Introduction
Alibaba open-sources the ultra-large-scale MoE model Qwen3.8-2.4T-A95B, with the FlagOS Community simultaneously completing Day0 multi-chip adaptation. Qwen3.8-2.4T-A95B has completed multi-chip adaptation, precision alignment, and  deployment verification based on the FlagOS unified open-source technology stack on 10 AI chips including Alibaba T-Head, NVIDIA, Moore Threads, Huawei Ascend, Metax, Kunlunxin, Hygon, Tianshu Zhixin, Tsingmicro, and Enflame. The model provides multiple precision versions including BF16, FP8, and INT8 tailored to different chip configurations, allowing developers to directly access ready-to-use solutions for their respective chips.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Ascend** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics | Qwen3.8-2.4T-A95B-INT8-Nvidia-Origin | Qwen3.8-2.4T-A95B-INT8-Ascend-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| GPQA_Diamond | 91.41                           | 92.42                                |
|musr_murder_mysteries | 79.2| 80.8                                 |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 25.0.3, build 4debf41 |
| Operating System | Linux 4.19.90-2102.2.0.0068.3.ctl2.aarch64 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/sglang-plugin-fl-qwen3.8-ascend001-gems5.3.0-treenone-cx0.13.0-pluginnone-vllmnone-cp311-ptnpu28-cann85-a64-25.5.0:202608122129
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.8-2.4T-A95B-INT8-ascend-FlagOS --local_dir /data/Qwen3.8-2.4T-A95B-INT8
```

### Start the Container
```bash
docker run -dit \
    --name flagos \
    --privileged \
    --init \
    --network=host --ipc=host --shm-size=512g \
    --device=/dev/davinci0 --device=/dev/davinci1 --device=/dev/davinci2 --device=/dev/davinci3 \
    --device=/dev/davinci4 --device=/dev/davinci5 --device=/dev/davinci6 --device=/dev/davinci7 \
    --device=/dev/davinci8 --device=/dev/davinci9 --device=/dev/davinci10 --device=/dev/davinci11 \
    --device=/dev/davinci12 --device=/dev/davinci13 --device=/dev/davinci14 --device=/dev/davinci15 \
    --device=/dev/davinci_manager \
    --device=/dev/hisi_hdc \
    --volume /usr/local/sbin:/usr/local/sbin \
    --volume /usr/local/Ascend/driver:/usr/local/Ascend/driver \
    --volume /usr/local/Ascend/firmware:/usr/local/Ascend/firmware \
    --volume /etc/ascend_install.info:/etc/ascend_install.info \
    --volume /var/queue_schedule:/var/queue_schedule \
    -v /data:/data\
    -v /etc/localtime:/etc/localtime:ro \
    -v /etc/timezone:/etc/timezone:ro \
    -e TZ=$(cat /etc/timezone 2>/dev/null || echo Asia/Shanghai) \
    --entrypoint=bash \
harbor.baai.ac.cn/flagrelease-public/sglang-plugin-fl-qwen3.8-ascend001-gems5.3.0-treenone-cx0.13.0-pluginnone-vllmnone-cp311-ptnpu28-cann85-a64-25.5.0:202608122129
docker exec -it flagos /bin/bash
```
### Start the Server
```bash
source /usr/local/Ascend/ascend-toolkit/set_env.sh
source /usr/local/Ascend/nnal/atb/set_env.sh

export ASCEND_RT_VISIBLE_DEVICES=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
export ASCEND_LAUNCH_BLOCKING=0 STREAMS_PER_DEVICE=32
export SGLANG_ALLOW_OVERWRITE_LONGER_CONTEXT_LEN=1

export SGLANG_FL_FLAGOS_BLACKLIST=argmax,index_put_,_index_put_impl_,index_select,max,sum,fill_scalar_,index,floor_divide,count_nonzero,conv1d,conv2d
export SGLANG_FL_PER_OP=silu_and_mul=flagos SGLANG_FL_PREFER=vendor

export ATB_STREAM_SYNC_EVERY_RUNNER_ENABLE=0 ATB_STREAM_SYNC_EVERY_KERNEL_ENABLE=0
export ATB_STREAM_SYNC_EVERY_OPERATION_ENABLE=0
export SGLANG_NPU_USE_MULTI_STREAM=0 ATB_COMPARE_TILING_EVERY_KERNEL=0
export ATB_OPSRUNNER_KERNEL_CACHE_LOCAL_COUNT=1
export ATB_OPSRUNNER_KERNEL_CACHE_GLOABL_COUNT=5
export ATB_MATMUL_SHUFFLE_K_ENABLE=1 ATB_WORKSPACE_MEM_ALLOC_ALG_TYPE=1

export LCCL_DETERMINISTIC=0 LCCL_PARALLEL=0
export HCCL_SOCKET_IFNAME=business HCCL_CONNECT_TIMEOUT=1200
export SGLANG_ENABLE_TP_MEMORY_INBALANCE_CHECK=0

python3.11 -m sglang.launch_server \
      --model-path /data/Qwen3.8-2.4T-A95B-INT8 \
      --served-model-name Qwen-0810-W8A8-attn-moe \
      --dtype bfloat16 --host 0.0.0.0 --trust-remote-code --port 30000 --device npu \
      --disable-radix-cache --schedule-conservativeness 0.0 \
      --max-prefill-tokens 32768 --max-running-requests 256 \
      --mem-fraction-static 0.87 --chunked-prefill-size 16384 \
      --tp-size 16 --pp-size 4 --nnodes 4 --node-rank 0 \
      --dist-init-addr 172.16.10.120:21000 --nccl-port 21011 \
      --stream-interval 4 --batch-notify-size 32 \
      --cuda-graph-bs 1 2 4 8 12 16 24 32 48 64 96 128 \
      --reasoning-parser qwen3
```

## Service Invocation
### Invocation Script
```bash
curl http://127.0.0.1:30000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "Qwen-0810-W8A8-attn-moe",
    "messages": [
      {
        "role": "user",
        "content": "你好，请介绍一下自己"
      }
    ],
    "max_tokens": 512
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
The model weights are derived from Qwen/Qwen3.8-2.4T-A95B-INT8 and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt


