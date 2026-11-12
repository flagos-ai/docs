---
license: apache-2.0
language:
- zh
- en
---

# Introduction
ModelBest, together with OpenBMB, has open-sourced MiniCPM-V4.7, a next-generation on-device multimodal large model, releasing two variants at once: 1B and 35B-A3B (MoE). Based on the FlagOS unified multi-chip software stack, the Zhongzhi FlagOS community completed day-0 cross-chip adaptation covering 12 platforms: T-Head, NVIDIA, Huawei Ascend, Hygon, Kunlunxin, MetaX, Moore Threads, Tsingmicro, Iluvatar CoreX, Sunrise, Mac (M5 Pro), and CIX P1. Model images are now available on ModelScope and HuggingFace simultaneously. This adaptation extends both model variants to ARM edge CPU platforms, enabling viable deployment of multimodal understanding on both data-center and end-user devices. The 1B version has an actual parameter count of approximately 1.3B. Despite its extremely small footprint, it delivers top-tier performance within its size class and performs strongly on tasks including general vision, OCR, chart reasoning, and video understanding, bringing multimodal capabilities to more everyday devices and usage scenarios. The model retains the early-compression-within-ViT technique and 4×/16× visual token compression, and supports DSpark speculative decoding to balance visual detail and inference efficiency. In official Instruct-mode evaluations, the 35B-A3B and 1B models achieved higher overall scores than Qwen3.6-35B-A3B and Qwen3.5-0.8B respectively, with shorter inference time.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniCPM-V-4.7-1B-Nvidia-Origin | MiniCPM-V-4.7-1B-Mthreads-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| Math_500     | 71.20                          | 73.40                                |
| MMLU_Pro     | 47.6                           | 47.29                                |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 29.3.1 |
| Operating System | 22.04.5 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minicpmv47-1b-mthreads001-gems0.0.0-treenone-cx0.13.0-pluginnone-vllm0.10.1-sglang0.0.0-sglangfl0.1.0-cp310-pt29-musa43-x64-3.3.5-server:202610121147

```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-V-4.7-1B-BF16-mthreads-FlagOS --local_dir /data/MiniCPM-V-4.7-1B
```

### Start the Container
```bash
docker run -d --name minicpmv47-1b \
  --runtime mthreads --network host --ipc host --privileged \
  --security-opt label=disable --ulimit memlock=-1:-1 --shm-size 512g \
  --workdir /workspace \
  -e MUSA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7 \
  -v /data:/data \
  harbor.baai.ac.cn/flagrelease-public/minicpmv47-1b-mthreads001-gems0.0.0-treenone-cx0.13.0-pluginnone-vllm0.10.1-sglang0.0.0-sglangfl0.1.0-cp310-pt29-musa43-x64-3.3.5-server:202610121147 sleep infinity

docker exec -it minicpmv47-1b /bin/bash
```
### Start the Server
```bash
mkdir -p /var/cache/minicpm-v47/triton-30347 /var/cache/minicpm-v47/flaggems /var/log/minicpm-v47

nohup env \
  MTHREADS_VISIBLE_DEVICES=0 \
  MUSA_VISIBLE_DEVICES=0 \
  TRITON_CACHE_DIR=/var/cache/minicpm-v47/triton-30347 \
  FLAGGEMS_CACHE_DIR=/var/cache/minicpm-v47/flaggems \
  SGLANG_PLUGINS=sglang_fl \
  SGLANG_FL_VENDOR=mthreads \
  SGLANG_FLAGGEMS_RECORD=1 \
  SGLANG_FLAGGEMS_LOG_PATH=/var/log/minicpm-v47/flaggems-30347.log \
  SGLANG_FL_DISPATCH_DEBUG=1 \
  SGLANG_FL_DISPATCH_LOG=/var/log/minicpm-v47/dispatch-30347.log \
  SGLANG_FL_FLAGOS_BLACKLIST='count_nonzero,cumsum,mm,linear,unique,_unique2,unique_dim,unique_consecutive,mul,sort,argsort,uniform,uniform_,pin_memory,_pin_memory,_foreach_copy_' \
  SGLANG_MUSA_FLAGOS_CHUNK_GDN=1 \
  SGLANG_MUSA_FUSED_GDN_HO=1 \
  SGLANG_MUSA_KERNELGEN_PACKED_GDN=0 \
  SGLANG_MUSA_KV_INDEX_PUT_NATIVE=0 \
  SGLANG_ALLOW_OVERWRITE_LONGER_CONTEXT_LEN=1 \
  SGLANG_MOE_PADDING=1 \
  TORCH_COMPILE_DISABLE=1 \
  SGLANG_SET_CPU_AFFINITY=1 \
  SGLANG_USE_DEEPGEMM_BMM=0 \
  SGLANG_USE_MUSA_FUSED_KERNEL=1 \
  VLLM_PATCH_MUSA_CUSTOM_OPS=1 \
  bash -c 'exec python -m sglang.launch_server \
    --model-path /data/MiniCPM-V-4.7-1B \
    --served-model-name MiniCPM-V-4.7-1B --host 0.0.0.0 --port 30347 \
    --tp-size 1 --base-gpu-id 0 --context-length 262144 --mem-fraction-static 0.75 \
    --max-running-requests 64 --chunked-prefill-size 65536 --max-prefill-tokens 65536 \
    --page-size 1 --disable-radix-cache --cuda-graph-bs-decode 1 8 16 32 64 \
    --num-continuous-decode-steps 4 --random-seed 448476061 \
    --log-level-http warning --watchdog-timeout 1800 \
    > /var/log/minicpm-v47/serve-30347.log 2>&1' \
  >/dev/null 2>&1 &
```

## Service Invocation
### Invocation Script
```bash
curl -sS --max-time 60 http://127.0.0.1:30347/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "MiniCPM-V-4.7-1B",
    "messages": [
      {"role": "user", "content": "你好"}
    ],
    "max_tokens": 16,
    "temperature": 0
  }' | python -m json.tool
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
The model weights are derived from OpenBMB/MiniCPM-V-4.7-1B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
