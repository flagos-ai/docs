---
language:
- en
---

# Introduction

Tencent Hunyuan officially open-sources its multimodal model Hy4. The FlagOS community, building on FlagOS's unified multi-chip software stack, completed Day-0 cross-chip adaptation, covering platforms from 9 chip vendors—Hygon, Kunlunxin, T-Head (Pingtouge), NVIDIA, Huawei Ascend, MetaX, Moore Threads, Tsing Micro, and Iluvatar CoreX—and **provided** a W8A8 version of the model. Drawing on the FlagOS 2.2 software stack together with framework- and operator-level co-optimization tailored to Hy4, in a dual-node, 16-GPU, 64-concurrency test on NVIDIA platforms, the FlagOS version raised output throughput by up to 32.1% and reduced average per-token latency by up to 39.2% compared with NVIDIA's native solution. On domestic platforms such as T-Head, Huawei Ascend, Hygon, and Moore Threads, it also achieved per-unit-compute throughput approaching or exceeding that of NVIDIA's native version in some of the tested scenarios. Backed by the FlagOS technology stack, Hy4 demonstrates competitive inference efficiency across a range of chips, letting industry users flexibly choose deployment options for cutting-edge multimodal large models based on their existing compute and workloads.

Hy4 is a multimodal model released by Tencent Hunyuan for real-world productivity scenarios. Compared with **the Hy4 preview**, the official version scales up both pre-training and post-training, introduces visual understanding and computer operation capabilities for the first time, and further improves instruction following, long-text comprehension, long-horizon task execution, and deep research. The model combines image perception, reasoning, and tool use to handle complex charts, operate professional software, and serve front-end and game development, financial office work, and scientific research tasks. In the evaluations published by Tencent Hunyuan, Hy4's score on Terminal-Bench 4.0 rose from the preview's 26.3 to 44.4, and on AutomationBench v1.0.6 from 36.3 to 56.2.

### Integrated Deployment

- Two nodes with eight Kunlunxin P800 devices each (16 devices total); TP16 with EP16.
- The verified reference serves the authorized Hy4 W8A8 checkpoint with MTP and DFly disabled. Maximum context is 102,400 tokens. Five `PIECEWISE` Graph capture sizes completed.

### Consistency Validation

The two-node reference passed a nonzero-temperature text request and a single request with 16 images. These are service checks; the accuracy scores below are the supplied benchmark results.

# Evaluation Results

## Benchmark Result

| Metrics | Hy4-NVIDIA-Origin | Hy4-Kunlunxin-FlagOS |
| --- | --- | --- |
| Math-500     | 96.2                           | Evaluating                           |
| GPQA_Diamond | 93.65                          | Evaluating                           |
| mmbench      | 91.2                           | Evaluating                           |
| mmstar       | 79.67                          | Evaluating                           |
# User Guide

Environment Setup

| Item | Version |
| --- | --- |
| Docker | 24.0.0, verified on the reference host |
| Operating system | Ubuntu 22.04.5 LTS inside the reference image |
| Runtime | vLLM 0.28.0+empty; PyTorch 2.9.0+cu129 |
| vLLM / vllm-plugin-FL | 0.28.0+empty / 0.4.0.dev0+g9ad9a78.hy4 |
| FlagGems / FlagGems-vLLM | 5.4.0rc2.post1 / 0.3.0.dev1 |
| FlagTree / FlagCX | 0.7.0rc2+xpu3.6 / 0.13.0 |
| PyTorch | 2.9.0+cu129 |


## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagos-inner-models-release/flagrelease-kunlunxin-release-model_hy4-testing-3-w8a8-no-mtp-tree_0.7.0rc2.xpu3.6-gems_5.4.0rc2.post1-cx_0.13.0-python_3.10.18-torch_cuda-2.9.0-pcp_xrt5.0.21-gpu_kunlunxin001-arc_amd64-driver_5.0.21.47:202611201828-rank0
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Hy4-W8A8-kunlunxin-FlagOS
```
### Start the Container

Run one instance of this script on each host after the P800 driver and RoCE network are configured. Pass the same rank-0 management IP to both ranks, and pass this host's management IP as the fourth argument. The image carries the server entrypoint; no host-side code directory is mounted. The validated reference used the privileged P800 container and host networking, so use these settings only on trusted hosts.

```bash
#!/usr/bin/env bash
set -euo pipefail
usage() { echo "Usage: $0 MODEL_DIR RANK MASTER_ADDR NODE_IP" >&2; exit 2; }
[[ $# == 4 && ( $2 == 0 || $2 == 1 ) ]] || usage
model=$(realpath -e -- "$1")
rank=$2
master=$3
node=$4
image=${HY4_IMAGE:-harbor.baai.ac.cn/flagrelease-public/flagrelease-kunlunxin-release-model_hy4-testing-3-w8a8-no-mtp-tree_0.7.0rc2.xpu3.6-gems_5.4.0rc2.post1-cx_0.13.0-python_3.10.18-torch_cuda-2.9.0-pcp_xrt5.0.21-gpu_kunlunxin001-arc_amd64-driver_5.0.21.47:202611201828-rank0}
[[ $image =~ @sha256:[a-f0-9]{64}$ ]] || usage
[[ -r "$model/config.json" && -r "$model/model.safetensors.index.json" ]]
docker pull "$image"
exec docker run --rm --init --name "${HY4_CONTAINER_NAME:-hy4-p800-rank$rank}" \
  --network host --privileged --shm-size 128g --security-opt label=disable \
  --mount "type=bind,src=$model,dst=/models/Hy4-testing-3-W8A8-no-MTP,readonly" \
  -e "MASTER_ADDR=$master" -e "VLLM_HOST_IP=$node" \
  -e "MASTER_PORT=${MASTER_PORT:-29880}" -e "HY4_API_PORT=${HY4_API_PORT:-18336}" \
  -e "HY4_API_BIND=${HY4_API_BIND:-0.0.0.0}" \
  -e GLOO_SOCKET_IFNAME -e FLAGCX_SOCKET_IFNAME -e BKCL_SOCKET_IFNAME -e BKCL_RDMA_NICS \
  "$image" "$rank"
```

### Start the Server

Save the script above as `start-hy4-p800.sh`. On each node, set `HY4_MODEL_DIR` to its own local model directory, `MASTER_ADDR` to the rank-0 address and `NODE_IP` to that node's address. Set `RANK=0` on the first node and `RANK=1` on the second node. The `docker run` invocation starts vLLM directly, with rank 1 headless.

```bash
bash start-hy4-p800.sh "$HY4_MODEL_DIR" "$RANK" "$MASTER_ADDR" "$NODE_IP"
# From a separate terminal after both ranks start:
curl -fsS "http://${MASTER_ADDR}:${HY4_API_PORT:-18336}/health"
curl -fsS "http://${MASTER_ADDR}:${HY4_API_PORT:-18336}/v1/models"
```

Both hosts pulled the same image digest. The runtime and headless rank-1 launch were checked without using accelerator devices. End-to-end dual-node GPU serving and performance have not been rerun with this unified image.

## Service Invocation

### Invocation Script

```bash
HY4_MODEL_ID="${HY4_MODEL_ID_OVERRIDE:-Hy4-Testing}"
BASE_URL="${HY4_BASE_URL:?Set HY4_BASE_URL to the rank-0 API URL, without /v1}"
export HY4_MODEL_ID
curl --fail-with-body "${BASE_URL%/}/v1/chat/completions" \
  -H 'Content-Type: application/json' \
  --data-binary "$(python3 -c 'import json,os; print(json.dumps({"model":os.environ["HY4_MODEL_ID"],"messages":[{"role":"user","content":"What is 7 plus 5?"}],"max_tokens":128}))')"
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
The model weights are derived from Hy4 and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
