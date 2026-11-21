---
license: apache-2.0
language:
- zh
- en
---

# Introduction
Tencent Hunyuan has officially open-sourced its multimodal model Hy4 Flash. Based on the unified multi-chip software stack FlagOS, the Zhongzhi FlagOS community has completed Day 0 cross-chip adaptation, covering nine chip vendors: T-Head, NVIDIA, Huawei Ascend, Hygon, Kunlunxin, Muxi, Moore Threads, TsingMicro and Iluvatar CoreX. Benefiting from the performance optimizations in FlagOS 2.2, overall evaluation results show that the FlagOS build running on NVIDIA H100 delivers up to a 35.9% increase in output throughput and up to a 29.1% reduction in time-to-first-token latency compared with the native NVIDIA stack. Industry users may deploy the FlagOS image of Hy4 Flash across diverse hardware by matching it with their existing computing resources and service workloads.

Hy4 Flash is designed for workloads including deep search, document processing, PPT generation and Computer Use for daily office scenarios. It has approximately 220 billion total parameters (including around 64 billion Engram parameters), with roughly 12 billion parameters activated per token. It natively supports text and image inputs and text outputs, alongside a maximum context length of 1 million tokens. Built with hybrid attention, Latent MoE and Engram architectures, its KV Cache footprint is only one-sixth that of Hy4. In Tencent Hunyuan’s internal WorkIndex benchmark, Hy4 Flash scores 42.1, outperforming Hy4 Preview’s 39.7, while boasting lower per-task costs.

### Integrated Deployment

- This FlagOS image serves Hy4 Flash W8A8 on a single host machine with 16 Ascend 910C NPUs.
- The OpenAI-compatible API supports text and image inputs. Use model name `Hy4-flash-W8A8` and a context length of up to 65,536 tokens, including input and output.
- The runtime uses attention data parallelism across 16 ranks, one rank per attention tensor-parallel group, and AscendOps expert parallelism across 16 ranks. It runs prefill eagerly and replays a graph for decode. The default configuration disables prefix caching and multi-token prediction (MTP).
- CANN executes paged Sparse Flash Attention, LightningIndexer, and sliding-window fused infer attention. FlagGems-sglang supplies the fused MoE activation and quantization, prefill attention gate, and IndexPool expansion kernels. FlagTree compiles the Triton kernels, and HCCL exchanges Engram lookup results across the 16 ranks.

### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | Hy4-flash-Nvidia-Origin | Hy4-flash-Mthreads-FlagOS |
|---|---|---|
| Math-500     | 96                             | 96.6                                 |
| GPQA_Diamond | 92,42                          | 89.9                                 |
| mmbench      | 92.6                           | Evaluating                           |
| mmstar       | 80.93                          | Evaluating                           |
# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (NPU) | Ascend 910C × 16 |
| Docker Version | 20.10.8 |
| Operating System | openEuler 22.03 LTS-SP4 (aarch64) |
| Driver | 25.5.0 |
| SDK | CANN 9.1 A3 daily |
| Container OS | Ubuntu 22.04.5 LTS |
| CPython / PyTorch / torch-npu | 3.12.13 / 2.10.0+cpu / 2.10.0.post6 |
| SGLang | Package `0.0.0.dev0+gc808dcac9007`, commit `c808dcac9007155d6ea44aa23f71c768a92b9b2d` |
| FlagOS components | sglang-fl 0.1.0, FlagGems-sglang 0.1.0, FlagGems 0.0+geb7193762, and FlagTree 0.7.1+ascend3.5 |
| Communication | HCCL with the AscendOps expert-parallel backend |


## Operation Steps

### Download FlagOS Image

Use the locally tagged image or pull it from Harbor once it is available.

```bash
docker pull harbor.baai.ac.cn/flagrelease-public/hy4-flash-ascend001-gems0.0-tree0.7.1-cxnone-pluginnone-vllmnone-sglang0.5.20-sglangfl0.1.0-cp312-ptnpu210-cann91-a64-25.5.0:202611191400

```

### Download Open-source Model Weights

Place the W8A8 checkpoint without MTP in a readable directory on the host machine. Set `MODEL_DIR` to that directory. The default path points to the checkpoint used for validation.

