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
- Released **FlagOS-Metax** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics | MiniMax-M3.1-Flash-Nvidia-Origin | MiniMax-M3.1-Flash-Metax-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| Math_500     | 93.40                            | Evaluating                           |
| GPQA_Diamond | 88.89                            | Evaluating                           |
| ERQA         | 65.75                            | Evaluating                           |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 29.3.1 |
| Operating System | 22.04 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minimax-m3.1-w8a8-metax001-gems5.3.2-tree0.6.0-cxnone-plugin0.0.0-vllm0.1-sglangnone-sglangflnone-cp312-pt28-maca37-x64-3.8.1:202610221902
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniMax-M3.1-Flash-metax-FlagOS --local_dir /data/MiniMax-M3.1-Flash
```

### Start the Container
```bash
IMAGE='harbor.baai.ac.cn/flagrelease-public/minimax-m3.1-w8a8-metax001-gems5.3.2-tree0.6.0-cxnone-plugin0.0.0-vllm0.1-sglangnone-sglangflnone-cp312-pt28-maca37-x64-3.8.1:202610221902'
HEAD_IP=<Node 1 IP>
NODE_IP=<Node 1 IP>  # worker 上改为 <Node 2 IP>
COMM_IFACE=inbond1
WORK_DIR=/public-flash/liyan/minimax-m31-runtime

mkdir -p "$WORK_DIR"

docker run -d \
  --name minimax-m31-metax \
  --network host \
  --shm-size 64g \
  --device /dev/dri \
  --device /dev/mxcd \
  -v /path/to/MiniMax-M3.1-w8a8:/models/MiniMax-M3.1-w8a8:ro \
  -v "$WORK_DIR:/runtime" \
  -e HEAD_IP="$HEAD_IP" \
  -e NODE_IP="$NODE_IP" \
  -e COMM_IFACE="$COMM_IFACE" \
  --entrypoint /bin/bash \
  "$IMAGE" -lc 'exec sleep infinity'
```
### Start the Server
```bash
cat > /runtime/env.sh <<'EOF'
export GEMS_VENDOR=metax
export VLLM_PLUGINS=fl
export USE_FLAGGEMS=1
export VLLM_WORKER_MULTIPROC_METHOD=spawn
export VLLM_USE_BREAKABLE_CUDAGRAPH=0
export GLOO_SOCKET_IFNAME="${COMM_IFACE:?}"
export MCCL_SOCKET_IFNAME="$COMM_IFACE"
export VLLM_HOST_IP="${NODE_IP:?}"
export RAY_EXPERIMENTAL_NOSET_CUDA_VISIBLE_DEVICES=1
export RAY_ADDRESS="${HEAD_IP:?}:26379"
export RAY_USAGE_STATS_ENABLED=0
export TORCHINDUCTOR_COMPILE_THREADS=1
export TORCH_COMPILE_DISABLE=
export VLLM_FL_FLAGOS_WHITELIST=add,fused_moe
unset VLLM_FL_FLAGOS_BLACKLIST VLLM_FL_FLAGOS_BLACKLIST_APPEND
export VLLM_FL_USE_FLAGGEMS_ATTN=0
export VLLM_ENGINE_ITERATION_TIMEOUT_S=7200
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=6000
export VLLM_ENGINE_READY_TIMEOUT_S=3600
export VLLM_CACHE_ROOT="/runtime/cache/vllm-$NODE_IP"
export TRITON_CACHE_DIR="/runtime/cache/triton-$NODE_IP"
export TORCHINDUCTOR_CACHE_DIR="/runtime/cache/inductor-$NODE_IP"
export FLAGGEMS_CACHE_DIR="/runtime/cache/flaggems-$NODE_IP"
export FLAGGEMS_ENABLE_OPLIST_PATH="/runtime/logs/flaggems-enabled-$NODE_IP.log"
export VLLM_RAY_EXTRA_ENV_VARS_TO_COPY=TORCH_COMPILE_DISABLE,TORCHINDUCTOR_COMPILE_THREADS,GEMS_VENDOR,USE_FLAGGEMS,GLOO_SOCKET_IFNAME,MCCL_SOCKET_IFNAME,FLAGGEMS_CACHE_DIR,FLAGGEMS_ENABLE_OPLIST_PATH
export PYTHONUNBUFFERED=1
mkdir -p /runtime/logs "$VLLM_CACHE_ROOT" "$TRITON_CACHE_DIR" \
  "$TORCHINDUCTOR_CACHE_DIR" "$FLAGGEMS_CACHE_DIR"
EOF

# head node (node 0)
source /runtime/env.sh
env -u RAY_ADDRESS /opt/conda/bin/ray start \
  --head \
  --port=26379 \
  --dashboard-port=18265 \
  --ray-client-server-port=23001 \
  --min-worker-port=24000 --max-worker-port=24999 \
  --node-ip-address="$NODE_IP" \
  --num-gpus=8 --num-cpus=16 \
  --temp-dir=/runtime/ray-head \
  --disable-usage-stats

# worker node (node 1)
source /runtime/env.sh
env -u RAY_ADDRESS /opt/conda/bin/ray start \
  --address="$HEAD_IP:26379" \
  --node-ip-address="$NODE_IP" \
  --num-gpus=8 --num-cpus=16 \
  --min-worker-port=24000 --max-worker-port=24999 \
  --temp-dir=/runtime/ray-worker \
  --disable-usage-stats
```

## Service Invocation
### Invocation Script
```bash
SERVER=http://<Node 1 IP>:18100

curl -fsS --max-time 10 -w '\nHTTP %{http_code}\n' "$SERVER/health"
curl -fsS --max-time 10 "$SERVER/v1/models"

curl -fsS --max-time 120 "$SERVER/v1/chat/completions" \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "minimax-m3.1-w8a8",
    "messages": [{"role": "user", "content": "17 × 23 等于多少？只输出结果。"}],
    "temperature": 0,
    "max_tokens": 64,
    "chat_template_kwargs": {"thinking_mode": "disabled"}
  }'
```

# Technical Overview
**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a "develop once, run anywhere" workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of \<chip + open-source model\>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.
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
