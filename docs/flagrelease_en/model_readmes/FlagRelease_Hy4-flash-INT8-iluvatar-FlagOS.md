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
- Pre-built **FlagOS-Iluvatar BI-V150** container image plus a pinned vLLM 0.32 / FlagGems stack for deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | HY4-flash-Nvidia-Origin | HY4-flash-Iluvatar-FlagOS |
|---|---|---|
| Math-500     | 96                             | Evaluating                           |
| GPQA_Diamond | 92,42                          | Evaluating                           |
| mmbench      | 92.6                           | Evaluating                           |
| mmstar       | 80.93                          | Evaluating                           |
> FlagEval Day0_LLM evaluation (GPQA-Diamond and Math-500) is running on the Iluvatar deployment; results will be filled in when the run completes.

# User Guide

## Model Specifications

| Item | Value |
|---|---|
| Model | HY4-Flash (INT8 W8A8, no MTP, multimodal) |
| Architecture | 42 layers; hidden size 3072; 512 experts / top-16; latent 1536 |
| Attention | 12 compressed-sparse layers + 30 SWA-512 layers; Engram at layers 2/12/22/32 (CPU-pinned table + UVA) |
| Weights | `Hy4-flash-testing-W8A8-no-MTP`, 148 shards, 268.6 GiB |

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | Iluvatar BI-V150 ×16 (32 GiB per card) |
| Docker Version | 26.1.3 |
| Operating System | Ubuntu 20.04.6 LTS (kernel 5.4.0-148-generic) |
| Driver | CoreX 4.5.0 (IX-ML 4.4.0) |
| SDK | CoreX 4.5.0 / torch 2.10.0+corex.4.5.0 |
| Python | 3.12.11 (`/repro/env`) |

### Software Stack (Hy4-Flash specific)

