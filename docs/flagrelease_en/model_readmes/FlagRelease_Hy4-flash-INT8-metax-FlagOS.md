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
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-MetaX** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | HY4-flash-Nvidia-Origin | HY4-flash-MetaX-FlagOS |
|---|---|---|
| Math-500     | 96                             | 98.2                                 |
| GPQA_Diamond | 92,42                          | 91                                   |
| mmbench      | 92.6                           | Evaluating                           |
| mmstar       | 80.93                          | Evaluating                           |
> FlagEval evaluation (GPQA-Diamond / MATH-500 / MMBench / MMStar) was submitted through
> the Auto-Evaluation platform on 2026-11-18/19: the NLP batch ended with status `C`
> (0/2, no samples) and the MM batch is still running. No numbers yet.

## Inference Performance (measured)
4k input / 1k output, `vllm bench serve --num-prompts 8 --request-rate inf`:

| Config | Output tok/s | Total tok/s | Mean TTFT | Mean TPOT |
|---|---|---|---|---|
| TP8 graph, 8 concurrent, max-len 65536 | 50.14 | 255.53 | 32.18 s | 127.09 ms |
| TP8 graph, 16 concurrent, max-len 65536 | 71.95 | 366.66 | 57.25 s | 164.45 ms |

# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | MetaX C550 64GB x8卡 |
| Docker Version | 29.1.3 |
| Operating System | Ubuntu 22.04.5 LTS (kernel 5.15.0-119-generic) |
| Driver | 3.8.1 (mx-smi 2.3.1) |
| SDK | MACA 3.8.1.3 |
| Host memory | ≥ 512 GB (Engram needs 126.9 GB pinned host memory) |
| Disk | ≥ 300 GB for weights (268.6 GiB, 148 shards) |

## Operation Steps

### Download FlagOS Image
```bash
# graph (recommended): TP8, cudagraph FULL_DECODE_ONLY
docker pull harbor.baai.ac.cn/flagrelease-public/vllm0.24.0-metax-maca3.8.1.3:hy4-flash-metax-graph-20261118

# eager (fallback, optional)
# docker pull harbor.baai.ac.cn/flagrelease-public/vllm0.24.0-metax-maca3.8.1.3:hy4-flash-metax-20261118
```

Image content: vLLM `0.32.0+empty` (`5df63a72`), vllm-plugin-FL `814b6d3e` + Hy4-Flash/MetaX fixes
(`052bd4f2`), FlagGems `729c7e85`, FlagGems-vllm `af184e57` + capture-safe fix (`c8c34ba`);
sources are pre-installed editable under `/workspace`.

### Download Open-source Model Weights
The INT8 W8A8 weights are distributed through FlagRelease shared storage
(ModelScope publication pending):

```bash
modelscope download --model FlagRelease/Hy4-flash-INT8-metax-FlagOS

```
Weights: 42 layers / hidden 3072 / 512 experts / top-16, VL, no-MTP, `model_type=hy_v4_flash`.

### Start the Container
```bash
sudo docker run -dit --privileged \
  --name hy4-flash \
  --network host \
  --shm-size 64g \
  --device /dev/dri:/dev/dri:rwm \
  --device /dev/mxcd:/dev/mxcd:rwm \
  -v /public-flash/models:/models \
  -w / \
  harbor.baai.ac.cn/flagrelease-public/vllm0.24.0-metax-maca3.8.1.3:hy4-flash-metax-graph-20261118 \
  sleep infinity
docker exec -it hy4-flash /bin/bash
```

> ⚠️ Keep the working directory outside `/workspace` (`-w /`). With editable installs,
> a cwd of `/workspace` makes `vllm` resolve to a namespace package and
> `from vllm import LLM` fails.

### Start the Inference Server
```bash
cd /

export TORCH_COMPILE_DISABLE=0
export TORCHINDUCTOR_COMPILE_THREADS=1
export GEMS_VENDOR=metax
export VLLM_PLUGINS=fl
export VLLM_USE_V2_MODEL_RUNNER=1
export VLLM_FL_CONFIG=/workspace/vllm-plugin-FL/examples/hy4_flash/dispatch.yaml
export VLLM_FL_FLAGOS_WHITELIST=grouped_topk,fused_moe,hy4_flash_fwht_quant_fp8,hy4_flash_gated_pool,hy4_flash_rotate_indexer,hy4_flash_select_groups,hy4_flash_expand_groups,hy4_flash_write_pool,hy4_flash_prepare_groups,hy4_flash_write_tails
export FLASH_MODE=load
export HF_HUB_OFFLINE=1
export TRANSFORMERS_OFFLINE=1
export VLLM_NO_USAGE_STATS=1
export FLASHINFER_WORKSPACE_BASE=/tmp
export FLAGGEMS_FLASHMLA_SPARSE_TLE=0
export FLAGGEMS_FLASHMLA_DECODE_TLE=0
export FLAGGEMS_FP8_FP4_PAGED_MQA_LOGITS_TLE=0
export VLLM_WORKER_MULTIPROC_METHOD=spawn
export GLOO_SOCKET_IFNAME=inbond1
export MCCL_SOCKET_IFNAME=inbond1
export NCCL_SOCKET_IFNAME=inbond1
export MCCL_SOCKET_FAMILY=AF_INET
export MCCL_IB_DISABLE=1
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=7200
export VLLM_ENGINE_ITERATION_TIMEOUT_S=7200
export VLLM_ENGINE_READY_TIMEOUT_S=7200
export VLLM_DISABLE_SHARED_EXPERTS_STREAM=1

# 本机 inbond1 地址（按本机网段调整探测目标）
export VLLM_HOST_IP=$(/flagos/bin/python -c "import socket;s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM);s.connect(('192.168.2.1',1));print(s.getsockname()[0])")
grep -q "$VLLM_HOST_IP $(hostname)" /etc/hosts || echo "$VLLM_HOST_IP $(hostname)" >> /etc/hosts

/flagos/bin/vllm serve /models/Hy4-flash-testing-W8A8-no-MTP \
    --served-model-name hy4-flash \
    --host 0.0.0.0 \
    --port 8000 \
    --tensor-parallel-size 8 \
    --pipeline-parallel-size 1 \
    --distributed-executor-backend mp \
    --dtype bfloat16 \
    --tokenizer-mode hy_v4 \
    --gpu-memory-utilization 0.90 \
    --max-model-len 65536 \
    --kv-cache-dtype auto \
    --max-num-seqs 8 \
    --max-num-batched-tokens 4096 \
    --enable-expert-parallel \
    --no-enable-prefix-caching \
    --limit-mm-per-prompt '{"image":16,"video":0}' \
    --chat-template /models/Hy4-flash-testing-W8A8-no-MTP/chat_template.jinja \
    --trust-remote-code \
    --compilation-config '{"mode":0,"cudagraph_mode":"FULL_DECODE_ONLY"}'
```

Expected startup (8×C550, weights on NFS):

```
INFO:     Application startup complete.
GPU KV cache size: 1,522,760 tokens
Maximum concurrency for 65,536 tokens per request: 23.24x
```

First start takes **~8–12 minutes** (268.6 GiB NFS read + 126.9 GB Engram pinned host memory;
8 minutes measured at 32K, longer at 64K); graph capture is ~6 s per rank and adds 0.23 GiB
per card; steady memory is ~61 GB/card.

> ⚠️ Known limitations (2026-11-19):
> - Keep `--no-enable-prefix-caching`. A non-zero prefix-cache hit rate triggers an
>   `Xnack Error / ATU Fault` in `triton_flash_mla_sparse_fwd` and kills the engine
>   (flagos-ai/FlagGems-vllm#1324).
> - 32/64 concurrent requests hit the same crash (peak ~37 running). 8 and 16 concurrent
>   are stable; 16 concurrent is the fastest configuration observed so far.
> - The whitelist above is the validated dispatch set. In particular `mm/linear/sort`
>   are intentionally excluded on MetaX (Triton compile failures at vLLM's real shapes).
>
> For eager mode: use the eager image and add `--enforce-eager` with `--max-model-len 32768`
> (`KV cache 1,260,662 tokens`, max concurrency 38.47x).

## Service Invocation
### Invocation Script (Text)
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "hy4-flash",
    "messages": [{"role": "user", "content": "中国的首都是哪个城市？"}],
    "max_tokens": 64,
    "temperature": 0
  }'
```

Expected: an answer containing `北京` (validated on both eager and graph, byte-identical).
The thinking content is returned inside `content` (no reasoning parser is configured).

### Invocation Script (Image)
```bash
IMAGE_BASE64=$(base64 -w 0 "/public-flash/example.jpg")

curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  --data-binary @- <<EOF
{
  "model": "hy4-flash",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "请描述这张图片中的内容。"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,${IMAGE_BASE64}"
          }
        }
      ]
    }
  ]
}
EOF
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
