---
base_model:
- ""
---
# Introduction
On February 16, 2026, Alibaba Cloud officially launched and open-sourced the new multimodal large model **Qwen3.5 (Qwen3.5-397B-A17B)**.Qwen3.5 features the following enhancement:  
**Unified Vision-Language Foundation**: Early fusion training on multimodal tokens achieves cross-generational parity with Qwen3 and outperforms Qwen3-VL models across reasoning, coding, agents, and visual understanding benchmarks.  
**Efficient Hybrid Architecture**: Gated Delta Networks combined with sparse Mixture-of-Experts deliver high-throughput inference with minimal latency and cost overhead.  
**Scalable RL Generalization**: Reinforcement learning scaled across million-agent environments with progressively complex task distributions for robust real-world adaptability.  
**Global Linguistic Coverage**: Expanded support to 201 languages and dialects, enabling inclusive, worldwide deployment with nuanced cultural and regional understanding.  
**Next-Generation Training Infrastructure**: Near-100% multimodal training efficiency compared to text-only training and asynchronous RL frameworks supporting massive-scale agent scaffolds and environment orchestration.  

Leveraging the cross-chip capabilities of FlagOS, a unified open-source system software stack purpose-built for diverse AI chips, [the FlagOS community](https://flagos.io "Visit the official FlagOS website") completed full adaptation, accuracy alignment, and multi-chip migration of the largest 397B MoE model immediately after the release of Qwen3.5, enabling the simultaneous adaptation and launch of Qwen3.5 on NVIDIA chips:	 
 	  
### Integrated Deployment
 
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Enflame** container image supporting deployment within minutes
 
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	

 
# Evaluation Results
## Benchmark Result
|Metrics|Alibaba Tongyi's Report|Qwen3.5-397B-A17B-Nvidia-Origin| Qwen3.5-397B-A17B-Enflame-FlagOS |
|-------|--------------|---------------|----------------------------------|
|ERQA(vision)|67.5 |65.28| Evaluating                           |
|AIME(Text) |91.3(2026) | 90(2024)| Evaluating                     |

# User Guide
 	 
Environment Setup
|Item|Version|
|-------|--------------|
|Docker Version|24.0.0 |
|Operating System|Ubuntu 22.04.4|

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/qwen3.5-397b-a17b-enflame001-gems-c080be72-treenone-cxnone-plugin-8c5e57d1-vllm0.20.2-cp312-pt211-cunone-x64:202608111055
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.5-397B-A17B-FP8-enflame-FlagOS --local_dir /data/Qwen3.5-397B-A17B-FP8
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
    --name harbor.baai.ac.cn/flagrelease-public/qwen3.5-397b-a17b-enflame001-gems-c080be72-treenone-cxnone-plugin-8c5e57d1-vllm0.20.2-cp312-pt211-cunone-x64:202608111055 bash
docker exec -it flagos bash
```
### Start the Server
```bash
set -x

rm -rf ~/.cache/vllm
rm -rf ~/.kurama
rm -rf ~/.flaggems 
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=99999
export TORCHGCU_INDUCTOR_ENABLE=1
export TORCH_GCU_ENABLE_INT64_AND_UINT64=1
export VLLM_FL_FLAGOS_BLACKLIST=sort,sort_stable,nonzero,nonzero_numpy,gt_scalar,masked_fill,masked_fill_,mean,mean_dim,mul,add,zeros,zero_
export ENFLAME_PT_OP_DEBUG_CONFIG='fallback_cpu=masked_fill_'
export TOPS_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export GLOO_SOCKET_IFNAME=ens80f0np0
export ECCL_SOCKET_IFNAME=ens80f0np0
export ECCL_IB_HCA="^=mlx5_10,mlx5_11"
export VLLM_SHARED_EXPERTS_STREAM_TOKEN_THRESHOLD=-1

vllm serve /data/Qwen3.5-397B-A17B-FP8 --tensor-parallel-size 8 --enforce-eager
```

## Service Invocation

### Invocation Script
```bash
curl http://localhost:8000/v1/completions -H 'Content-Type: application/json' -d '{
        "model": "qwen",
        "prompt": [
          "请介绍北京的旅游景点",
          "介绍一下大熊猫",
          "晚上睡不着应该怎么办",
          "李白的代表作有哪些？"
        ],
        "max_tokens": 128,
        "temperature": 0
     }'
```

```bash

curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "model": "qwen",
  "messages": [
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "描述下这张图片的内容"},
        {"type": "image_url", "image_url": {"url": "data:image/jpeg;base64,$(base64 -w0 galaxy.png)"}}
      ]
    }
  ],
  "max_tokens": 128
}
EOF
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
The model weights are sourced from Qwen/Qwen3.5-397B-A17B and open-sourced under the Apache 2.0 license

