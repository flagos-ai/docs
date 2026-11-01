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
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics | MiniMax-M3.1-Flash-Nvidia-Origin | MiniMax-M3.1-Flash-Mthreads-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| Math_500     | 93.40                            | 94.00                                |
| GPQA_Diamond | 88.89                            | 87.37                                |
| ERQA         | 65.75                            | 65.75                                |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 29.3.1 |
| Operating System | 22.04.5 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagos-inner-models-release/minimax-m3-bf16-mthreads001-gems0.0-tree0.7.0-cx0.13.0-pluginnone-vllm0.10.1-sglang0.5.18-sglangfl0.1.0-cp310-pt29-musa43-x64-3.3.5-server:202610271117
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniMax-M3.1-Flash-W8A8-mthreads-FlagOS --local_dir /data/MiniMax-M3.1-Flash
```

### Start the Container
```bash
docker run -d \
  --name minimax-m3-bf16-sglangfl \
  --hostname "$(hostname)" \
  --runtime=mthreads \
  --network host \
  --ipc host \
  --shm-size 64g \
  --ulimit memlock=-1:-1 \
  --ulimit stack=67108864:67108864 \
  -e MTHREADS_VISIBLE_DEVICES=all \
  -e MTHREADS_DRIVER_CAPABILITIES=all \
  -e MUSA_HOME=/usr/local/musa \
  -e LD_LIBRARY_PATH=/usr/local/musa/lib:/usr/local/openmpi/lib:/usr/local/musa/mudnn/lib: \
  -e PATH=/root/.virtualenvs/sglang-0.5.6/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
  -e VIRTUAL_ENV=/root/.virtualenvs/sglang-0.5.6 \
  -e TORCH_COMPILE_DISABLE=1 \
  -e SGLANG_ALLOW_OVERWRITE_LONGER_CONTEXT_LEN=1 \
  -e SGLANG_BUILD_RUST_EXTS=none \
  -e SGLANG_MOE_PADDING=1 \
  -e SGLANG_MUSA_FP32_TP_ALLREDUCE=1 \
  -e SGLANG_SET_CPU_AFFINITY=1 \
  -e SGLANG_USE_DEEPGEMM_BMM=0 \
  -e SGLANG_USE_MUSA_FUSED_KERNEL=1 \
  -e VLLM_CONFIGURE_LOGGING=0 \
  -e VLLM_PATCH_MUSA_CUSTOM_OPS=1 \
  -v /data:/data \
  --mount type=bind,src=/data/models/MiniMax-M3,dst=/data/models/MiniMax-M3,readonly \
  -v /data/minimax-m3-release/logs:/var/log/minimax-m3 \
  -v /data/minimax-m3-release/cache:/var/cache/minimax-m3 \
  -w /opt/minimax-m3-v451 \
  --entrypoint /bin/bash \
  harbor.baai.ac.cn/flagos-inner-models-release/minimax-m3-bf16-mthreads001-gems0.0-tree0.7.0-cx0.13.0-pluginnone-vllm0.10.1-sglang0.5.18-sglangfl0.1.0-cp310-pt29-musa43-x64-3.3.5-server:202610271117 \
  -lc 'exec sleep infinity'
```
### Start the Server
```bash
case "$(hostname)" in
  bm-mthreads-bjsjq-zone1-moer-s5000-80g-38-7) NODE_RANK=0 ;;
  bm-mthreads-bjsjq-zone1-moer-s5000-80g-38-8) NODE_RANK=1 ;;
  *) echo "Unsupported host: $(hostname)" >&2; exit 1 ;;
esac

