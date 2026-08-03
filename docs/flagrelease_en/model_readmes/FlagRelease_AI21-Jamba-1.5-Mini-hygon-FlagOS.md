---
frameworks:
- ""
language:
- zh
- en
license: apache-2.0
tasks: []
---
# Introduction
AI21-Jamba-1.5-Mini is an open-source large language model released by AI21. This release completes adaptation and validation on the Nvidia platform and is published based on the FlagOS software stack.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Hygon** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.


# Evaluation Results
## Benchmark Result
| Metrics                         | AI21-Jamba-1.5-Mini-Nvidia-Origin | AI21-Jamba-1.5-Mini-Hygon-FlagOS |
|---------------------------------|-----------------------------------|----------------------------------|
| GPQA_Diamond                    | 0.177                             | 0.222                            |
| GPQA_Generative_CoT             | 0.218                             | 0.223                            |
| LiveBench_New                   | 0.275                             | 0.267                            |
| MUSR_Generative                 | 0.290                             | 0.300                            |
| MMLU_Pro                        | 0.401                             | 0.406                            |


# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 20.10.24, build 297e128 |
| Operating System | Sugon OS 8.9 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/external-cooperation/ai21-jamba-1.5-mini-hygon-tree_0.5.0-gems_5.0.2-vllm_0.13.0-plugin_0.1.1-cx_none-python_3.10.12-torch_2.9.0-pcp_hygon-dpu_hygon-x86_64-driver_1.11.0:2607291451
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download \
  --model FlagRelease/AI21-Jamba-1.5-Mini-hygon-FlagOS \
  --local_dir /data/models/AI21-Jamba-1.5-Mini-hygon-FlagOS
```

### Start the Container
```bash
docker run \
  --name ai21-jamba-hygon \
  --network=host \
  --privileged=true \
  --shm-size=16g \
  -v /data/models:/data/models \
  -v /opt/hyhal:/opt/hyhal:ro \
  -itd \
  harbor.baai.ac.cn/external-cooperation/ai21-jamba-1.5-mini-hygon-tree_0.5.0-gems_5.0.2-vllm_0.13.0-plugin_0.1.1-cx_none-python_3.10.12-torch_2.9.0-pcp_hygon-dpu_hygon-x86_64-driver_1.11.0:2607291451 \
  sleep infinity

docker exec -it ai21-jamba-hygon bash

```
### Start the Server
```bash
nohup env \
  HIP_VISIBLE_DEVICES=0,1 \
  VLLM_PLUGINS=fl \
  TRITON_ALL_BLOCKS_PARALLEL=1 \
  vllm serve \
  --model /data/models/AI21-Jamba-1.5-Mini-hygon-FlagOS \
  --tensor-parallel-size 2 \
  --enforce-eager \
  --max-cudagraph-capture-size 0 \
  --served-model-name ai21_flagos \
  --port 8131 \
  --gpu-memory-utilization 0.85 \
  > /workspace/ai21-flagos.log 2>&1 &
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8131/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "ai21_flagos",
    "messages": [
      {
        "role": "user",
        "content": "你好"
      }
    ]
  }'
```


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
The model weights are derived from AI-ModelScope/AI21-Jamba-1.5-Mini and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

