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
- Released **FlagOS-Ascend** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics | MiniMax-M3.1-Flash-Nvidia-Origin | MiniMax-M3.1-Flash-Ascend-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| Math_500     | 93.40                            | 93.80                                |
| GPQA_Diamond | 88.89                            | 88.38                                |
| ERQA         | 65.75                            | 66.5                          |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 20.10.8 |
| Operating System | openEuler 22.03 (LTS-SP4) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minimax-m31-w8a8-ascend001-gems0.0-tree0.6.1-cxnone-pluginnone-vllmnone-sglang0.5.20-sglangfl0.1.0-cp311-ptnpu210-cann90-a64-none:202610221852
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniMax-M3.1-Flash-W8A8-ascend-FlagOS-Express --local_dir /data/MiniMax-M3.1-Flash
```

### Start the Container
```bash
mkdir -p ./minimax-m31-logs

docker run -d \
  --name minimax-m31-w8a8 \
  --privileged \
  --network host \
  --ipc host \
  --shm-size 100g \
  --security-opt label=disable \
  -v /usr/local/Ascend/driver:/usr/local/Ascend/driver \
  -v /usr/local/Ascend/firmware:/usr/local/Ascend/firmware \
  -v /etc/ascend_install.info:/etc/ascend_install.info \
  -v /etc/localtime:/etc/localtime:ro \
  -v /etc/timezone:/etc/timezone:ro \
  -v /path/to/MiniMax-M3.1-w8a8:/models/MiniMax-M3.1-w8a8:ro \
  -v "$(pwd)/minimax-m31-logs:/var/log/minimax-m31" \
  harbor.baai.ac.cn/flagrelease-public/minimax-m31-w8a8-ascend001-gems0.0-tree0.6.1-cxnone-pluginnone-vllmnone-sglang0.5.20-sglangfl0.1.0-cp311-ptnpu210-cann90-a64-none:202610221852 \
  sleep infinity
```
### Start the Server
```bash
docker exec -i minimax-m31-w8a8 bash -c 'cat > /tmp/launch-minimax-m31.sh' <<'BASH'
#!/usr/bin/env bash
set -eo pipefail

# Use a fresh directory for each launch: graph audit files identify one process/run.
mkdir -p /var/log/minimax-m31
RUN_DIR="$(mktemp -d /var/log/minimax-m31/run-XXXXXXXX)"
ln -sfn "$(basename "$RUN_DIR")" /var/log/minimax-m31/latest
exec >"$RUN_DIR/server.log" 2>&1

source /usr/local/Ascend/ascend-toolkit/set_env.sh
source /usr/local/Ascend/cann-9.0.0/share/info/ascendnpu-ir/bin/set_env.sh
source /usr/local/Ascend/nnal/atb/set_env.sh

