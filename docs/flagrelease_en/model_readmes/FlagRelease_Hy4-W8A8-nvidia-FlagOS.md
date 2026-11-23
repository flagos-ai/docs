---
language:
- en
---

# Introduction
Tencent Hunyuan officially open-sources its multimodal model Hy4. The FlagOS community, building on FlagOS's unified multi-chip software stack, completed Day-0 cross-chip adaptation, covering platforms from 9 chip vendors—Hygon, Kunlunxin, T-Head (Pingtouge), NVIDIA, Huawei Ascend, MetaX, Moore Threads, Tsing Micro, and Iluvatar CoreX—and **provided** a W8A8 version of the model. Drawing on the FlagOS 2.2 software stack together with framework- and operator-level co-optimization tailored to Hy4, in a dual-node, 16-GPU, 64-concurrency test on NVIDIA platforms, the FlagOS version raised output throughput by up to 32.1% and reduced average per-token latency by up to 39.2% compared with NVIDIA's native solution. On domestic platforms such as T-Head, Huawei Ascend, Hygon, and Moore Threads, it also achieved per-unit-compute throughput approaching or exceeding that of NVIDIA's native version in some of the tested scenarios. Backed by the FlagOS technology stack, Hy4 demonstrates competitive inference efficiency across a range of chips, letting industry users flexibly choose deployment options for cutting-edge multimodal large models based on their existing compute and workloads.

Hy4 is a multimodal model released by Tencent Hunyuan for real-world productivity scenarios. Compared with **the Hy4 preview**, the official version scales up both pre-training and post-training, introduces visual understanding and computer operation capabilities for the first time, and further improves instruction following, long-text comprehension, long-horizon task execution, and deep research. The model combines image perception, reasoning, and tool use to handle complex charts, operate professional software, and serve front-end and game development, financial office work, and scientific research tasks. In the evaluations published by Tencent Hunyuan, Hy4's score on Terminal-Bench 4.0 rose from the preview's 26.3 to 44.4, and on AutomationBench v1.0.6 from 36.3 to 56.2.

### Integrated Deployment

- Two nodes with eight NVIDIA H100 80 GB HBM3 GPUs each (16 GPUs total).
- The FlagOS W8A8 configuration keeps `eh_proj` in BF16. The FlagOS stack includes FlagGems, FlagGems-vLLM and vllm-plugin-FL; FlagTree is installed.

### Consistency Validation

The two configurations were scored on the same named evaluation suites below. The FlagOS results improve on MATH-500 and GPQA Diamond; both reported ERQA scores are below the native baseline. The fresh two-node Hy4 no-MTP reference service was separately verified with NCCL over InfiniBand and a short API request.

# Evaluation Results

## Benchmark Result

| Metrics | Hy4-NVIDIA-Origin (H100) | Hy4-NVIDIA-FlagOS (H100) |
| --- | --- | --- |
| Math-500     | 96.2                           | 95.79                                |
| GPQA_Diamond | 93.65                          | 92.06                                |
| mmbench      | 91.2                           | 92                                   |
| mmstar       | 79.67                          | 80.6                                 |
### Performance

Historical FlagOS measurements: W8A8 (`eh_proj` in BF16), 16 H100 GPUs, 64 concurrent requests. These are not measurements of the published digest.

| Input / output tokens | Output (tok/s) | Total (tok/s) | Mean TTFT (ms) | P99 TTFT (ms) | Mean TPOT (ms) |
| --- | --- | --- | --- | --- | --- |
| 4K / 1K | 659.18 | 3295.92 | 16690.40 | 60491.40 | 73.00 |
| 16K / 1K | 214.71 | 3650.13 | 179502.93 | 283663.38 | 77.08 |
| 32K / 1K | 102.24 | 3373.95 | 437616.27 | 616372.75 | 75.12 |

# User Guide

Environment Setup

| Item | Version |
| --- | --- |
| Docker | 20.10.5, verified on the reference host |
| Operating system | AlmaLinux 8.10 inside the reference image (x86_64) |
| Accelerator driver | NVIDIA 580.126.20 |

## Operation Steps

### Download FlagOS Image


