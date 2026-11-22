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
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | Hy4-Nvidia-Origin | Hy4-Mthreads-FlagOS |
|---|---|---|
| Math-500     | 96.2                           | 95.6                                 |
| GPQA_Diamond | 93.65                          | 88.38                                |
| mmbench      | 91.2                           | Evaluating                           |
| mmstar       | 79.67                          | Evaluating                           |
# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | MTT S5000 x16卡 |
| Docker Version | 24.0.9 |
| Operating System | Ubuntu 22.04.4 LTS |
| Driver | 3.3.5-server |
| SDK | 4.3.5 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/hy4_preview-mthreads001-gems5.3.0-tree0.6.1-cx0.13.0-pluginnone-vllm0.10.1-sglang0.0.0-sglangfl0.1.0-cp310-pt29-musa43-x64-3.3.5-server:202610230915-clean
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Hy4-W8A8-mthreads-FlagOS
```

### Start the Container
```bash
docker run -d \
  --name hy4-testing3-w8a8-deploy \
  --runtime mthreads \
  --privileged \
  --network host \
  --ipc host \
  --shm-size 1g \
  --ulimit memlock=-1:-1 \
  --ulimit stack=67108864:67108864 \
  --mount type=bind,src=/bjzyrgznyjy_ssd/models/Hy4-testing-3-W8A8-no-MTP,dst=/bjzyrgznyjy_ssd/models/Hy4-testing-3-W8A8-no-MTP,readonly \
  -v /var/log/hy4-testing3-w8a8-deploy:/var/log/hy4 \
  -v /var/cache/hy4-testing3-w8a8-deploy:/var/cache/hy4 \
  --env "NODE_RANK=${HY4_NODE_RANK:?Set node rank to 0 or 1}" \
  --env "DIST_INIT_ADDR=${HY4_DIST_INIT_ADDR:?Set the target rank 0 rendezvous address}" \
  --env "LOG_FILE=/var/log/hy4/server-rank${HY4_NODE_RANK}.log" \
  --env TRITON_CACHE_DIR=/var/cache/hy4 \
  --entrypoint /bin/sleep \
  harbor.baai.ac.cn/flagrelease-public/hy4_preview-mthreads001-gems5.3.0-tree0.6.1-cx0.13.0-pluginnone-vllm0.10.1-sglang0.0.0-sglangfl0.1.0-cp310-pt29-musa43-x64-3.3.5-server:202610230915-clean infinity
docker exec -it hy4-testing3-w8a8-deploy /bin/bash
```

### Start the Inference Server

```bash
# node 1
source /opt/hy4-testing-3/runtime.env &&
USE_FLAGGEMS=1 HY4_W8A8_MUSA=1 nohup /root/.virtualenvs/sglang-0.5.6/bin/python -m sglang.launch_server \
  --model-path /bjzyrgznyjy_ssd/models/Hy4-testing-3-W8A8-no-MTP \
  --served-model-name Hy4-testing-3-W8A8-no-MTP \
  --trust-remote-code \
  --reasoning-parser hy_v4 \
  --tool-call-parser hy_v4 \
  --device musa \
  --tp-size 8 \
  --pp-size 2 \
  --pp-max-micro-batch-size 32 \
  --page-size 64 \
  --dp-size 1 \
  --nnodes 2 \
  --node-rank "${NODE_RANK}" \
  --dist-init-addr "${DIST_INIT_ADDR}" \
  --host 0.0.0.0 \
  --port 30100 \
  --context-length 49152 \
  --disable-shared-experts-fusion \
  --disable-overlap-schedule \
  --disable-radix-cache \
  --num-continuous-decode-steps 1 \
  --prefill-decode-interval 0 \
  --cuda-graph-backend-decode full \
  --cuda-graph-max-bs-decode 32 \
  --cuda-graph-bs-decode 1 2 4 8 16 32 \
  --mem-fraction-static 0.88 \
  --kv-cache-dtype fp8_e4m3 \
  --max-running-requests 64 \
  --max-total-tokens 344064 \
  --chunked-prefill-size 16384 \
  --max-prefill-tokens 8192 \
  --attention-backend dsa \
  --dsa-prefill-backend flashmla_sparse \
  --dsa-decode-backend flashmla_sparse \
  --dsa-topk-backend torch \
  --sampling-backend flashinfer \
  >>"${LOG_FILE}" 2>&1 </dev/null &
```

```bash
# node 2
source /opt/hy4-testing-3/runtime.env &&
USE_FLAGGEMS=1 HY4_W8A8_MUSA=1 nohup /root/.virtualenvs/sglang-0.5.6/bin/python -m sglang.launch_server \
  --model-path /bjzyrgznyjy_ssd/models/Hy4-testing-3-W8A8-no-MTP \
  --served-model-name Hy4-testing-3-W8A8-no-MTP \
  --trust-remote-code \
  --reasoning-parser hy_v4 \
  --tool-call-parser hy_v4 \
  --device musa \
  --tp-size 8 \
  --pp-size 2 \
  --pp-max-micro-batch-size 32 \
  --page-size 64 \
  --dp-size 1 \
  --nnodes 2 \
  --node-rank "${NODE_RANK}" \
  --dist-init-addr "${DIST_INIT_ADDR}" \
  --host 0.0.0.0 \
  --port 30100 \
  --context-length 49152 \
  --disable-shared-experts-fusion \
  --disable-overlap-schedule \
  --disable-radix-cache \
  --num-continuous-decode-steps 1 \
  --prefill-decode-interval 0 \
  --cuda-graph-backend-decode full \
  --cuda-graph-max-bs-decode 32 \
  --cuda-graph-bs-decode 1 2 4 8 16 32 \
  --mem-fraction-static 0.88 \
  --kv-cache-dtype fp8_e4m3 \
  --max-running-requests 64 \
  --max-total-tokens 344064 \
  --chunked-prefill-size 16384 \
  --max-prefill-tokens 8192 \
  --attention-backend dsa \
  --dsa-prefill-backend flashmla_sparse \
  --dsa-decode-backend flashmla_sparse \
  --dsa-topk-backend torch \
  --sampling-backend flashinfer \
  >>"${LOG_FILE}" 2>&1 </dev/null &
```

## Service Invocation
### Invocation Script (Text)
```bash
curl -fsS --connect-timeout 5 --max-time 30 \
  http://127.0.0.1:30100/v1/chat/completions \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "model": "Hy4-testing-3-W8A8-no-MTP",
    "messages": [{"role": "user", "content": "Reply with exactly OK."}],
    "temperature": 0,
    "max_tokens": 16,
    "chat_template_kwargs": {"reasoning_effort": "no_think"}
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
The model weights are derived from Hy4 and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

