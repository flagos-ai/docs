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
- Released **FlagOS-Kunlunxin** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | Qwen3.8-2.4T-A95B-Nvidia-Origin | Qwen3.8-2.4T-A95B-Kunlunxin-FlagOS |
|--------------|--------------------------------|------------------------------------|
| GPQA_Diamond | 91.41                           | 89.9                              |
| musr_murder_mysteries|79.2 | 78.8                               |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 28.2.2, build e6534b4 |
| Operating System | 22.04.4 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/qwen3.8-2.4t-a95b-int8-kunlunxin001-gems4.2.1-treenone-cx0.10.0-plugin0.1.0-vllm0.13.0-cp310-pt29-xrt50-x64-5.0.21.43:202608111322
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.8-2.4T-A95B-INT8-kunlunxin-FlagOS --local_dir /data/Qwen3.8-2.4T-A95B-INT8
```

### Start the Container
```bash
set -euo pipefail
IMAGE=harbor.baai.ac.cn/flagrelease-public/qwen3.8-2.4t-a95b-int8-kunlunxin001-gems4.2.1-treenone-cx0.10.0-plugin0.1.0-vllm0.13.0-cp310-pt29-xrt50-x64-5.0.21.43:202608111322
CONTAINER=${CONTAINER:-qwen38-kunlun-flagos}
MODEL_ROOT=${MODEL_ROOT:-/data}

device_args=()
for dev in /dev/xpu[0-9]* /dev/xpuctrl /dev/xdrdrv \
  /dev/infiniband/rdma_cm /dev/infiniband/uverbs* \
  /dev/infiniband/issm* /dev/infiniband/umad*; do
  [[ -e "${dev}" ]] && device_args+=(--device "${dev}:${dev}")
done

docker run -d \
  --name "${CONTAINER}" \
  --network host \
  --ipc host \
  --pids-limit=-1 \
  --shm-size=128g \
  --ulimit memlock=-1:-1 \
  -v /data:/data \
  --security-opt label=disable \
  "${device_args[@]}" \
  -e PATH=/root/.cargo/bin:/root/miniconda/envs/python310_torch29_cuda/bin:/root/miniconda/condabin:/root/miniconda/bin:/opt/xccl_Linux_x86_64/tools:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
  -e LD_LIBRARY_PATH=/root/miniconda/envs/python310_torch29_cuda/lib/python3.10/site-packages/torch_xmlir/xre/so:/root/miniconda/envs/python310_torch29_cuda/lib/python3.10/site-packages/triton/backends/xpu/xpu4/so:/root/miniconda/envs/python310_torch29_cuda/lib/python3.10/site-packages/torch_xmlir/xhpc/xblas/dependency_so:/root/miniconda/envs/python310_torch29_cuda/xcudart/lib:/opt/xccl_Linux_x86_64/so:/opt/FlagCX/build/lib:/usr/lib/x86_64-linux-gnu:/lib/x86_64-linux-gnu \
  -e CONDA_DEFAULT_ENV=python310_torch29_cuda \
  -v "${MODEL_ROOT}:/models:ro" \
  "${IMAGE}" sleep infinity
```
### Start the Server
```bash
# Run this block on all six nodes; assign NODE_RANK=0..5 consistently.
# Use the same routable head-node MASTER_ADDR on all nodes; rank 0 serves port 8000.
export CONTAINER=${CONTAINER:-qwen38-kunlun-flagos}
export NODE_RANK=${NODE_RANK:?set NODE_RANK to 0..5}
export MASTER_ADDR=${MASTER_ADDR:?set MASTER_ADDR to the head-node bond0 address}
export MASTER_PORT=${MASTER_PORT:-29693}

docker exec -i \
  -e NODE_RANK="${NODE_RANK}" \
  -e MASTER_ADDR="${MASTER_ADDR}" \
  -e MASTER_PORT="${MASTER_PORT}" \
  "${CONTAINER}" bash -s -- <<BASH
set -euo pipefail

MODEL_PATH=/data/Qwen3.8-2.4T-A95B-INT8
SERVED_MODEL_NAME=Qwen/Qwen3.8-2.4T-A95B-INT8

