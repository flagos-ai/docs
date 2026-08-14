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
- Released **FlagOS-Nvidia** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | Qwen3.8-2.4T-A95B-Nvidia-Origin | Qwen3.8-2.4T-A95B-Nvidia-FlagOS |
|--------------|---------------------------------|---------------------------------|
| GPQA_Diamond | 91.41                           | 91.41                           |
|musr_murder_mysteries | 79.2| 79|

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 24.0.0, build 98fdcd7 |
| Operating System | 22.04.4 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/qwen3.8-2.4t-a95b-nvidia003-gems5.3.3-tree0.5.0-cxnone-plugin0.3.0-vllm0.24.0-cp312-pt211-cu129-x64-580.126.20:202608100512

```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.8-2.4T-A95B-FP8-nvidia-FlagOS --local_dir /data/Qwen3.8-2.4T-A95B-FP8
```

### Start the Container
```bash
set -euo pipefail
IMAGE=harbor.baai.ac.cn/flagrelease-public/qwen3.8-2.4t-a95b-nvidia003-gems5.3.3-tree0.5.0-cxnone-plugin0.3.0-vllm0.24.0-cp312-pt211-cu129-x64-580.126.20:202608100512
MODEL_ROOT=${MODEL_ROOT:-/data}

device_args=()
for dev in /dev/infiniband/* /dev/nvidia[0-9]* /dev/nvidiactl \
  /dev/nvidia-uvm /dev/nvidia-uvm-tools /dev/nvidia-nvlink \
  /dev/nvidia-nvswitch* /dev/nvidia-caps/*; do
  [[ -e "${dev}" ]] && device_args+=(--device "${dev}:${dev}")
done

driver_libcuda=$(readlink -f /usr/lib/x86_64-linux-gnu/libcuda.so.1)
driver_libnvml=$(readlink -f /usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1)
driver_libptxjit=$(readlink -f /usr/lib/x86_64-linux-gnu/libnvidia-ptxjitcompiler.so.1)

docker run -d \
  --name "${CONTAINER}" \
  --network host \
  --ipc host \
  --runtime runc \
  --pids-limit=-1 \
  --shm-size=67108864 \
  --ulimit memlock=-1:-1 \
  --ulimit stack=67108864:67108864 \
  --cap-add SYS_PTRACE \
  --security-opt seccomp=unconfined \
  --security-opt label=disable \
  "${device_args[@]}" \
  -v "${driver_libcuda}:/driver/libcuda.so.1:ro" \
  -v "${driver_libcuda}:/driver/libcuda.so:ro" \
  -v "${driver_libnvml}:/driver/libnvidia-ml.so.1:ro" \
  -v "${driver_libnvml}:/driver/libnvidia-ml.so:ro" \
  -v "${driver_libptxjit}:/driver/libnvidia-ptxjitcompiler.so.1:ro" \
  -v "${driver_libptxjit}:/driver/libnvidia-ptxjitcompiler.so:ro" \
  -v /data:/data \
  -e PYTHONDONTWRITEBYTECODE=1 \
  -e OPENBLAS_NUM_THREADS=1 \
  -e OMP_NUM_THREADS=1 \
  -e MKL_NUM_THREADS=1 \
  -e LD_LIBRARY_PATH=/driver:/usr/local/cuda/lib64 \
  -e CUDA_HOME=/usr/local/cuda \
  -e CUDA_VERSION=12.9.1 \
  -e NVIDIA_VISIBLE_DEVICES=all \
  -e NVIDIA_DRIVER_CAPABILITIES=compute,utility \
  -e VLLM_ENABLE_CUDA_COMPATIBILITY=0 \
  -e VLLM_USAGE_SOURCE=production-docker-image \
  -e VLLM_BUILD_COMMIT=ee0da84ab9e04ac7610e28580af62c365e898389 \
  -v "${MODEL_ROOT}:/models:ro" \
  "${IMAGE}"
```
### Start the Server
```bash
# Run this block on every node. Set NODE_RANK to 0..7 and use the same
# routable MASTER_ADDR on all nodes. Rank 0 exposes HTTP port 8000.
export CONTAINER=${CONTAINER:-qwen38-2.4t-a95b-flagos}
export NODE_RANK=${NODE_RANK:?set NODE_RANK to 0..7}
export MASTER_ADDR=${MASTER_ADDR:?set MASTER_ADDR to the head-node routable address}
export MASTER_PORT=${MASTER_PORT:-29693}

docker exec -i \
  -e NODE_RANK="${NODE_RANK}" \
  -e MASTER_ADDR="${MASTER_ADDR}" \
  -e MASTER_PORT="${MASTER_PORT}" \
  "${CONTAINER}" bash -s -- <<'BASH'
set -euo pipefail

MODEL_PATH=/data/Qwen3.8-2.4T-A95B-FP8
SERVED_MODEL_NAME=Qwen/Qwen3.8-2.4T-A95B

export VLLM_PLUGINS=fl
export USE_FLAGGEMS=1
export VLLM_FL_PREFER=flagos
export VLLM_FL_PREFER_ENABLED=true
export TRITON_LIBCUDA_PATH=/driver

ROLE_ARGS=(--headless)
if [[ "${NODE_RANK}" == "0" ]]; then
  ROLE_ARGS=(--host 0.0.0.0 --port 8000)
fi

exec vllm serve "${MODEL_PATH}" \
    --tokenizer "${MODEL_PATH}" \
    --served-model-name "${SERVED_MODEL_NAME}" \
    --hf-overrides "{\"architectures\":[\"Qwen3_5MoeForCausalLM\"]}" \
    --trust-remote-code \
    --tensor-parallel-size 16 \
    --pipeline-parallel-size 4 \
    --enable-expert-parallel \
    --all2all-backend allgather_reducescatter \
    --distributed-executor-backend mp \
    --nnodes 8 \
    --node-rank "${NODE_RANK}" \
    --master-addr "${MASTER_ADDR}" \
    --master-port "${MASTER_PORT}" \
    --distributed-timeout-seconds 1800 \
    --cpu-distributed-timeout-seconds 1800 \
    --load-format safetensors \
    --dtype bfloat16 \
    --disable-custom-all-reduce \
    --moe-backend triton \
    --max-model-len 204800 \
    --max-num-seqs 256 \
    --max-num-batched-tokens 16384 \
    --gpu-memory-utilization 0.81 \
    --seed 1234 \
    --no-enable-log-requests \
    --compilation-config "{\"pass_config\":{\"fuse_allreduce_rms\":false}}" \
    --reasoning-parser qwen3 \
    --enable-auto-tool-choice \
    --tool-call-parser qwen3_xml \
    "${ROLE_ARGS[@]}"
BASH
```

## Service Invocation
### Invocation Script
```bash
curl --noproxy '*' -sS http://127.0.0.1:8000/v1/chat/completions \
    -H 'Content-Type: application/json' \
    --data-binary @- <<'JSON'
    {
      "model": "Qwen/Qwen3.8-2.4T-A95B",
      "messages": [
        {"role": "user", "content": "请计算 6×7，只回答结果。"}
      ],
      "temperature": 0,
      "max_tokens": 128
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