export SGLANG_ROPE_CACHE_FP32=1
export USE_FLAGGEMS=1
export SGLANG_FLAGGEMS_RECORD=1
export SGLANG_FLAGGEMS_LOG_PATH=/var/log/minimax-m3/flaggems-rank${NODE_RANK}.txt
export SGLANG_FL_DISPATCH_DEBUG=1
export SGLANG_FL_DISPATCH_LOG=/var/log/minimax-m3/dispatch-rank${NODE_RANK}.log
export SGLANG_FL_FLAGOS_BLACKLIST=broadcast_tensors,slice,eq,eq_scalar,equal,count_nonzero,cumsum,mm,unique,_unique2,unique_dim,unique_consecutive,linear,multinomial
export SGLANG_FL_PER_OP=topk=vendor
export MCCL_TOPO_ENHANCE=0
export MCCL_MIN_NCHANNELS=8
export MCCL_MAX_NCHANNELS=32
export MCCL_PROTO=LL128
export MCCL_SOCKET_IFNAME=ens12np0
export MCCL_SOCKET_NTHREADS=4
export FLAGCX_PATH=/opt/minimax-m3-v451/runtime/FlagCX
export GLOO_SOCKET_IFNAME=bond0
export FLAGCX_SOCKET_IFNAME=bond0
export SGLANG_DISABLE_MSA=1
export SGLANG_OPT_USE_BF16_ROUTER_GEMM=0
export SGLANG_OPT_USE_MINIMAX_DECODE_TOPK_RADIX=0
export TOKENIZERS_PARALLELISM=false
export PYTHONPATH=/opt/minimax-m3-v451/runtime/adapt-v451-swiglu-decode
export SGLANG_MOE_CONFIG_DIR=/opt/minimax-m3-v451/runtime/moe-config-v230
export TRITON_CACHE_DIR=/var/cache/minimax-m3/triton
export TORCHINDUCTOR_CACHE_DIR=/var/cache/minimax-m3/torchinductor

mkdir -p /var/log/minimax-m3 "$TRITON_CACHE_DIR" "$TORCHINDUCTOR_CACHE_DIR"

nohup /root/.virtualenvs/sglang-0.5.6/bin/python -m sglang.launch_server \
  --model-path /data/MiniMax-M3.1-Flash \
  --served-model-name MiniMax-M3 \
  --trust-remote-code \
  --dtype bfloat16 \
  --tp-size 8 \
  --pp-size 2 \
  --pp-async-batch-depth 1 \
  --pp-max-micro-batch-size 64 \
  --nnodes 2 \
  --node-rank "$NODE_RANK" \
  --dist-init-addr 10.121.38.7:31019 \
  --host 0.0.0.0 \
  --port 31018 \
  --context-length 8192 \
  --chunked-prefill-size 8192 \
  --mem-fraction-static 0.85 \
  --max-running-requests 64 \
  --attention-backend triton \
  --moe-runner-backend triton \
  --cuda-graph-backend-decode full \
  --cuda-graph-bs-decode 1 2 4 8 12 16 24 32 40 \
  --cuda-graph-backend-prefill disabled \
  --disable-overlap-schedule \
  --random-seed 43018883 \
  > /var/log/minimax-m3/service-rank${NODE_RANK}.log 2>&1 &
SERVICE_PID=$!
echo "$SERVICE_PID" > /var/log/minimax-m3/service-rank${NODE_RANK}.pid

READY=0
for _ in $(seq 1 180); do
  if curl -fsS --max-time 5 http://10.121.38.7:31018/v1/models \
      | grep -q '"id":"MiniMax-M3"'; then
    READY=1
    break
  fi
  if ! kill -0 "$SERVICE_PID" 2>/dev/null; then
    break
  fi
  sleep 10
done
if [ "$READY" -ne 1 ]; then
  tail -200 /var/log/minimax-m3/service-rank${NODE_RANK}.log >&2
  exit 1
fi
echo "MiniMax-M3 is ready at http://10.121.38.7:31018"
```

## Service Invocation
### Invocation Script
```bash
curl --fail-with-body --max-time 600 \
  http://10.121.38.7:31018/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "MiniMax-M3",
    "messages": [
      {"role": "user", "content": "Compute 17 * 19. Reply with only the integer."}
    ],
    "temperature": 0,
    "max_tokens": 64,
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

