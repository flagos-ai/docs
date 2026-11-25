---
license: apache-2.0
language:
- zh
- en
---

# Introduction
Xing4.1-Preview is an MoE model from the Xingchen Semantic Large Model family designed for agent programming and long-horizon complex tasks. It has a total parameter count of 285B with approximately 17B parameters activated per token and natively supports a 1M context window. Adopting MLA for compressed KV representation and DSA sparse attention, the model uses a 45-layer Transformer backbone, 42 of which are MoE layers. For each token, it selects 8 experts out of 256 routed experts together with 1 shared expert. For practical applications, it supports thinking mode switching, tool calling and structured output, and can be applied to multi-step office workflows, in-depth research, code generation and document-intensive business scenarios. The Xing 4 series was trained on fully domestic computing platforms, and this FlagOS adaptation further broadens the inference deployment options for Xing4.1-Preview.

### Integrated Deployment

- This FlagOS image serves Xing4.1 Preview W8A8 on a single host machine with 16 Ascend 910C NPUs.
- The OpenAI-compatible API supports text inputs. Use model name `Xing4.1-Preview-RL-1114` and a context length of up to 65,536 tokens, including input and output.
- The runtime uses attention data parallelism across 16 ranks, one rank per attention tensor-parallel group, and DeepEP expert parallelism across 16 ranks. It runs prefill eagerly and replays a graph for decode. The default configuration disables prefix caching and multi-token prediction (MTP).
- The image includes the optimized sglang-plugin-fl integration and FlagGems-sglang sparse-attention mask kernel. Quantized linear and MoE operations use compressed-tensors dynamic W8A8 kernels.

### Consistency Validation
- This image integrates the optimized FlagOS runtime for Xing4.1 Preview deployment on Ascend 910C.

# Evaluation Results
## Benchmark Result
| Metrics | Xing4.1-Preview-Nvidia-Origin | Xing4.1-Preview-Ascend-FlagOS |
|---|---|---|
| Math-500     | 95.20                          | 95.20                                |
| GPQA_Diamond | 89.8                           | 90.31                                |
# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (NPU) | Ascend 910C × 16 |
| Docker Version | 20.10.8 |
| Operating System | openEuler 22.03 LTS-SP4 (aarch64) |
| Driver | 25.5.0 |
| SDK | CANN 8.5.0 |
| Container OS | Ubuntu 22.04.5 LTS |
| CPython / PyTorch / torch-npu | 3.11.14 / 2.8.0+cpu / 2.8.0.post2 |
| SGLang | Package `0.5.11`, commit `600df8dd498955f5aef4417383ea9ae5d2c238f7` |
| FlagOS components | sglang-fl 0.1.0+compat3.opt3 with bundled optimized source, FlagGems-sglang 0.1.0, FlagGems 0.0.dev20261030+g66bdcae29556.compat5, and Triton Ascend 3.2.0 |
| Communication | HCCL with the DeepEP expert-parallel backend |


## Operation Steps

### Download FlagOS Image

Pull the image from Harbor.

```bash
docker pull harbor.baai.ac.cn/flagrelease-public/xing4.1-preview-ascend001-gems0.0-treenone-cxnone-pluginnone-vllmnone-sglang0.5.11-sglangfl0.1.0-cp311-ptnpu28-cann85-a64-25.5.0:202611230405

```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Xing4.1-Preview-W8A8-ascend-FlagOS
```
Place the Xing4.1 Preview W8A8 checkpoint in a readable directory on the host machine and set `MODEL_DIR` to that directory.

```bash
export IMAGE='harbor.baai.ac.cn/flagrelease-public/xing4.1-preview-ascend001-gems0.0-treenone-cxnone-pluginnone-vllmnone-sglang0.5.11-sglangfl0.1.0-cp311-ptnpu28-cann85-a64-25.5.0:202611230405'
export MODEL_DIR="${MODEL_DIR:-/public-flash/models/Xing4.1-Preview-RL-1114-W8A8-FlagOS-20261119-172125}"
export CONTAINER="${CONTAINER:-xing41-preview-ascend-release}"
export XING41_PORT="${XING41_PORT:-30120}"
export STATE_DIR="${STATE_DIR:-$PWD/xing41-ascend-state}"
test -r "$MODEL_DIR/config.json"
```

### Start the Container

Run the following commands on the Ascend host machine. Docker mounts the checkpoint, and the host machine stores runtime logs and compilation caches in `STATE_DIR`.

```bash
set -euo pipefail
npu_smi=$(readlink -f "$(command -v npu-smi)")
devices=(--device /dev/davinci_manager --device /dev/hisi_hdc --device /dev/devmm_svm)
for ((i = 0; i < 16; i++)); do
  devices+=(--device "/dev/davinci$i")
done
mkdir -p "$STATE_DIR"/{logs,cache/triton,cache/flaggems,cache/hf}
state=$(cd -- "$STATE_DIR" && pwd)
model=$(cd -- "$MODEL_DIR" && pwd)

docker run --detach --name "$CONTAINER" --network host --ipc host --privileged \
  "${devices[@]}" --ulimit memlock=-1:-1 --ulimit stack=67108864:67108864 \
  --mount type=bind,src=/usr/local/Ascend/driver,dst=/usr/local/Ascend/driver,readonly \
  --mount type=bind,src=/usr/local/Ascend/firmware,dst=/usr/local/Ascend/firmware,readonly \
  --mount type=bind,src=/etc/ascend_install.info,dst=/etc/ascend_install.info,readonly \
  --mount "type=bind,src=$npu_smi,dst=/usr/local/bin/npu-smi,readonly" \
  --mount "type=bind,src=$model,dst=/models/Xing4.1-Preview-RL-1114-W8A8,readonly" \
  --mount "type=bind,src=$state/logs,dst=/workspace/xing41/logs" \
  --mount "type=bind,src=$state/cache,dst=/workspace/xing41/cache" \
  -e "XING41_PORT=$XING41_PORT" \
  -e TRITON_CACHE_DIR=/workspace/xing41/cache/triton \
  -e FLAGGEMS_CACHE_DIR=/workspace/xing41/cache/flaggems \
  -e HF_HOME=/workspace/xing41/cache/hf \
  "$IMAGE"
```

### Start the Inference Server

The image starts SGLang automatically using the bundled optimized configuration. Each data-parallel group uses a prefill chunk of 1,024 tokens and captures decode graphs for batch sizes 1, 2, and 4. Wait for the model endpoint to report the model name and context length.

```bash
BASE_URL="http://127.0.0.1:$XING41_PORT"
deadline=$((SECONDS + 900))
until curl --noproxy '*' -fsS --max-time 3 "$BASE_URL/v1/models" 2>/dev/null |
    jq -e '.data | any(.id == "Xing4.1-Preview-RL-1114" and .max_model_len == 65536)' >/dev/null; do
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

Set the OpenAI client's base URL to `http://<host>:$XING41_PORT/v1` and the model name to `Xing4.1-Preview-RL-1114`.

```bash
curl --noproxy '*' --fail-with-body --silent --show-error --max-time 180 \
  "http://127.0.0.1:$XING41_PORT/v1/chat/completions" \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "model": "Xing4.1-Preview-RL-1114",
    "messages": [{"role": "user", "content": "What is 2+2? Give only the answer."}],
    "temperature": 1.0,
    "top_p": 0.95,
    "repetition_penalty": 1.05,
    "chat_template_kwargs": {"enable_thinking": true},
    "max_completion_tokens": 1024,
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
The model weights are derived from Xing4.1-Preview and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