export PYTHONUNBUFFERED=1
export GLOO_SOCKET_IFNAME=lo
export HCCL_CONNECT_TIMEOUT=7200
export HCCL_EXEC_TIMEOUT=180
export HCCL_OP_EXPANSION_MODE=AICPU_CacheDisable
export TASK_QUEUE_ENABLE=0
export SGLANG_FL_ASCEND_STAGE_DIAGNOSTICS=1
export SGLANG_FL_ASCEND_SERIAL_GRAPH_UPDATE=1
export SGLANG_FL_ASCEND_SCHEDULER_CPU_PARTITION=0
export DEEP_USE_MODE=default
export LD_LIBRARY_PATH="/usr/local/python3.11.15/lib/python3.11/site-packages/deep_ep/vendors/hwcomputing/op_api/lib:${LD_LIBRARY_PATH:-}"
export DEEP_NORMAL_MODE_USE_INT8_QUANT=1
export HCCL_BUFFSIZE=768
export DEEPEP_HCCL_BUFFSIZE=768
export SGLANG_DEEPEP_NUM_MAX_DISPATCH_TOKENS_PER_RANK=16
export DEEPEP_NORMAL_LONG_SEQ_PER_ROUND_TOKENS=2048
export DEEPEP_NORMAL_LONG_SEQ_ROUND=1
export DEEPEP_NORMAL_COMBINE_ENABLE_LONG_SEQ=0
export SGLANG_FL_ASCEND_MINIMAX_FUSED_KV_STORE=1
export SGLANG_FL_ASCEND_MINIMAX_DECODE_IFA=1
export SGLANG_FL_ASCEND_GRAPH_AUDIT=1
export SGLANG_FL_ASCEND_GRAPH_AUDIT_DIR="$RUN_DIR/audit"
export SGLANG_FL_ASCEND_MINIMAX_EMPTY_GRAPH_UPDATE=0
export SGLANG_FL_ASCEND_TP_AIV=1
export SGLANG_FL_ASCEND_MINIMAX_VECTOR_INDEXER=1
export SGLANG_FL_ASCEND_MINIMAX_FUSED_MERGE=1
export SGLANG_FL_ASCEND_MINIMAX_ELIDE_SCORE_FILLS=1
export SGLANG_FL_ASCEND_MINIMAX_PREFILL_META=0
export SGLANG_FL_ASCEND_MINIMAX_PREFILL_CAUSAL=1
export SGLANG_FL_ASCEND_MINIMAX_PREFILL_FUTURE_SKIP=1
export MINIMAX_NPU_PREFILL_SCORE_BLOCKS_PER_STEP=1
export SYNC_TOKEN_IDS_ACROSS_TP=1
export SGLANG_PLUGINS=sglang_fl
export SGLANG_FL_DIST_BACKEND=hccl
export SGLANG_FL_PREFER=vendor
export SGLANG_FL_DISAGG_FLAGCX=0
export USE_FLAGGEMS=1
export SGLANG_FL_FLAGOS_WHITELIST=add
export SGLANG_FLAGGEMS_RECORD=1
export SGLANG_FLAGGEMS_LOG_PATH="$RUN_DIR/gems_aten.log"

exec python3 -m sglang.launch_server \
  --model-path /models/MiniMax-M3.1-w8a8 \
  --served-model-name MiniMax-M3.1 \
  --trust-remote-code \
  --device npu \
  --attention-backend ascend \
  --sampling-backend pytorch \
  --tp-size 16 \
  --dp-size 4 \
  --ep-size 16 \
  --moe-a2a-backend deepep \
  --deepep-mode auto \
  --deepep-dispatcher-output-dtype int8 \
  --enable-dp-attention \
  --nnodes 1 \
  --node-rank 0 \
  --dist-init-addr 127.0.0.1:29600 \
  --nccl-port 29620 \
  --random-seed 1012273410 \
  --host 0.0.0.0 \
  --port 33013 \
  --context-length 67584 \
  --page-size 128 \
  --mem-fraction-static 0.92 \
  --max-total-tokens 477184 \
  --chunked-prefill-size 32768 \
  --disable-radix-cache \
  --disable-overlap-schedule \
  --skip-server-warmup \
  --cuda-graph-backend-decode full \
  --cuda-graph-backend-prefill disabled \
  --cuda-graph-max-bs-decode 16 \
  --max-running-requests 68 \
  --pp-max-micro-batch-size 16 \
  --cuda-graph-bs-decode 4 8 12 16
BASH

docker exec -d minimax-m31-w8a8 bash /tmp/launch-minimax-m31.sh
```

## Service Invocation
### Invocation Script
```bash
curl -sS --noproxy '*' http://127.0.0.1:33013/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "MiniMax-M3.1",
    "messages": [
      {"role": "user", "content": "Compute 12 + 30. End with exactly: Answer: 42."}
    ],
    "temperature": 1.0,
    "top_p": 0.95,
    "top_k": -1,
    "seed": 20261022,
    "max_tokens": 512,
    "stream": false
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
