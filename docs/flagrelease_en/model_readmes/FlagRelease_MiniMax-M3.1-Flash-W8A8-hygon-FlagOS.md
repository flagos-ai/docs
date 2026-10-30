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
- Released **FlagOS-Hygon** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniMax-M3.1-Flash-Nvidia-Origin | MiniMax-M3.1-Flash-Hygon-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| Math_500     | 93.40                            | 94.40                                |
| GPQA_Diamond | 88.89                            | 91.41                                |
| ERQA         | 65.75                            | 65                                   |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 27.3.1 |
| Operating System | 22.04 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minimax-m3.1-flash-hygon001-flagtree-flaggems_vllm-dcp:202610201418
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniMax-M3.1-Flash-W8A8-hygon-FlagOS --local_dir /data/MiniMax-M3.1-Flash
```

### Start the Container
```bash
docker run -d \
  --name minimax-m31-dcp-01 \
  --network host \
  --ipc private \
  --shm-size 32g \
  --ulimit memlock=-1:-1 \
  --init \
  --device /dev/kfd \
  --device /dev/mkfd \
  --device /dev/dri \
  --device /dev/infiniband \
  -v /data:/data:rslave \
  -v /opt/hyhal:/opt/hyhal:ro \
  -v /public-flash:/public-flash \
  --entrypoint /bin/sleep \
  harbor.baai.ac.cn/flagrelease-public/minimax-m3.1-flash-hygon001-flagtree-flaggems_vllm-dcp:202610201418 \
  infinity

```
### Start the Server
```bash
# 1. flagos / 插件 dispatch
export VLLM_PLUGINS=fl
export USE_FLAGGEMS=1
export VLLM_FL_PREFER=flagos
export VLLM_FL_PREFER_ENABLED=1
export VLLM_FL_OOT_ENABLED=1
export VLLM_FL_USE_FLAGGEMS_ATTN=1
export VLLM_FL_CONFIG=/opt/src/vllm-plugin-FL/vllm_fl/dispatch/config/hygon.yaml
export VLLM_SERVER_DEV_MODE=1

# 2. 编译器 / Triton
export TRITON_HIP_CLANG_PATH=/opt/dtk/aillvm/bin/clang-18   # Must be 18: 17 does not support those two -mllvm flags
export AMDGCN_USE_BUFFER_OPS=0                               # flagtree 0.7.0 + clang-18 intrinsic incompatible
export TORCH_COMPILE_DISABLE=1
export OMP_NUM_THREADS=1
export PYTHONDONTWRITEBYTECODE=1
export PYTHONUNBUFFERED=1

# 3. MoE
export MOE_BACKEND=triton

# 4. MiniMax-M3 sparse attention / DCP
export PYTHONPATH=/opt/model-launch/minimax-m3/runtime:   # Where M3IPCExperiment locates
export M3_DCP_IPC_COMPACT=1
export VLLM_FL_HYGON_SPLIT_GRAPH_COMM=0
export VLLM_FL_HYGON_M3_PREFILL_METADATA=1
export VLLM_FL_HYGON_M3_PREFILL_NATIVE_MUL=1
export VLLM_FL_HYGON_M3_PREFILL_TOPK_FUSION=1
export VLLM_FL_HYGON_M3_QKNORM_ROPE_FUSION=1
export VLLM_FL_HYGON_M3_MOE_ACTIVATION_FUSION=1
export VLLM_FL_HYGON_M3_ROUTER_FUSION=1
export VLLM_FL_HYGON_M3_OFFICIAL_TOPK=1
export VLLM_FL_HYGON_M3_DCP=1
export VLLM_FL_HYGON_M3_DCP_DECODE_INDEX=short
export VLLM_FL_HYGON_M3_DCP_DECODE_A2A=1
export VLLM_FL_HYGON_M3_DCP_DECODE_PREPARE=1
export VLLM_FL_HYGON_M3_DCP_DECODE_COMBINED_GATHER=1
export VLLM_FL_HYGON_M3_DCP_GRAPH_BOOTSTRAP=1
export VLLM_FL_HYGON_SAMPLER_BACKEND=lightop
export NCCL_MAX_P2P_NCHANNELS=4

