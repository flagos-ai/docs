---
license: apache-2.0
language:
- zh
- en
---

# Introduction
MiniMax has released MiniMax-M3.1-Flash, its new-generation Flash model. Zhongzhi FlagOS Community has completed Day-0 cross-chip enablement across platforms from nine chip vendors — T-Head, NVIDIA, Huawei Ascend, Hygon, Kunlunxin, MetaX, Moore Threads, Tsingmicro(清微智能) and Iluvatar CoreX — and developers can download and use the model via ModelScope and Hugging Face. Thanks to optimizations in FlagOS 2.2, benchmarks show that on NVIDIA H100 the FlagOS build delivers, out of the box, up to 59.2% lower first-token latency and up to 10.6% higher output throughput than NVIDIA's native stack. With 32K-token inputs, the FlagOS builds on T-Head, Huawei Ascend, Kunlunxin and other platforms reach throughput per unit of compute equal to 165.0%, 99.5% and 85.9% of NVIDIA's native performance — results ranging from close to parity to well above it. The model brings further gains in agent tasks, coding, computer use and cybersecurity, supporting use cases such as complex business processes, software development and operations across applications. It uses a more aggressive sparse-attention architecture to further improve inference efficiency. According to MiniMax, it delivers 200+ tokens/s in everyday use and cuts the total cost of agentic tasks by 70% versus the previous generation.


### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Iluvatar** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniMax-M3.1-Flash-Nvidia-Origin | MiniMax-M3.1-Flash-Iluvatar-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| Math_500     | 93.40                            | Evaluating                           |
| GPQA_Diamond | 88.89                            | Evaluating                           |
| ERQA         | 65.75                            | Evaluating                           |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| vLLM | 0.24.0 |
| vllm-plugin-FL | 0.1.dev0 |
| FlagTree | 0.7.0rc2+iluvatar3.6 |
| Triton runtime | 3.6.0 |
| FlagGems | 5.3.4.post1.dev11+gbc6d9426c |
| Python / PyTorch runtime | 3.12.11 / 2.10.0 |
| CoreX / driver | 4.5.0 / 4.5.0 |
| TP / PP | 16 / 1 |
| Maximum context length | 80000 tokens |
| Maximum scheduled sequences | 8 |
| Main KV / index KV | fp8_e4m3 / bf16 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-iluvatar-release-model_minimax-m3.1-flash-w8a8-tree_0.7.0rc2.iluvatar3.6-gems_5.3.4.post1.dev11-cx_none-python_3.12.11-torch_cuda-2.10.0-pcp_corex4.5.0-gpu_iluvatar001-arc_amd64-driver_4.5.0:202610221909
```

### Download Open-source Model Weights
```bash
# Provide the matching MiniMax-M3.1 Flash W8A8 checkpoint through your authorized model distribution. This image release does not publish model weights or create a ModelScope/Hugging Face model repository. Set `MODEL_DIR` to your local checkpoint directory; the example default is `/data/MiniMax-M3.1-Flash-W8A8-iluvatar-FlagOS`.
pip install modelscope
modelscope download --model FlagRelease/MiniMax-M3.1-Flash-W8A8-iluvatar-FlagOS --local_dir /data/MiniMax-M3.1-Flash-W8A8-iluvatar-FlagOS
```

### Start the Container
```bash
(
(
set -euo pipefail

MODEL_DIR="${MODEL_DIR:-/data/MiniMax-M3.1-Flash-W8A8-iluvatar-FlagOS}"
test -f "$MODEL_DIR/config.json"

docker create \
  --name flagos \
  --network=host \
  --shm-size=16g \
  --restart=unless-stopped \
  --mount "type=bind,source=${MODEL_DIR},target=/data/MiniMax-M3.1-Flash-W8A8-iluvatar-FlagOS,readonly" \
  --device /dev/iluvatar0 \
  --device /dev/iluvatar1 \
  --device /dev/iluvatar2 \
  --device /dev/iluvatar3 \
  --device /dev/iluvatar4 \
  --device /dev/iluvatar5 \
  --device /dev/iluvatar6 \
  --device /dev/iluvatar7 \
  --device /dev/iluvatar8 \
  --device /dev/iluvatar9 \
  --device /dev/iluvatar10 \
  --device /dev/iluvatar11 \
  --device /dev/iluvatar12 \
  --device /dev/iluvatar13 \
  --device /dev/iluvatar14 \
  --device /dev/iluvatar15 \
  --device /dev/itrctl:/dev/itrctl:rw \
  --env PYTHONPATH=/repro/fp8-plugin-source \
  --env M31_VISION_OBSERVE_DIR=/tmp/minimax-m31-vision \
  --env VLLM_USE_BREAKABLE_CUDAGRAPH=1 \
  --env OMP_NUM_THREADS=2 \
  --env OPENBLAS_NUM_THREADS=1 \
  --env GEMS_VENDOR=iluvatar \
  --env DNN_VENDOR=iluvatar \
  --env VLLM_FL_PLATFORM=iluvatar \
  --env VLLM_PLUGINS=fl \
  --env FLAGTREE_AABS=0 \
  --env CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15 \
  --env VLLM_FL_FLAGOS_BLACKLIST=sort,sort_stable \
  --env VLLM_WORKER_MULTIPROC_METHOD=spawn \
  --env NCCL_SOCKET_IFNAME==lo \
  --env NCCL_IB_DISABLE=1 \
  --env GLOO_SOCKET_IFNAME=lo \
  --env VLLM_HOST_IP=127.0.0.1 \
  --env HF_HUB_OFFLINE=1 \
  --env TOKENIZERS_PARALLELISM=false \
  --env VLLM_ENGINE_READY_TIMEOUT_S=3600 \
  --env VLLM_ENGINE_ITERATION_TIMEOUT_S=180 \
  --env TRITON_CACHE_DIR=/repro/cache/release-m31/triton \
  --env TORCHINDUCTOR_CACHE_DIR=/repro/cache/release-m31/inductor \
  --env TORCH_HOME=/repro/cache/release-m31/torch \
  --env HF_HOME=/repro/cache/release-m31/huggingface \
  --env XDG_CACHE_HOME=/repro/cache/release-m31/xdg \
  --env VLLM_CACHE_ROOT=/repro/cache/release-m31/vllm \
  --entrypoint /repro/env/bin/vllm \
harbor.baai.ac.cn/flagrelease-public/flagrelease-iluvatar-release-model_minimax-m3.1-flash-w8a8-tree_0.7.0rc2.iluvatar3.6-gems_5.3.4.post1.dev11-cx_none-python_3.12.11-torch_cuda-2.10.0-pcp_corex4.5.0-gpu_iluvatar001-arc_amd64-driver_4.5.0:202610221909 \
  serve /data/MiniMax-M3.1-Flash-W8A8-iluvatar-FlagOS \
  --served-model-name minimax-m31 \
  --host 0.0.0.0 \
  --port 8000 \
  --dtype bfloat16 \
  --quantization compressed-tensors \
  --tensor-parallel-size 16 \
  --pipeline-parallel-size 1 \
  --distributed-executor-backend mp \
  --gpu-memory-utilization 0.90 \
  --kv-cache-memory-bytes 4026531840 \
  --max-model-len 80000 \
  --max-num-seqs 8 \
  --max-num-batched-tokens 128 \
  --block-size 128 \
  --kv-cache-dtype fp8_e4m3 \
  --attention-config '{"indexer_kv_dtype":"bf16"}' \
  --no-enable-prefix-caching \
  --disable-custom-all-reduce \
  --no-async-scheduling \
  --load-format safetensors \
  --safetensors-load-strategy lazy \
  --reasoning-parser minimax_m3 \
  --compilation-config '{"mode":0,"cudagraph_mode":"FULL_DECODE_ONLY","cudagraph_capture_sizes":[8],"cudagraph_num_of_warmups":1}' \
  --chat-template /data/MiniMax-M3.1-Flash-W8A8-iluvatar-FlagOS/chat_template.jinja \
  --limit-mm-per-prompt '{"image":18,"video":0}'

release_runtime_dirs=$(mktemp -d)
mkdir -p "$release_runtime_dirs/release-m31/triton" "$release_runtime_dirs/minimax-m31-vision"
docker cp "$release_runtime_dirs/release-m31" flagos:/repro/cache/release-m31
docker cp "$release_runtime_dirs/minimax-m31-vision" flagos:/tmp/minimax-m31-vision
rm -rf "$release_runtime_dirs"
)

)
```
### Start the Server
```bash
docker start flagos
docker logs --tail 50 flagos
```

## Service Invocation
### Invocation Script
```bash
curl --noproxy '*' http://127.0.0.1:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"minimax-m31","messages":[{"role":"user","content":"1+1等于几？请简短回答。"}],"temperature":0,"max_tokens":256}'
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
The model weights are derived from MiniMaxAI/MiniMax-M3.1-Flash and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
