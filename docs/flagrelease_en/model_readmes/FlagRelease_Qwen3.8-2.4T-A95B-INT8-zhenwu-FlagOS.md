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
- Released **FlagOS-Zhenwu** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics | Qwen3.8-2.4T-A95B-Nvidia-Origin | Qwen3.8-2.4T-A95B-Zhenwu-FlagOS |
|--------------|---------------------------------|---------------------------------|
| GPQA_Diamond | 91.41                           | 88.08                      |
|musr_murder_mysteries | 79.2                            | 78.8                      |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 28.1.0, build 4d8c241 |
| Operating System | Ubuntu 24.04.2 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/qwen3.8-max-pp001-gems0.0-treenone-cxnone-plugin0.2.0-vllm0.24.0-cp312-pt210-hggc130-x64-1.3.2-d7f5a2:202608141049
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.8-2.4T-A95B-INT8-zhenwu-FlagOS --local_dir /data/Qwen3.8-2.4T-A95B-INT8
```

### Start the Server
```bash
#!/usr/bin/env bash

set -euo pipefail

########################################
# Usage:
# ./start_vllm.sh <NODE_RANK>
#
# Example:
#   ./start_vllm.sh 0
#   ./start_vllm.sh 1
#   ./start_vllm.sh 2
#   ./start_vllm.sh 3
########################################

NODE_RANK=${1:?Usage: ./start_vllm.sh <NODE_RANK>}

########################
# Cluster Configuration
########################

MODEL_PATH=${MODEL_PATH:-/data/Qwen3.8-2.4T-A95B-INT8}
MODEL_NAME=${MODEL_NAME:-Qwen3.8-int8-2}

NNODES=${NNODES:-2}
TP=${TP:-16}
PP=${PP:-2}

MASTER_ADDR=${MASTER_ADDR:-22.2.203.67}
MASTER_PORT=${MASTER_PORT:-29500}

HOST=${HOST:-0.0.0.0}
PORT=${PORT:-8000}

GPU_MEMORY_UTILIZATION=${GPU_MEMORY_UTILIZATION:-0.85}

########################
# Log Configuration
########################

LOG_DIR=${LOG_DIR:-./logs-qwen3.8-int8-final-2}
mkdir -p "${LOG_DIR}"

LOG_FILE="${LOG_DIR}/vllm_rank${NODE_RANK}.log"
PID_FILE="${LOG_DIR}/vllm_rank${NODE_RANK}.pid"


echo "======================================="
echo "Starting vLLM"
echo "Node Rank : ${NODE_RANK}"
echo "Master    : ${MASTER_ADDR}:${MASTER_PORT}"
echo "TP        : ${TP}"
echo "PP        : ${PP}"
echo "Log       : ${LOG_FILE}"
echo "======================================="


# Rank0 提供 HTTP 服务，其余节点 headless
SERVER_ARGS=()

if [ "${NODE_RANK}" -eq 0 ]; then
    SERVER_ARGS+=(--host "${HOST}")
    SERVER_ARGS+=(--port "${PORT}")
else
    SERVER_ARGS+=(--headless)
fi

export NCCL_MIN_NCHANNELS=16
export NCCL_NTHREADS=512 
export NCCL_IB_DISABLE=1
export NCCL_SOCKET_IFNAME=eth0
export NCCL_IB_HCA= 
export NCCL_DEBUG=INFO
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=3600
export VLLM_FL_FLAGOS_BLACKLIST=mm,mm_out,full,broadcast_to,nonzero,nonzero_numpy,linear,diff,index,mul,amax,scalar_tensor,fill_scalar_,resolve_conj,resolve_neg,floor_divide,narrow,ne_scalar,pow_scalar,fill_tensor_,clamp,unbind,round,where_self_out,where_self,scatter_,bitwise_not,index_put_,resize_,_unsafe_view,gather


CMD=(
    vllm serve "${MODEL_PATH}"
    --served-model-name "${MODEL_NAME}"
    --trust-remote-code
    --tensor-parallel-size "${TP}"
    --pipeline-parallel-size "${PP}"
    --distributed-executor-backend mp
    --disable-custom-all-reduce
    --max-num-seqs 16
    --nnodes "${NNODES}"
    --node-rank "${NODE_RANK}"
    --master-addr "${MASTER_ADDR}"
    --master-port "${MASTER_PORT}"
    --max-model-len 50000
    --distributed-timeout-seconds 1800
    --cpu-distributed-timeout-seconds 1800
    --reasoning-parser qwen3
    --gpu-memory-utilization "${GPU_MEMORY_UTILIZATION}"
    --compilation-config '{"pass_config":{"fuse_allreduce_rms":false},"cudagraph_mode":"FULL_DECODE_ONLY"}'
    "${SERVER_ARGS[@]}"
)


echo "Launching process..."

nohup "${CMD[@]}" \
    > "${LOG_FILE}" 2>&1 &


PID=$!

echo "${PID}" > "${PID_FILE}"

echo "vLLM started."
echo "PID: ${PID}"
echo "Log: ${LOG_FILE}"
```

## Service Invocation
### Invocation Script
```bash
curl http://127.0.0.1:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "中国首都是？",
    "max_tokens": 32
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
The model weights are derived from Qwen/Qwen3.8-2.4T-A95B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt


