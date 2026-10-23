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
- Released **FlagOS-Kunlunxin** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniMax-M3.1-Flash-Nvidia-Origin | MiniMax-M3.1-Flash-Kunlunxin-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| Math_500     | 93.40                            | 92.60                                |
| GPQA_Diamond | 88.89                            | 90.91                                |
| ERQA         | 65.75                            | Evaluating                           |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 20.10.12 |
| Operating System | 22.04 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minimax-m3.1-flash-w8a8-kunlunxin001-gems5.4.0-treenone-cx0.13.0-plugin0.3.0-vllm0.24.0-sglangnone-sglangflnone-cp310-pt29-xrt513-x64-5.0.21.47:202610231046

```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniMax-M3.1-Flash-W8A8-kunlunxin-FlagOS-Express --local_dir /data/MiniMax-M3.1-Flash
```

### Start the Container
```bash
docker run -d --name minimax-m31-flash-release \
  --network host --ipc private --shm-size 128G --privileged \
  --security-opt seccomp=unconfined --security-opt label=disable \
  --cap-add SYS_PTRACE --ulimit memlock=-1:-1 \
  --ulimit nofile=120000:120000 --ulimit stack=67108864:67108864 \
  -v /data/adaptation/MiniMax-M3.1-Flash/vllm/kunlunxin_p800/minimax-flash-image-runtime-20261023:/runtime:rw,rprivate \
  -v /data/adaptation/MiniMax-M3.1-Flash/vllm/kunlunxin_p800/minimax-flash-image-runtime-20261023/tmp:/tmp:rw,rprivate \
  -v /data/adaptation/MiniMax-M3.1-Flash/vllm/kunlunxin_p800/minimax-flash-image-runtime-20261023/triton:/root/.triton/cache:rw,rprivate \
  -v /data/adaptation/MiniMax-M3.1-Flash/vllm/kunlunxin_p800/minimax-flash-image-runtime-20261023/flaggems:/root/.flaggems/code_cache:rw,rprivate \
  -v /data/adaptation/MiniMax-M3.1-Flash/vllm/kunlunxin_p800/minimax-flash-image-runtime-20261023/cache:/root/.cache:rw,rprivate \
  --mount type=bind,src=/public-flash/models,dst=/models,readonly,bind-propagation=rprivate \
  --workdir /runtime --entrypoint /bin/bash \
  harbor.baai.ac.cn/flagrelease-public/minimax-m3.1-flash-w8a8-kunlunxin001-gems5.4.0-treenone-cx0.13.0-plugin0.3.0-vllm0.24.0-sglangnone-sglangflnone-cp310-pt29-xrt513-x64-5.0.21.47:202610231046 -lc 'sleep infinity'

```
### Start the Server
```bash
#!/bin/bash
set -eu
unset XPU_ENABLE_PROFILER_TRACING
export PYTHONFAULTHANDLER=1 VLLM_ENGINE_READY_TIMEOUT_S=3600
export PATH=/root/miniconda/envs/python310_torch29_cuda/bin:$PATH
export VLLM_PLUGINS=fl VLLM_FL_PLATFORM=kunlunxin VLLM_FL_PREFER=flagos USE_FLAGGEMS=1
export DIST_BACKEND=flagcx FLAGCX_PATH=/workspace/FlagCX
export LD_LIBRARY_PATH=/workspace/FlagCX/build/lib:${LD_LIBRARY_PATH:-}
export BKCL_SOCKET_IFNAME=eth0 GLOO_SOCKET_IFNAME=eth0 VLLM_HOST_IP=10.21.1.8
export BKCL_RDMA_NICS=bond0,bond1,bond2,bond3,bond4,bond5,bond6,bond7
export VLLM_FL_PER_OP='dynamic_per_token_quant_int8=reference|flaggems|vendor'
export VLLM_FL_FLAGOS_BLACKLIST_APPEND=linear,mm,addmm,addmm_dtype,to_copy,mul,add,div,rsqrt,sum,mean,index_select,gather,clone,cat,stack,masked_fill,masked_fill_,mul_,add_,sub,sub_,div_,pow,clamp,clamp_min,clamp_max,sigmoid,_scaled_dot_product_flash_attention,conv3d,copy_
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=3600 VLLM_USE_BREAKABLE_CUDAGRAPH=1 OMP_NUM_THREADS=8
export VLLM_FL_M31_NATIVE_DENSE_INT8=1 VLLM_FL_M31_NATIVE_NORM_ROPE=1
export PYTHONPATH=/opt/flagos/minimax_m31
cd /runtime
exec vllm serve /models/MiniMax-M3.1-Flash-W8A8-FlagOS-20261019 --worker-extension-cls graph_extension.NativeSortExtension --served-model-name MiniMax-M3.1-Flash-W8A8-FlagOS-20261019 --reasoning-parser minimax_m3 --tensor-parallel-size 8 --port 8101 --host 0.0.0.0 --dtype bfloat16 --quantization compressed-tensors --block-size 128 --trust-remote-code --compilation-config '{"mode":"VLLM_COMPILE","cudagraph_mode":"PIECEWISE","backend":"inductor","cudagraph_capture_sizes":[1,2,4,8,16,24,32,48,64],"max_cudagraph_capture_size":64}' --disable-custom-all-reduce --max-model-len 98304 --max-num-seqs 64 --limit-mm-per-prompt '{"image":16,"video":0}' --max-num-batched-tokens 32768 --gpu-memory-utilization 0.88 --no-enable-prefix-caching

```

## Service Invocation
### Invocation Script
```bash
curl --fail-with-body --max-time 300 http://127.0.0.1:8101/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"MiniMax-M3.1-Flash-W8A8-FlagOS","messages":[{"role":"user","content":"请只回答：北京"}],"temperature":0,"max_tokens":1024}'

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