```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_hy4-w8a8-tree_0.7.0.gitf48ad963.glibc228.noproton-gems_5.4.1.dev0.hy4.topk2.2-cx_none-python_3.12.13-torch_cuda-2.13.0-pcp_cuda12.9-gpu_nvidia004-arc_amd64-driver_580.126.20@sha256:c5ad462e1ba00aca3f45bd6f809849aec514cb5e09afe3a773609d6d5b2da5c4

```
### Download Open-source Model Weights

```bash
pip instal modelscope
modelscope download --model FlagRelease/Hy4-W8A8-nvidia-FlagOS

```

### Start the Container

Save this script as `start-hy4-h100.sh`. Use two dedicated eight-GPU H100 hosts with NVIDIA Container Toolkit, compatible NVIDIA drivers, working InfiniBand and host networking. Each host may have a different local model path. Use the same rank-0 address and rendezvous port on both hosts and supply each host's own management IP as the fourth argument. Optional NCCL/Gloo device selectors can be set for the local network; no site-specific selector is required by the script.

```bash
#!/usr/bin/env bash
set -euo pipefail
usage() { echo "Usage: $0 MODEL_DIR RANK MASTER_ADDR NODE_IP" >&2; exit 2; }
[[ $# == 4 && ( $2 == 0 || $2 == 1 ) ]] || usage
model=$(realpath -e -- "$1")
rank=$2
master=$3
node=$4
image=${HY4_IMAGE:-harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_hy4-w8a8-tree_0.7.0.gitf48ad963.glibc228.noproton-gems_5.4.1.dev0.hy4.topk2.2-cx_none-python_3.12.13-torch_cuda-2.13.0-pcp_cuda12.9-gpu_nvidia004-arc_amd64-driver_580.126.20@sha256:c5ad462e1ba00aca3f45bd6f809849aec514cb5e09afe3a773609d6d5b2da5c4}
[[ $image =~ @sha256:[a-f0-9]{64}$ ]] || usage
[[ -r "$model/config.json" && -r "$model/model.safetensors.index.json" ]]
docker pull "$image"
devices=()
for dev in /dev/infiniband/rdma_cm /dev/infiniband/uverbs*; do
  [[ -c $dev ]] && devices+=(--device "$dev")
done
[[ ${#devices[@]} -ge 2 ]] || { echo "InfiniBand devices not found" >&2; exit 2; }
exec docker run --rm --init --name "${HY4_CONTAINER_NAME:-hy4-h100-rank$rank}" \
  --gpus all --network host --shm-size 1g --ulimit memlock=-1:-1 \
  "${devices[@]}" --mount "type=bind,src=$model,dst=/derived-model,readonly" \
  -e "NODE_RANK=$rank" -e "MASTER_ADDR=$master" -e "VLLM_HOST_IP=$node" \
  -e "MASTER_PORT=${MASTER_PORT:-29681}" -e "HY4_API_PORT=${HY4_API_PORT:-30112}" \
  -e "HY4_API_BIND=${HY4_API_BIND:-0.0.0.0}" \
  -e NCCL_IB_HCA -e NCCL_SOCKET_IFNAME -e GLOO_SOCKET_IFNAME \
  "$image" serve
```

### Start the Server

Set `HY4_MODEL_DIR` to the local checkpoint directory, `MASTER_ADDR` to the rank-0 address, and `NODE_IP` to this host's address. Use `RANK=0` on the first host and `RANK=1` on the second host. Then run:

```bash
bash start-hy4-h100.sh "$HY4_MODEL_DIR" "$RANK" "$MASTER_ADDR" "$NODE_IP"
# In a separate terminal once both ranks are up:
curl -fsS "http://${MASTER_ADDR}:${HY4_API_PORT:-30112}/health"
curl -fsS "http://${MASTER_ADDR}:${HY4_API_PORT:-30112}/v1/models"
```

The packaged TP16/EP16 plan uses a 204,800-token context, 64 maximum sequences, a 2,048-token batch budget, an FP8 MLA KV cache, an INT8 indexer, and `FULL_AND_PIECEWISE` graph configuration without speculative decoding. No shared source, historical scripts, or weights other than the supplied local directory are mounted. The image was pulled back by digest; rank parameter generation and bundled code were verified without GPU devices. End-to-end GPU serving and performance have not been rerun on this exact digest.

## Service Invocation

### Invocation Script

```bash
HY4_MODEL_ID="${HY4_MODEL_ID_OVERRIDE:-Hy4-W8A8-FlagOS-VL-graph-c64}"
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