| Component | Version |
|---|---|
| vLLM | `0.32.0+empty` (sdist, no `.git`) |
| vllm-plugin-FL | `0.5.0.dev0+4a4dc346` (baseline `4a4dc34` + Hy4-Flash model patch + Iluvatar adaptation) |
| FlagGems | `5.3.4.post1.dev11+gbc6d9426c` (`bc6d942`) |
| FlagGems-vllm | `0.3.0.dev1` (PR #1291 `19eb1dd` + Hy4-Flash patch + Iluvatar adaptation) |
| transformers | `5.14.1` |
| Python | `3.12.11` (`/repro/env`) |

> `FlagGems` upstream `main` is currently the FlagTree (Triton fork) tree; the ops library lives on `master`.

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/hy4-flash-iluvatar-bi-v150-gems5.3.4-pluginfl-27cc489-vllm0.32.0-corex4.5.0:20261119-tp16ep
```
Image ID: `sha256:1d72c92e9e9233938b85c852b77525a7077507940d9865742ea04e1959b2fd43`
Image digest: `sha256:e9f087d4e4930175e131911b8ec22aa09e0e8bec4e228bbc0f96d12203cc882a`.

> The image is built on the FlagOS-Iluvatar BI-V150 release base and already contains the
> vLLM 0.32 stack (`/workspace/{vllm,FlagGems,FlagGems-vllm,vllm-plugin-FL}`) plus the
> deployment scripts under `/workspace/scripts`. Model weights are mounted separately.

### Download Open-source Model Weights
```bash
modelscope download --model FlagRelease/Hy4-flash-INT8-iluvatar-FlagOS
```
The model directory is mounted into the container as `/models/Hy4-flash-testing-W8A8-no-MTP`.

### Start the Container
```bash
sudo docker run --privileged -dit \
  --name hy4-flash-iluvatar \
  --network=host \
  --ipc=host \
  --shm-size=64g \
  -e COREX_VISIBLE_DEVICES=all \
  -e COREX_VERSION=4.5.0 \
  -e DEBIAN_FRONTEND=noninteractive \
  -v /mnt/share/models:/models \
  -v /mnt/share/hy4-flash-iluvatar:/work \
  -v /dev:/dev \
  -v /sys:/sys \
  -v /lib/modules:/lib/modules \
  -v /usr/src:/usr/src \
  -v /usr/local/corex-4.5.0.20260509/lib64/libcuda.so.1:/usr/local/corex/lib64/libcuda.so.1 \
  -v /usr/local/corex-4.5.0.20260509/lib64/libixml.so:/usr/local/corex/lib64/libixml.so \
  -v /usr/local/corex-4.5.0.20260509/lib64/libixthunk.so:/usr/local/corex/lib64/libixthunk.so \
  -v /usr/local/corex-4.5.0.20260509/bin/ixsmi:/usr/local/corex/bin/ixsmi \
  -w /repro \
  harbor.baai.ac.cn/flagrelease-public/hy4-flash-iluvatar-bi-v150-gems5.3.4-pluginfl-27cc489-vllm0.32.0-corex4.5.0:20261119-tp16ep

docker exec -it hy4-flash-iluvatar /bin/bash
```

> The host CoreX user-space libraries are bind-mounted into `/usr/local/corex`; this is required
> on BI-V150 hosts whose driver build differs from the image's default.

### Included Software Stack (vLLM 0.32)
The image already contains the Hy4-Flash stack, installed editable from the four repositories.
Verify it with:
```bash
python3 -c "import importlib.metadata as m; print(m.version('vllm-plugin-FL'), m.version('flag_gems'), m.version('flaggems_vllm'))"
# 0.5.0.dev0+4a4dc346 5.3.4.post1.dev11+gbc6d9426c 0.3.0.dev1
```

If a container is rebuilt from a base image without the stack, the sources are kept on the shared
volume and can be restored:
```bash
for d in vllm FlagGems FlagGems-vllm vllm-plugin-FL; do
  rm -rf /workspace/$d
  cp -a /work/src/$d /workspace/$d
done
bash /work/scripts/install_workspace_editable.sh
```

> Known pitfall: an unmodified base image still carries vLLM 0.24 in
> `/usr/local/.../site-packages`, and the container `PYTHONPATH` defaults to
> `/repro/fp8-plugin-source`. Both shadow the editable 0.32 packages.
> `/workspace/scripts/setup_env_aligned.sh` clears `PYTHONPATH`; the old vLLM 0.24 was moved to
> `/work/backup-20261118-hy4flash/`.

### Start the Inference Server
```bash
tmux -L hy4 new-session -d -s flash \
  "bash /workspace/scripts/launch_tp16_ep_32768.sh > /workspace/cache/tp16-ep-32768.log 2>&1"
```
The effective command is:
```bash
source /workspace/scripts/setup_env_aligned.sh
export VLLM_USE_V2_MODEL_RUNNER=1

vllm serve /models/Hy4-flash-testing-W8A8-no-MTP \
  --served-model-name hy4-flash \
  --tensor-parallel-size 16 \
  --enable-expert-parallel \
  --max-model-len 32768 \
  --max-num-batched-tokens 2048 \
  --max-num-seqs 4 \
  --enforce-eager \
  --no-async-scheduling \
  --no-enable-prefix-caching \
  --tokenizer-mode hy_v4 \
  --trust-remote-code \
  --gpu-memory-utilization 0.90 \
  --limit-mm-per-prompt '{"image":1,"video":0}' \
  --port 18520
```

- `setup_env_aligned.sh` sets `PYTHONPATH=`, the FlagGems whitelist for Hy4-Flash, and the
  `rotary_embedding` / `apply_rotary_pos_emb` exclusion; do not replace the platform blacklist
  with `VLLM_FL_FLAGOS_BLACKLIST`.
- `BI-V150` does not support CUDA graph capture on this CoreX driver; keep `--enforce-eager`.
- Measured startup on iluvatar-17: KV cache **822,238 tokens** (25.09× concurrency at 32k per
  request); the service is ready when `Application startup complete` appears in the log.

## Service Invocation

### Invocation Script (Text)
```bash
curl http://localhost:18520/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "hy4-flash",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

### Invocation Script (Image)
```bash
IMAGE_BASE64=$(base64 -w 0 "/public-flash/example.jpg")

curl http://localhost:18520/v1/chat/completions \
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
- Configure the OpenAI-compatible endpoint:
  - Base URL: `http://<server-ip>:18520/v1`
  - Model: `hy4-flash`
- Click "Save Settings" to apply changes

#### 3. Model Interaction

- After model loading is complete:
- Click **"New Conversation"**
- Enter your question (e.g., "Explain the basics of quantum computing")
- Click the send button to get a response

# Technical Overview

**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a "develop once, run anywhere" workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of <chip + open-source model>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.

## FlagGems
FlagGems is a high-performance, generic operator library implemented in [Triton](https://github.com/openai/triton) language. It is built on a collection of backend-neutral kernels that aims to accelerate LLM (Large-Language Models) training and inference across diverse hardware platforms.

## FlagTree
FlagTree is an open source, unified compiler for multiple AI chips project dedicated to developing a diverse ecosystem of AI chip compilers and related tooling platforms, thereby fostering and strengthening the upstream and downstream Triton ecosystem. Currently in its initial phase, the project aims to maintain compatibility with existing adaptation solutions while unifying the codebase to rapidly implement single-repository multi-backend support. For upstream model users, it provides unified compilation capabilities across multiple backends; for downstream chip manufacturers, it offers examples of Triton ecosystem integration.

## FlagScale and vllm-plugin-fl
Flagscale is a comprehensive toolkit designed to support the entire lifecycle of large models. It builds on the strengths of several prominent open-source projects, including [Megatron-LM](https://github.com/NVIDIA/Megatron-LM) and [vLLM](https://github.com/vllm-project/vllm), to provide a robust, end-to-end solution for managing and scaling large models.

vllm-plugin-fl is a vLLM plugin built on the FlagOS unified multi-chip backend, to help flagscale support multi-chip on vllm framework.

## **FlagCX**
FlagCX is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.

## **FlagEval Evaluation Framework**
FlagEval is a comprehensive evaluation system and open platform for large models launched in 2023. It aims to establish scientific, fair, and open benchmarks, methodologies, and tools to help researchers assess model and training algorithm performance. It features:
- **Multi-dimensional Evaluation**: Supports 800+ model evaluations across NLP, CV, Audio, and Multimodal fields, covering 20+ downstream tasks including language understanding and image-text generation.
- **Industry-Grade Use Cases**: Has completed horizontal evaluations of mainstream large models, providing authoritative benchmarks for chip-model performance validation.

# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support

# License
The model weights are derived from HY/HY4-flash and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
