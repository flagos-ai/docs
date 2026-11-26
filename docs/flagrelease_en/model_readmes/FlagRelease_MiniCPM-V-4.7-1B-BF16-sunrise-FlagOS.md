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
- Released **FlagOS-Sunrise** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniCPM-V-4.7-1B-Nvidia-Origin | MiniCPM-V-4.7-1B-Sunrise-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| Math_500     | 71.20                          | 70.20                                |
| MMLU_Pro     | 45.86                          | 44.57                                |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 28.5.1 |
| Operating System | 22.04.5 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minicpmv47-1b-sunrise001-gems0.0-tree0.6.0-cxnone-plugin0.0.0-vllm0.24.0-sglangnone-sglangflnone-cp310-ptpu0.2.3-tang0.25.0-x64-0.25.0:202610120823

```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-V-4.7-1B-BF16-sunrise-FlagOS --local_dir /data/MiniCPM-V-4.7-1B
```

### Start the Container
```bash
docker run -dit --name minicpmv47-1b \
  --privileged --network host --ipc host --shm-size=128g --workdir /workspace \
  -v /data:/data \
  -v /usr/local/tangrt:/usr/local/tangrt:ro \
  -v /usr/local/pccl:/usr/local/pccl:ro \
  --entrypoint /bin/bash \
  harbor.baai.ac.cn/flagrelease-public/minicpmv47-1b-sunrise001-gems0.0-tree0.6.0-cxnone-plugin0.0.0-vllm0.24.0-sglangnone-sglangflnone-cp310-ptpu0.2.3-tang0.25.0-x64-0.25.0:202610120823 -lc 'sleep infinity'

docker exec -it minicpmv47-1b /bin/bash

```

### Start the Server
```bash
export PATH=/flagos/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export LD_LIBRARY_PATH=/usr/local/tangrt/targets/linux-x86_64/lib:/usr/local/tangrt/lib/linux-x86_64
export PYTHONPATH=/opt/flagtree
export VLLM_PLUGINS=fl
export VLLM_FL_PREFER_ENABLED=True
export VLLM_FL_PREFER=flagos
export VLLM_FL_DISPATCH_DEBUG=0
export VLLM_FL_SUNRISE_OPMGR_FAST=1
export VLLM_FL_SUNRISE_OOT_FAST=1
export VLLM_FL_SUNRISE_PTPU_SAMPLER=1
export VLLM_FL_SUNRISE_PTPU_PENALTIES_BINCOUNT=1
export VLLM_FL_SUNRISE_CUDAGRAPH_DEBUG_SYNC=0
export TANG_VISIBLE_DEVICES=0
unset VLLM_FL_FLAGOS_WHITELIST VLLM_FL_FLAGOS_BLACKLIST PCCL_PROTO TA_CLOSE_GRAPH_MEMORY
export VLLM_FL_FLAGOS_BLACKLIST_APPEND=linear,broadcast_to,sort,sort_stable
export RUN_DIR=/data/minicpmv47-runtime/1b/31101
export FLAGGEMS_CACHE_DIR="$RUN_DIR/flaggems"
export TRITON_CACHE_DIR="$RUN_DIR/triton"
export TORCHINDUCTOR_CACHE_DIR="$RUN_DIR/torchinductor"
export HF_HOME="$RUN_DIR/huggingface"
export FLAGGEMS_ENABLE_OPLIST_PATH="$RUN_DIR/flaggems-oplist.log"
mkdir -p "$FLAGGEMS_CACHE_DIR" "$TRITON_CACHE_DIR" "$TORCHINDUCTOR_CACHE_DIR" "$HF_HOME"
python - <<'PY'
import os, pathlib, sqlite3, triton
major, minor = triton.__version__.split('.')[:2]
root = pathlib.Path(os.environ['FLAGGEMS_CACHE_DIR']) / 'config_cache'
root.mkdir(parents=True, exist_ok=True)
with sqlite3.connect(root / f'TunedConfig_sunrise_triton_{major}_{minor}.db', timeout=30) as db:
    db.execute('PRAGMA journal_mode=WAL')
    db.execute('PRAGMA synchronous=NORMAL')
PY

nohup vllm serve /data/MiniCPM-V-4.7-1B \
  --trust-remote-code --host 0.0.0.0 --port 31101 \
  --served-model-name MiniCPM-V-4.7-1B --tensor-parallel-size 1 \
  --skip-mm-profiling --max-model-len 262144 \
  --max-num-batched-tokens 16384 --gpu-memory-utilization 0.80 \
  --compilation-config '{"mode":0,"cudagraph_mode":"FULL_DECODE_ONLY","cudagraph_capture_sizes":[1,2,4,8,16,32,64,128],"max_cudagraph_capture_size":128}' \
  > "$RUN_DIR/service.log" 2>&1 < /dev/null &
tail -n 60 "$RUN_DIR/service.log"
```

## Service Invocation
### Invocation Script
```bash
curl -sS --max-time 180 http://127.0.0.1:31101/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"MiniCPM-V-4.7-1B","messages":[{"role":"user","content":"23乘17是多少？请简短思考并给出答案。"}],"chat_template_kwargs":{"enable_thinking":true},"temperature":1,"top_p":0.95,"top_k":20,"seed":1234,"max_tokens":4096}'

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