export TRANSFORMERS_OFFLINE=1
export VLLM_ENGINE_READY_TIMEOUT_S=3600
export PYTORCH_ALLOC_CONF=expandable_segments:True
export CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export XPU_FORCE_SHARED_DEVICE_CONTEXT=1
export PYTHONHASHSEED=0

export GLOO_SOCKET_IFNAME=bond0
export BKCL_SOCKET_IFNAME=bond0
export BKCL_RDMA_NICS=bond0,bond0,bond1,bond1,bond2,bond2,bond3,bond3,bond4,bond4,bond5,bond5,bond6,bond6,bond7,bond7
export BKCL_ENABLE_XDR=1
export BKCL_USE_RDMA=1
export BKCL_RDMA_VERBS=1
export BKCL_GID_INDEX=3
export BKCL_INFERENCE=1
export BKCL_USE_AR=1
export BKCL_RING_OPT=1
export XSHMEM_MODE=1
export XSHMEM_QP_NUM_PER_RANK=32
export XSHMEM_SYMMETRIC_SIZE=4294967296
export XMLIR_D_XPU_L3_SIZE=0
export XMLIR_DIST_SINGLETON_STREAM=true
export PYTORCH_NO_XPU_MEMORY_CACHING=0

export VLLM_PLUGINS=fl,qwen38_kunlun
export VLLM_FL_PLATFORM=kunlunxin
export VLLM_FL_PREFER=flagos
export USE_FLAGGEMS=1
export FLAGCX_PATH=/opt/FlagCX
export VLLM_FL_FLAGOS_WHITELIST=silu_and_mul,rms_norm,moe_align_block_size
export VLLM_FL_OOT_WHITELIST=silu_and_mul

export QWEN38_W8A8_NATIVE=1
export QWEN38_FP8_LUT=0
export QWEN38_FP8_MOE_INT8_BRIDGE=0
export QWEN38_GDN_ZERO_INIT_FASTPATH=1
export QWEN38_GDN_STATE_PREFETCH=0
unset VLLM_WORKER_MULTIPROC_METHOD LANGUAGE_MODEL_ONLY

export VLLM_HOST_IP=\$(ip -4 addr show bond0 | grep -oP "(?<=inet\s)\d+(\.\d+){3}")
export HOST_IP=\${VLLM_HOST_IP}

ROLE_ARGS=(--headless)
if [[ "\${NODE_RANK}" == "0" ]]; then
  ROLE_ARGS=(--host 0.0.0.0 --port 8000)
fi

VLLM_ARGS=(
  --model "\${MODEL_PATH}"
  --tokenizer "\${MODEL_PATH}"
  --served-model-name "\${SERVED_MODEL_NAME}"
  --dtype bfloat16
  --tensor-parallel-size 16
  --pipeline-parallel-size 3
  --data-parallel-size 1
  --enable-expert-parallel
  --expert-placement-strategy linear
  --distributed-executor-backend mp
  --nnodes 6
  --node-rank "\${NODE_RANK}"
  --master-addr "\${MASTER_ADDR}"
  --master-port "\${MASTER_PORT}"
  --enforce-eager
  --block_size 256
  --gpu-memory-utilization 0.9
  --kv-cache-memory-bytes 8G
  --no-enable-prefix-caching
  --max-model-len 131072
  --max-num-seqs 128
  --max-num-batched-tokens 1024
  --seed 1234
  --reasoning-parser qwen3
  --enable-auto-tool-choice
  --tool-call-parser qwen3_xml
  --load-format auto
  --trust-remote-code
)
exec vllm serve "\${VLLM_ARGS[@]}" "\${ROLE_ARGS[@]}"
BASH

```

## Service Invocation
### Invocation Script
```bash
curl --noproxy "*" -fsS http://127.0.0.1:8000/health
curl --noproxy "*" -fsS http://127.0.0.1:8000/v1/models
curl --noproxy "*" -fsS http://127.0.0.1:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  --data-binary @- <<JSON
{
  "model": "Qwen/Qwen3.8-2.4T-A95B-INT8",
  "messages": [
    {"role": "user", "content": "Please calculate 17+25 and return only the result."}
  ],
  "temperature": 0,
  "max_tokens": 32,
  "chat_template_kwargs": {"enable_thinking": false}
}
JSON
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
The model weights are derived from Qwen/Qwen3.8-2.4T-A95B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt


