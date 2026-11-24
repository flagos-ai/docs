---
license: apache-2.0
language:
- zh
- en
---

# Introduction
Tencent Hunyuan officially open-sources its multimodal model Hy4. The FlagOS community, building on FlagOS's unified multi-chip software stack, completed Day-0 cross-chip adaptation, covering platforms from 9 chip vendors—Hygon, Kunlunxin, T-Head (Pingtouge), NVIDIA, Huawei Ascend, MetaX, Moore Threads, Tsing Micro, and Iluvatar CoreX—and **provided** a W8A8 version of the model. Drawing on the FlagOS 2.2 software stack together with framework- and operator-level co-optimization tailored to Hy4, in a dual-node, 16-GPU, 64-concurrency test on NVIDIA platforms, the FlagOS version raised output throughput by up to 32.1% and reduced average per-token latency by up to 39.2% compared with NVIDIA's native solution. On domestic platforms such as T-Head, Huawei Ascend, Hygon, and Moore Threads, it also achieved per-unit-compute throughput approaching or exceeding that of NVIDIA's native version in some of the tested scenarios. Backed by the FlagOS technology stack, Hy4 demonstrates competitive inference efficiency across a range of chips, letting industry users flexibly choose deployment options for cutting-edge multimodal large models based on their existing compute and workloads.

Hy4 is a multimodal model released by Tencent Hunyuan for real-world productivity scenarios. Compared with **the Hy4 preview**, the official version scales up both pre-training and post-training, introduces visual understanding and computer operation capabilities for the first time, and further improves instruction following, long-text comprehension, long-horizon task execution, and deep research. The model combines image perception, reasoning, and tool use to handle complex charts, operate professional software, and serve front-end and game development, financial office work, and scientific research tasks. In the evaluations published by Tencent Hunyuan, Hy4's score on Terminal-Bench 4.0 rose from the preview's 26.3 to 44.4, and on AutomationBench v1.0.6 from 36.3 to 56.2.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Hygon** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | Hy4-Nvidia-Origin | Hy4-Hygon-FlagOS |
|---|---|---|
| Math-500     | 96.2                           | 96.2                                 |
| GPQA_Diamond | 93.65                          | Evaluating                           |
| mmbench      | 91.2                           | Evaluating                           |
| mmstar       | 79.67                          | Evaluating                           |
# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (DCU) | Hygon DCU BW1101 ×8卡/节点（单卡 143.98 GiB / 147,440 MiB），当前 2 节点共 16 卡 |
| Docker Version | 24.0.0（两节点 daemon；10.13.1.63 的 docker client 为 29.1.3） |
| Operating System | Ubuntu 24.04.2 LTS（kernel 6.8.0-87-generic） |
| Driver | 6.4.0-V1.7.0c（hy-smi 1.26.0） |
| SDK | DTK 26.04（DCC2602-0317，`/opt/dtk-26.04-DCC2602-0317`） |
| AI Stack | vLLM 0.24.0 / vllm-plugin-fl 0.3.0rc2.post1 / FlagGems 5.5.0 / FlagGems-vllm 0.3.0 / FlagTree 0.7.0 / torch 2.10.0 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/hy4-hygon001-gems5.5.0-tree0.7.0-cxnone-plugin0.3.0-gemsvllm0.3.0-vllm0.24.0-cp310-pt210-dtk2604-x64-6.4.0-v1.7.0c:202611171553
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Hy4-W8A8-hygon-FlagOS
```

### Start the Container
```bash
sudo docker run -d --name hy4-w8a8-01 \
  --network=host --privileged --ipc=host --shm-size=128G \
  --device=/dev/kfd --device=/dev/dri \
  --group-add video --cap-add=SYS_PTRACE \
  --security-opt seccomp=unconfined \
  -u root \
  --ulimit stack=-1:-1 --ulimit memlock=-1:-1 \
  -v /opt/hyhal:/opt/hyhal:ro \
  -v /etc/hfm:/etc/hfm:ro \
  -v /data:/data \
  -v /public-flash:/public-flash \
  harbor.baai.ac.cn/flagrelease-public/hy4-hygon001-gems5.5.0-tree0.7.0-cxnone-plugin0.3.0-gemsvllm0.3.0-vllm0.24.0-cp310-pt210-dtk2604-x64-6.4.0-v1.7.0c:202611171553 \
  bash -lc 'sleep infinity'
docker exec -it hy4-w8a8-01 /bin/bash
```

### Start the Inference Server
```bash
# 2 节点 16 卡：先起 node1（headless），再起 node0（API server）。
# node0 (rank 0, API server)
VLLM_FL_HYGON_W8A8_MOE_BACKEND=triton \
VLLM_FL_SPARSE_ATTN_IMPL=triton \
VLLM_FL_HYV4_MLA_WHEEL=0 \
vllm serve /public-flash/models/Hy4-W8A8 \
    --served-model-name Hy4-W8A8 \
    --trust-remote-code \
    --host 0.0.0.0 \
    --port 8000 \
    --distributed-executor-backend mp \
    --nnodes 2 --node-rank 0 \
    --master-addr 10.13.1.63 --master-port 29850 \
    --distributed-timeout-seconds 1800 \
    --tensor-parallel-size 16 \
    --pipeline-parallel-size 1 \
    --data-parallel-size 1 \
    --load-format safetensors \
    --dtype bfloat16 \
    --disable-custom-all-reduce \
    --moe-backend triton \
    --max-model-len 131072 \
    --max-num-seqs 64 \
    --max-num-batched-tokens 8192 \
    --gpu-memory-utilization 0.88 \
    --no-enable-log-requests \
    --async-scheduling \
    --reasoning-parser hy_v4

# node1 (rank 1, headless) —— 环境变量与 node0 相同
VLLM_FL_HYGON_W8A8_MOE_BACKEND=triton \
VLLM_FL_SPARSE_ATTN_IMPL=triton \
VLLM_FL_HYV4_MLA_WHEEL=0 \
vllm serve /public-flash/models/Hy4-testing-3-W8A8-no-MTP \
    --served-model-name Hy4-testing-3-W8A8-no-MTP \
    --trust-remote-code \
    --distributed-executor-backend mp \
    --nnodes 2 --node-rank 1 \
    --master-addr 10.13.1.63 --master-port 29850 \
    --distributed-timeout-seconds 1800 \
    --tensor-parallel-size 16 \
    --pipeline-parallel-size 1 \
    --data-parallel-size 1 \
    --load-format safetensors \
    --dtype bfloat16 \
    --disable-custom-all-reduce \
    --moe-backend triton \
    --max-model-len 131072 \
    --max-num-seqs 64 \
    --max-num-batched-tokens 8192 \
    --gpu-memory-utilization 0.88 \
    --no-enable-log-requests \
    --async-scheduling \
    --reasoning-parser hy_v4 \
    --headless
```

## Service Invocation
### Invocation Script (Text)
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Hy4-testing-3-W8A8-no-MTP",
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
  "model": "Hy4-testing-3-W8A8-no-MTP",
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
The model weights are derived from HY4 and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

