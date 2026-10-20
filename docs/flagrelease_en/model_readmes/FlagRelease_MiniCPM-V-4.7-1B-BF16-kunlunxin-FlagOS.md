---
frameworks:
- ""
language:
- zh
- en
license: apache-2.0
---

# Introduction
ModelBest, together with OpenBMB, has open-sourced MiniCPM-V4.7, a next-generation on-device multimodal large model, releasing two variants at once: 1B and 35B-A3B (MoE). Based on the FlagOS unified multi-chip software stack, the Zhongzhi FlagOS community completed day-0 cross-chip adaptation covering 12 platforms: T-Head, NVIDIA, Huawei Ascend, Hygon, Kunlunxin, MetaX, Moore Threads, Tsingmicro, Iluvatar CoreX, Sunrise, Mac (M5 Pro), and CIX P1. Model images are now available on ModelScope and HuggingFace simultaneously. This adaptation extends both model variants to ARM edge CPU platforms, enabling viable deployment of multimodal understanding on both data-center and end-user devices. The 1B version has an actual parameter count of approximately 1.3B. Despite its extremely small footprint, it delivers top-tier performance within its size class and performs strongly on tasks including general vision, OCR, chart reasoning, and video understanding, bringing multimodal capabilities to more everyday devices and usage scenarios. The model retains the early-compression-within-ViT technique and 4×/16× visual token compression, and supports DSpark speculative decoding to balance visual detail and inference efficiency. In official Instruct-mode evaluations, the 35B-A3B and 1B models achieved higher overall scores than Qwen3.6-35B-A3B and Qwen3.5-0.8B respectively, with shorter inference time.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Kunlunxin** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniCPM-V-4.7-1B-Nvidia-Origin | MiniCPM-V-4.7-1B-Kunlunxin-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| Math_500     | 71.20                          | 73.00                                |
| MMLU_Pro     | 45.86                          | 45.71                                |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 20.10.12 |
| Operating System | 22.04 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minicpm-v47-1b-kunlunxin001-gems5.4.0-treenone-cx0.13.0-plugin0.0-vllm0.24.0-sglangnone-sglangflnone-cp310-pt29-xrt513-x64-5.0.21.47:202610121016

```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-V-4.7-1B-BF16-kunlunxin-FlagOS --local_dir /data/MiniCPM-V-4.7-1B
```

### Start the Container
```bash
docker run -d --name minicpm-v47-1b --init --privileged \
  --network host --shm-size 128g --cap-add SYS_PTRACE \
  --security-opt seccomp=unconfined --security-opt label=disable \
  --ulimit memlock=-1:-1 --ulimit nofile=120000:120000 \
  --ulimit stack=67108864:67108864 \
  -e CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7 -e TZ=Asia/Shanghai \
  -v /data:/data \
  --entrypoint /bin/bash harbor.baai.ac.cn/flagrelease-public/minicpm-v47-1b-kunlunxin001-gems5.4.0-treenone-cx0.13.0-plugin0.0-vllm0.24.0-sglangnone-sglangflnone-cp310-pt29-xrt513-x64-5.0.21.47:202610121016 -lc 'sleep infinity'

docker exec -it minicpm-v47-1b /bin/bash
```
### Start the Server
```bash
export TASK_ROOT="$PWD"
export CUDA_VISIBLE_DEVICES=0
export MODEL_DIR=/data/models/MiniCPM-V-4.7-1B
export SERVICE_PORT=8111
export SERVED_MODEL_NAME=MiniCPM-V-4.7-1B
export MINICPM_RUNTIME_DIR="$TASK_ROOT/runtime/1b-8111"
export VLLM_PLUGINS=fl VLLM_FL_PLATFORM=kunlunxin
export VLLM_FL_PREFER_ENABLED=True VLLM_FL_PREFER=flagos
export USE_FLAGGEMS=1 USE_RESHAPE_AND_CACHE_FLASH=1
export VLLM_ENABLE_V1_MULTIPROCESSING=0
export VLLM_FL_FLAGOS_BLACKLIST_APPEND=_scaled_dot_product_efficient_attention,_scaled_dot_product_flash_attention,zeros,zero_,sum_dim,mul,pow_tensor_scalar,true_divide,cat,to_copy,add,silu,sigmoid,gt_scalar,clamp_min,index
export FLAGCX_PATH=/opt/kunlun/lib
export FLAGGEMS_CACHE_DIR="$MINICPM_RUNTIME_DIR/flaggems"
export TRITON_CACHE_DIR="$MINICPM_RUNTIME_DIR/triton"
export HF_HOME="$MINICPM_RUNTIME_DIR/huggingface"
mkdir -p "$FLAGGEMS_CACHE_DIR" "$TRITON_CACHE_DIR" "$HF_HOME"

/root/miniconda/envs/python310_torch29_cuda/bin/vllm serve /data/MiniCPM-V-4.7-1B \
  --trust-remote-code --host 0.0.0.0 --port "$SERVICE_PORT" \
  --served-model-name "$SERVED_MODEL_NAME" \
  --tensor-parallel-size 1 --dtype bfloat16 \
  --mamba-ssm-cache-dtype float32 --block-size 128 \
  --max-model-len 262144 --max-num-batched-tokens 65536 \
  --max-num-seqs 64 --gpu-memory-utilization 0.75 \
  --mm-processor-cache-gb 0 --skip-mm-profiling \
  --disable-custom-all-reduce
```

## Service Invocation
### Invocation Script
```bash
curl -sS --max-time 180 http://127.0.0.1:8111/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"MiniCPM-V-4.7-1B","messages":[{"role":"user","content":"请计算 2+2，只回答结果。"}],"temperature":0,"max_tokens":1024}'

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

