---
base_model:
- ""
frameworks:
- ""
---
# Introduction
Alibaba open-sources the ultra-large-scale MoE model Qwen3.8-2.4T-A95B, with the FlagOS Community simultaneously completing Day0 multi-chip adaptation. Qwen3.8-2.4T-A95B has completed multi-chip adaptation, precision alignment, and  deployment verification based on the FlagOS unified open-source technology stack on 10 AI chips including Alibaba T-Head, NVIDIA, Moore Threads, Huawei Ascend, Metax, Kunlunxin, Hygon, Tianshu Zhixin, Tsingmicro, and Enflame. The model provides multiple precision versions including BF16, FP8, and INT8 tailored to different chip configurations, allowing developers to directly access ready-to-use solutions for their respective chips.
 
### Integrated Deployment
 
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Enflame** container image supporting deployment within minutes
 
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	

 
# Evaluation Results
## Benchmark Result
| Metrics      | Qwen3.8-2.4T-A95B-Nvidia-Origin | Qwen3.8-2.4T-A95B-FP8-enflame-FlagOS |
|-------|--------------|--------------------------------------|
| GPQA_Diamond | 91.41       | Evaluating                           |
|musr_murder_mysteries | 79.2| Evaluating                           |


# User Guide
 	 
Environment 

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 28.2.2 |
| Operating System | Ubuntu 24.04.3 LTS |

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/qwen3.8-2.4t-a95b-fp8-enflame001-gems-c080be72-treenone-cxnone-plugin-02154560-vllm0.20.2-cp312-pt211-cunone:202608131100

```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.8-2.4T-A95B-FP8-enflame-FlagOS --local_dir /data/Qwen3.8-2.4T-A95B-FP8
```

### Start the Container
```bash
docker run -d \
    -exec -it \
    --ipc=host \
    --network host \
    --privileged \
    -v /dev:/dev \
    -v /home:/home \
    --name flagos \
    harbor.baai.ac.cn/flagrelease-public/qwen3.8-2.4t-a95b-fp8-enflame001-gems-c080be72-treenone-cxnone-plugin-02154560-vllm0.20.2-cp312-pt211-cunone:202608131100 \
    bash
docker exec -it flagos /bin/bash
```
### Start the Server

