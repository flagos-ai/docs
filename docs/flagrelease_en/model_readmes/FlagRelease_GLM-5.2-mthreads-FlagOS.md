---
license: apache-2.0
language:
- zh
- en
---

# Introduction
Zhipu officially released its next-generation open-source flagship model **GLM-5.2**, the latest flagship targeting **Long Horizon Tasks**. Compared to its predecessor GLM-5.1, it achieves a significant leap in long-horizon task capabilities and is open-sourced under the **MIT License**. The **FlagOS Zhongzhi Community** completed multi-chip adaptation and inference deployment at the first opportunity, currently covering four chips:
**Moore Threads S5000, T-Head 810E, Metax C550 and Hygon DCU BW1000**.

Developers can rapidly deploy via the FlagOS unified, open-source software stack; model files and deployment guides are simultaneously available on **ModelScope** and **HuggingFace**. GLM-5.2 is a model featuring a stable and usable **1M context window**, purpose-built for Long Horizon Tasks. Its core capabilities include:

- **Solid 1M context**: Stably supports a 1,000,000-token context window for long-horizon workloads
- **Flexible advanced coding**: Enhanced coding capabilities with support for multiple inference effort levels to balance performance and latency
- **Improved architecture**: Introduces **IndexShare**, which reuses the same indexer across every four sparse attention layers, reducing per-token FLOPs by 2.9× at 1M context length; improves the MTP layer to support speculative decoding, increasing acceptance length by up to **20%**
- **Fully open-source**: MIT license, with no geographic restrictions


### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | GLM-5.2-Nvidia-Origin | GLM-5.2-Mthreads-FlagOS |
|--------------|--------------------------------|-------------------------|
| GPQA_Diamond | 85.85                 | Evaluating              |
| musr_generative        | 69.2                  | 67.2                    |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 27.5.1, build 9f9e405 |
| Operating System | 22.04.4 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-glm-5.2-mthreads-sglang_0.5.11-plugin_0.1.0-tree_none-gems_5.0.2-vllm_none-cx_none-python_3.10.12-torch_2.9.0-pcp_musa4.3.5-driver_3.3.6-server:202606160848
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/GLM-5.2-mthreads-FlagOS --local_dir /data/GLM-5.2
```

### Start the Container
```bash
docker run -itd \
    --name flagos \
    --network host \
    --privileged \
    -v /data:/data \
    harbor.baai.ac.cn/flagrelease-public/flagrelease-glm-5.2-mthreads-sglang_0.5.11-plugin_0.1.0-tree_none-gems_5.0.2-vllm_none-cx_none-python_3.10.12-torch_2.9.0-pcp_musa4.3.5-driver_3.3.6-server:202606160848 \
    bash
docker exec -it flagos bash
```
### Start the Server
in rank 0
```bash
source /root/.virtualenvs/sglang-0.5.6/bin/activate
export TORCH_MCCL_ASYNC_ERROR_HANDLING=0
export MCCL_SOCKET_IFNAME=bond0
export GLOO_SOCKET_IFNAME=bond0
export MCCL_TIMEOUT=14400
export MCCL_IB_DISABLE=1
export SGLANG_FLAGGEMS_RECORD=1
export SGLANG_FLAGGEMS_LOG_PATH=/tmp/flaggems_op.txt
export SGLANG_FL_DISPATCH_DEBUG=1
export TORCH_COMPILE_DISABLE=1
export TRITON_CACHE_DIR=/root/triton_cache/
export SGLANG_FL_FLAGOS_BLACKLIST=unique,sort,count_nonzero,cumsum,mm
export MUSA_VISIBLE_DEVICES="0,1,2,3,4,5,6,7"

python3 -m sglang.launch_server \
    --model-path /data/GLM-5.2 \
    --tp-size 8 --pp-size 2 --nnodes 2 \
    --node-rank 0 \
    --dist-init-addr "<node0_ip>:29500" \
    --host 0.0.0.0 --port 30000 \
    --served-model-name glm-5.2 \
    --tool-call-parser glm47 --reasoning-parser glm45 \
    --kv-cache-dtype fp8_e4m3 \
    --attention-backend triton \
    --cuda-graph-bs 1 2 4 6 8 12 16 20 24 32 40 48 \
    --chunked-prefill-size 2048 \
    --mem-fraction-static 0.85 \
    --trust-remote-code \
    --watchdog-timeout 3600
```
in rank 1
```bash
source /root/.virtualenvs/sglang-0.5.6/bin/activate
export TORCH_MCCL_ASYNC_ERROR_HANDLING=0
export MCCL_SOCKET_IFNAME=bond0
export GLOO_SOCKET_IFNAME=bond0
export MCCL_TIMEOUT=14400
export MCCL_IB_DISABLE=1
export TORCH_COMPILE_DISABLE=1
export SGLANG_FLAGGEMS_RECORD=1
export SGLANG_FLAGGEMS_LOG_PATH=/tmp/flaggems_op.txt
export SGLANG_FL_DISPATCH_DEBUG=1
export TRITON_CACHE_DIR=/root/triton_cache/
export SGLANG_FL_FLAGOS_BLACKLIST=unique,sort,count_nonzero,cumsum,mm
export MUSA_VISIBLE_DEVICES="0,1,2,3,4,5,6,7"

python3 -m sglang.launch_server \
    --model-path /data/GLM-5.2 \
    --tp-size 8 --pp-size 2 --nnodes 2 \
    --node-rank 1 \
    --dist-init-addr "<node0_ip>:29500" \
    --host 0.0.0.0 --port 30000 \
    --served-model-name glm-5.2 \
    --tool-call-parser glm47 --reasoning-parser glm45 \
    --kv-cache-dtype fp8_e4m3 \
    --attention-backend triton \
    --cuda-graph-bs 1 2 4 6 8 12 16 20 24 32 40 48 \
    --chunked-prefill-size 2048 \
    --mem-fraction-static 0.85 \
    --trust-remote-code \
    --watchdog-timeout 3600
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:30000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-5.2",
    "messages": [{"role": "user", "content": "hi"}]
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
The model weights are derived from ZhipuAI/GLM-5.2 and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
