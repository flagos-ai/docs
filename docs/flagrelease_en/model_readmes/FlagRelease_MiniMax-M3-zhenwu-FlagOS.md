---
language:
- zh
- en
license: apache-2.0
---

# Introduction
MiniMax M3, released on June 1st, is the first Chinese model to simultaneously deliver frontier coding/agentic capabilities, 1M ultra-long context, and native multimodality — and the only open-source model in the world with all three. The core innovation is a proprietary MSA sparse attention architecture: at 1M context, compute per token is just 1/20th of the previous generation, with 9× prefilling speedup and 15× decoding speedup. On SWE-Bench Pro, M3 scores 59.0%, surpassing GPT-5.5 and Gemini 3.1 Pro, and approaching Opus 4.7; on the multimodal benchmark OmniDocBench, it also outperforms Gemini 3.1 Pro. In real-world tests, M3 autonomously ran for nearly 12 hours to successfully reproduce an ICLR award-winning paper, and within ~24 hours pushed FP8 GEMM kernel utilization from 7.6% to 71.3% — a 9.4× speedup.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Zhenwu** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | MiniMax-M3-Nvidia-Origin | MiniMax-M3-Zhenwu-FlagOS |
|--------------|--------------------------|--------------------------|
| GPQA_Diamond | 86.36                    | 92.42                |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 28.1.0, build 4d8c241 |
| Operating System | Ubuntu 24.04.2 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minimaxm3-pp001-gems5.4.0-tree0.6.2-cxnone-plugin0.3.0-vllm0.24.0-cp312-pt210-hggc130-x64-2.1.1-rbd225:202610151646
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniMax-M3-zhenwu-FlagOS --local_dir /data/MiniMax-M3
```

### Start the Container
```bash
sudo docker run --privileged -dit \
  -e HOST_HOSTNAME=$(hostname) \
  --network=host \
  --device=/dev/infiniband \
  --ipc=host \
  --device=/dev/alixpu_ctl \
  --device=/dev/alixpu \
  --ulimit memlock=-1 \
  --ulimit stack=67108864 \
  --init \
  -v /mnt:/mnt \
  -v /data:/data \
  -w /mnt/nfs/users/jinghao \
  --name minimaxM3 \
  harbor.baai.ac.cn/flagrelease-public/minimaxm3-pp001-gems5.4.0-tree0.6.2-cxnone-plugin0.3.0-vllm0.24.0-cp312-pt210-hggc130-x64-2.1.1-rbd225:202610151646
```

### Start the Server

```bash
source /usr/local/PPU_SDK/envsetup.sh
export PATH="/usr/lib64/openmpi/bin:$PATH"
export LD_LIBRARY_PATH="/usr/lib64/libibverbs:/usr/lib64/openmpi/lib:${LD_LIBRARY_PATH:-}"
export CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
export VLLM_WORKER_MULTIPROC_METHOD=spawn FLAGTREE_AABS=0
export GLOO_SOCKET_IFNAME=eth0 NCCL_IB_HCA=fic2_soe_bond
export NCCL_IB_GID_INDEX=1 NCCL_IB_ADDR_FAMILY=6
export NCCL_SOCKET_IFNAME=bond NCCL_SOCKET_FAMILY=AF_INET6

vllm serve /data/MiniMax-M3 \
  --host 0.0.0.0 \
  --host 127.0.0.1 \
  --port 8024 \
  --served-model-name MiniMax-M3 \
  --tensor-parallel-size 16 \
  --dtype bfloat16 \
  --block-size 128 \
  --max-model-len 100000 \
  --max-num-seqs 64 \
  --max-num-batched-tokens 8192 \
  --compilation-config '{"cudagraph_mode":"FULL_AND_PIECEWISE","cudagraph_capture_sizes":[1,2,4,8,16,32,64]}'

```

## Service Invocation
### Invocation Script
```bash
curl http://127.0.0.1:8024/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
      "messages": [{"role": "user", "content": "请给我介绍一下GPQA"}],
      "max_tokens": 128
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
- Enter your question (e.g., “Explain the basics of quantum computing”)
- Click the send button to get a response
# Technical Overview
**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a “develop once, run anywhere” workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of \<chip + open-source model\>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.
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
The model weights are derived from MiniMaxAI/MiniMax-M3 and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