in node 0 (master)
```bash
set -x
rm -rf ~/.cache/vllm
rm -rf ~/.kurama
rm -rf ~/.flaggems
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=99999
export TORCH_GCU_ENABLE_INT64_AND_UINT64=1
export TORCHGCU_INDUCTOR_ENABLE=1
export VLLM_FL_FLAGOS_BLACKLIST=sort,sort_stable,nonzero,nonzero_numpy,gt_scalar,masked_fill,masked_fill_
export ENFLAME_PT_OP_DEBUG_CONFIG='fallback_cpu=masked_fill_'
export TOPS_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export GLOO_SOCKET_IFNAME=ens80f0np0
# export ECCL_IB_HCA="^=mlx5_10,mlx5_11"
export VLLM_SHARED_EXPERTS_STREAM_TOKEN_THRESHOLD=-1
export ECCL_SOCKET_IFNAME=ens80f0np0
export ECCL_IB_HCA="mlx5_bond_0,mlx5_bond_1,mlx5_bond_2,mlx5_bond_3,mlx5_bond_4,mlx5_bond_5,mlx5_bond_6,mlx5_bond_7"
export ECCL_IB_GID_INDEX=3

vllm serve $MODEL_PATH --tensor-parallel-size 8 --pipeline-parallel-size 4 --enforce-eager --port 8000 \
    --nnodes 4 --node-rank 0 \
    --master-addr $master_ip
```
in node 1 (worker)
```bash
set -x
rm -rf ~/.cache/vllm
rm -rf ~/.kurama
rm -rf ~/.flaggems
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=99999
export TORCH_GCU_ENABLE_INT64_AND_UINT64=1
export TORCHGCU_INDUCTOR_ENABLE=1
export VLLM_FL_FLAGOS_BLACKLIST=sort,sort_stable,nonzero,nonzero_numpy,gt_scalar,masked_fill,masked_fill_
export ENFLAME_PT_OP_DEBUG_CONFIG='fallback_cpu=masked_fill_'
export TOPS_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export GLOO_SOCKET_IFNAME=ens80f0np0
# export ECCL_IB_HCA="^=mlx5_10,mlx5_11"
export VLLM_SHARED_EXPERTS_STREAM_TOKEN_THRESHOLD=-1
export ECCL_SOCKET_IFNAME=ens80f0np0
export ECCL_IB_HCA="mlx5_bond_0,mlx5_bond_1,mlx5_bond_2,mlx5_bond_3,mlx5_bond_4,mlx5_bond_5,mlx5_bond_6,mlx5_bond_7"
export ECCL_IB_GID_INDEX=3

vllm serve $MODEL_PATH --tensor-parallel-size 8 --pipeline-parallel-size 4 --enforce-eager --port 8000 \
    --nnodes 4 --node-rank 1 \
    --master-addr $master_ip --headless
```
in node 2 (worker)
```bash
set -x
rm -rf ~/.cache/vllm
rm -rf ~/.kurama
rm -rf ~/.flaggems
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=99999
export TORCH_GCU_ENABLE_INT64_AND_UINT64=1
export TORCHGCU_INDUCTOR_ENABLE=1
export VLLM_FL_FLAGOS_BLACKLIST=sort,sort_stable,nonzero,nonzero_numpy,gt_scalar,masked_fill,masked_fill_
export ENFLAME_PT_OP_DEBUG_CONFIG='fallback_cpu=masked_fill_'
export TOPS_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export GLOO_SOCKET_IFNAME=ens80f0np0
# export ECCL_IB_HCA="^=mlx5_10,mlx5_11"
export VLLM_SHARED_EXPERTS_STREAM_TOKEN_THRESHOLD=-1
export ECCL_SOCKET_IFNAME=ens80f0np0
export ECCL_IB_HCA="mlx5_bond_0,mlx5_bond_1,mlx5_bond_2,mlx5_bond_3,mlx5_bond_4,mlx5_bond_5,mlx5_bond_6,mlx5_bond_7"
export ECCL_IB_GID_INDEX=3

vllm serve $MODEL_PATH --tensor-parallel-size 8 --pipeline-parallel-size 4 --enforce-eager --port 8000 \
    --nnodes 4 --node-rank 2 \
    --master-addr $master_ip --headless
```
in node 3 (woker)
```bash
set -x
rm -rf ~/.cache/vllm
rm -rf ~/.kurama
rm -rf ~/.flaggems
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=99999
export TORCH_GCU_ENABLE_INT64_AND_UINT64=1
export TORCHGCU_INDUCTOR_ENABLE=1
export VLLM_FL_FLAGOS_BLACKLIST=sort,sort_stable,nonzero,nonzero_numpy,gt_scalar,masked_fill,masked_fill_
export ENFLAME_PT_OP_DEBUG_CONFIG='fallback_cpu=masked_fill_'
export TOPS_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export GLOO_SOCKET_IFNAME=ens80f0np0
# export ECCL_IB_HCA="^=mlx5_10,mlx5_11"
export VLLM_SHARED_EXPERTS_STREAM_TOKEN_THRESHOLD=-1
export ECCL_SOCKET_IFNAME=ens80f0np0
export ECCL_IB_HCA="mlx5_bond_0,mlx5_bond_1,mlx5_bond_2,mlx5_bond_3,mlx5_bond_4,mlx5_bond_5,mlx5_bond_6,mlx5_bond_7"
export ECCL_IB_GID_INDEX=3

vllm serve $MODEL_PATH --tensor-parallel-size 8 --pipeline-parallel-size 4 --enforce-eager --port 8000 \
    --nnodes 4 --node-rank 3 \
    --master-addr $master_ip --headless
```

## Service Invocation

### Invocation Script
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPTY" \
  -X POST \
  -d '{
    "model": "qwen",
    "messages": [
      {
        "role": "user",
        "content": "Introduce LLM"
      }
    ],
    "max_tokens": 128,
    "temperature": 1.0,
    "top_p": 0.95,
    "presence_penalty": 1.5,
    "top_k": 20
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
The model weights are sourced from Qwen/Qwen3.8-2.4T-A95B-FP8 and open-sourced under the Apache 2.0 license