```bash
modelscope download --model FlagRelease/Hy4-flash-INT8-ascend-FlagOS

export IMAGE='harbor.baai.ac.cn/flagrelease-public/hy4-flash-ascend001-gems0.0-tree0.7.1-cxnone-pluginnone-vllmnone-sglang0.5.20-sglangfl0.1.0-cp312-ptnpu210-cann91-a64-25.5.0:202611191400'
export MODEL_DIR="${MODEL_DIR:-/public-flash/models/Hy4-flash-testing-W8A8-no-MTP}"
export CONTAINER="${CONTAINER:-hy4flash-ascend-release}"
export HY4_PORT="${HY4_PORT:-31002}"
export STATE_DIR="${STATE_DIR:-$PWD/hy4-ascend-state}"
test -r "$MODEL_DIR/config.json"
```

### Start the Container

Run the following commands on the Ascend host machine. Docker mounts the checkpoint, and the host machine stores logs, test results, and compilation caches in `STATE_DIR`.

```bash
set -euo pipefail
npu_smi=$(readlink -f "$(command -v npu-smi)")
devices=(--device /dev/davinci_manager --device /dev/hisi_hdc --device /dev/devmm_svm)
for ((i = 0; i < 16; i++)); do
  devices+=(--device "/dev/davinci$i")
done
mkdir -p "$STATE_DIR"/{logs,cache/triton,cache/inductor}
state=$(cd -- "$STATE_DIR" && pwd)
model=$(cd -- "$MODEL_DIR" && pwd)

docker run --detach --name "$CONTAINER" --network host --ipc host \
  "${devices[@]}" \
  --mount type=bind,src=/usr/local/Ascend/driver,dst=/usr/local/Ascend/driver,readonly \
  --mount type=bind,src=/etc/ascend_install.info,dst=/etc/ascend_install.info,readonly \
  --mount "type=bind,src=$npu_smi,dst=/usr/local/bin/npu-smi,readonly" \
  --mount "type=bind,src=$model,dst=/public-flash/models/Hy4-flash-testing-W8A8-no-MTP,readonly" \
  --mount "type=bind,src=$state/logs,dst=/workspace/hy4-flash/logs" \
  --mount "type=bind,src=$state/cache,dst=/workspace/hy4-flash/cache" \
  -e "HY4_PORT=$HY4_PORT" \
  -e TRITON_CACHE_DIR=/workspace/hy4-flash/cache/triton \
  -e TORCHINDUCTOR_CACHE_DIR=/workspace/hy4-flash/cache/inductor \
  "$IMAGE"
```

### Start the Inference Server

The image starts SGLang using its default command. Each data-parallel group uses a prefill chunk of 2,048 tokens and captures decode graphs for batch sizes 1, 2, and 4.

On the validation host machine, the SGLang engine took about 338 seconds to load the weights and compile the graphs from an empty cache. Wait for the model endpoint to report the model name and context length.

```bash
BASE_URL="http://127.0.0.1:$HY4_PORT"
deadline=$((SECONDS + 900))
until curl --noproxy '*' -fsS --max-time 3 "$BASE_URL/v1/models" 2>/dev/null |
    jq -e '.data | any(.id == "Hy4-flash-testing-W8A8" and .max_model_len == 65536)' >/dev/null; do
  if ((SECONDS >= deadline)) ||
      [[ $(docker inspect -f '{{.State.Running}}' "$CONTAINER") != true ]]; then
    docker logs --tail 80 "$CONTAINER" >&2
    exit 1
  fi
  sleep 5
done
```

## Service Invocation
### Invocation Script (Text)

Set the OpenAI client's base URL to `http://<host>:$HY4_PORT/v1` and the model name to `Hy4-flash-testing-W8A8`.

```bash
curl --noproxy '*' --fail-with-body --silent --show-error --max-time 180 \
  "http://127.0.0.1:$HY4_PORT/v1/chat/completions" \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "model": "Hy4-flash-testing-W8A8",
    "messages": [{"role": "user", "content": "Briefly explain inference on Ascend NPUs."}],
    "temperature": 0.9,
    "top_p": 1,
    "top_k": -1,
    "reasoning_effort": "high",
    "chat_template_kwargs": {"thinking": true, "reasoning_effort": "high"},
    "max_completion_tokens": 512,
    "stream": false
  }' | jq -e '{answer: .choices[0].message.content, usage}'
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
The model weights are derived from Hy4-flash and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

