---
base_model:
- ""
language:
- zh
- en
license: apache-2.0
---

# Introduction
Qwen3-VL-30B-A3B-Instruct is a multimodal vision-language model from Alibaba's Qwen3-VL series; it uses a Mixture-of-Experts architecture with about 30B total parameters, activating only ~3B per token for efficient inference, and as an instruction-tuned model, it excels at image captioning, visual question answering, document and chart understanding, OCR, and visual grounding, supports high-resolution and multi-image inputs, strong multilingual understanding, and long-context reasoning, and combining competitive accuracy with efficient activation, it is well-suited for intelligent assistants, document analysis, and agentic visual workflows, balancing performance and resource efficiency for both research and production.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Metax** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | Qwen3-VL-30B-A3B-Instruct-Metax-FlagOS |
|---|---|
| GPQA | 65.15 |
| ERQA | 46|

# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | MetaX C550 x2卡 |
| Docker Version | 29.1.3 |
| Operating System | Ubuntu 22.04.5 LTS |
| Driver | MetaX 3.8.1 |
| SDK | MACA 3.7.0.38 |

## Operation Steps

### Step 0. Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/qwen3-vl-metax001-gems5.5.0-tree0.7.0-cxnone-plugin0.2.0-vllm0.24.0-sglangnone-sglangflnone-cp312-pt28-maca37-x64-3.8.1:202611091656
```

### Step 1. Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3-VL-30B-A3B-Instruct-metax-FlagOS-Express
```

### Step 2. Start the Container
```bash
docker run -itd \
  --name qwen3vl \
  --hostname "$(hostname)" \
  --privileged \
  --ipc=host \
  --network=host \
  --security-opt label=disable \
  -v /public-flash:/public-flash:rw,rprivate \
  -v /data:/data:rw,rslave \
  -w /public-flash \
  --entrypoint /bin/bash \
  harbor.baai.ac.cn/flagrelease-public/qwen3-vl-metax001-gems5.5.0-tree0.7.0-cxnone-plugin0.2.0-vllm0.24.0-sglangnone-sglangflnone-cp312-pt28-maca37-x64-3.8.1:202611091656
```

### Step 3. Start the Inference Server
```bash
export CUDA_VISIBLE_DEVICES=0,1
export FLAGGEMS_VENDOR=metax
export VLLM_PLUGINS=fl
export VLLM_FL_USE_FLAGGEMS_VLLM=1
export VLLM_FL_FLAGOS_BLACKLIST=mm,mm_out,layer_norm,log_softmax
nohup /opt/conda/bin/vllm serve FlagRelease/Qwen3-VL-30B-A3B-Instruct-metax-FlagOS-Express \
  --host 0.0.0.0 \
  --port 8000 \
  --served-model-name qwen3vl \
  --tensor-parallel-size 2 \
  --trust-remote-code \
  --dtype bfloat16 \
  --max-num-batched-tokens 8192 \
  --max-num-seqs 64 \
  --gpu-memory-utilization 0.91 \
  --enable-prefix-caching \
  --distributed-executor-backend mp \
  --max-num-partial-prefills 1 \
  --max-long-partial-prefills 1 \
  --long-prefill-token-threshold 0 \
  --compilation-config '{"cudagraph_mode":"FULL_AND_PIECEWISE","max_cudagraph_capture_size":64}' \
  > ./service.log 2>&1 &
```

## Service Invocation
### Invocation Script (Text)
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3vl",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

### Invocation Script (Image)
```bash
IMAGE_BASE64=$(base64 -w 0 "/public-flash/example.jpg")

curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  --data-binary @- <<EOF
{
  "model": "qwen3vl",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "请描述这张图片中的内容。"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,${IMAGE_BASE64}"
          }
        }
      ]
    }
  ]
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
The model weights are derived from Qwen/qwen3-VL and are open-sourced under the Apache License 2.0.