# 5. RDMA / NCCL (new bw1000-rdma image, equivalent to source /opt/bw1000-rdma/gdr.sh)
export NCCL_NET_PLUGIN=/opt/bw1000-rdma/lib/librccl-net-shca-gpukfd.so
export NCCL_NET=IBext_v8
export NCCL_IB_DISABLE=0
export NCCL_IB_HCA=shca_0,shca_1,shca_2,shca_3
export NCCL_SOCKET_IFNAME=bond1
export GLOO_SOCKET_IFNAME=bond1
export NCCL_NET_GDR_LEVEL=PHB
export NCCL_NET_GDR_READ=1
export NCCL_SIMPLE_CHANNELS=32
export NCCL_TUNER_PLUGIN=/opt/bw1000-rdma/lib/libnccl-tuner-bwbalanced.so
export NCCL_DEBUG=WARN
export NCCL_DEBUG_SUBSYS=INIT,NET
export VLLM_NCCL_SO_PATH=/opt/dtk/lib/librccl.so.1

# 6. Cluster topology / Runtime
export HSA_FORCE_FINE_GRAIN_PCIE=1
export HF_HUB_OFFLINE=1
export TRANSFORMERS_OFFLINE=1
export HF_DATASETS_OFFLINE=1
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=1800
export PYTORCH_HIP_ALLOC_CONF=expandable_segments:True
export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
export HIP_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export MASTER_ADDR=10.232.2.30
export NNODES=2
export CARDS_PER_NODE=8
export TOTAL_CARDS=16
export VLLM_HOST_IP=10.232.2.30   # Change to 10.232.2.31 for node1

```

```bash
# In Node 0
vllm serve <模型路径> \
  --served-model-name MiniMax-M3.1-Flash \
  --trust-remote-code \
  --distributed-executor-backend mp \
  --nnodes 2 \
  --node-rank 0 \
  --master-addr 10.232.2.30 \
  --master-port 29850 \
  --distributed-timeout-seconds 1800 \
  --tensor-parallel-size 16 \
  --pipeline-parallel-size 1 \
  --data-parallel-size 1 \
  --load-format safetensors \
  --dtype bfloat16 \
  --moe-backend triton \
  --max-model-len 131072 \
  --max-num-seqs 64 \
  --gpu-memory-utilization 0.96 \
  --no-enable-log-requests \
  --max-num-batched-tokens 8192 \
  --decode-context-parallel-size 4 \
  --worker-extension-cls service_extension_ipc.M3IPCExperiment \
  --dcp-comm-backend ag_rs \
  --cp-kv-cache-interleave-size 128 \
  --block-size 128 \
  --host 0.0.0.0 \
  --port 8000

# In Node 1
vllm serve <模型路径> \
  --served-model-name MiniMax-M3.1-Flash \
  --trust-remote-code \
  --distributed-executor-backend mp \
  --nnodes 2 \
  --node-rank 1 \
  --master-addr 10.232.2.30 \
  --master-port 29850 \
  --distributed-timeout-seconds 1800 \
  --tensor-parallel-size 16 \
  --pipeline-parallel-size 1 \
  --data-parallel-size 1 \
  --load-format safetensors \
  --dtype bfloat16 \
  --moe-backend triton \
  --max-model-len 131072 \
  --max-num-seqs 64 \
  --gpu-memory-utilization 0.96 \
  --no-enable-log-requests \
  --max-num-batched-tokens 8192 \
  --decode-context-parallel-size 4 \
  --worker-extension-cls service_extension_ipc.M3IPCExperiment \
  --dcp-comm-backend ag_rs \
  --cp-kv-cache-interleave-size 128 \
  --block-size 128 \
  --host 0.0.0.0 \
  --port 8000 \
  --headless


```


## Service Invocation
### Invocation Script
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "flagOS",
    "messages": [{"role": "user", "content": "Give a brief introduction to GPQA"}]
  }'
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
