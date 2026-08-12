---
license: apache-2.0
language:
- zh
- en
---
# Introduction
AI21-Jamba-1.5-Mini is an open-source large language model released by AI21. This release completes adaptation and validation on the Nvidia platform and is published based on the FlagOS software stack.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.


# Evaluation Results
## Benchmark Result
| Metrics                     | AI21-Jamba-1.5-Mini-Nvidia-Origin | AI21-Jamba-1.5-Mini-Mthreads-FlagOS |
|-----------------------------|-----------------------------------|--------------------------------------|
| LiveBench_New               | 0.275                             | 0.272                                |
| GPQA_Generative_CoT         | 0.218                             | 0.239                                |
| MuSR_Generative             | 0.290                             | 0.304                                |
| MMLU_Pro                    | 0.401                             | 0.397                                |
| GPQA_Diamond_Generative_CoT | 0.177                             | 0.258                                |


# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 27.5.1, build 9f9e405 |
| Operating System | 22.04.4 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/external-cooperation/ai21-jamba-1.5-mini-mthreads-tree_0.5.1_mthreads3.2-gems_5.0.2-vllm_0.13.1.dev44_g3d4cc4bc7.d20260310.musa-plugin_0.1.1-cx_none-python_3.10.12-torch_2.7.1-pcp_musa4.3.5-mtt_s5000-arc_x86_64:260805
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/AI21-Jamba-1.5-Mini-mthreads-FlagOS --local_dir /data/AI21-Jamba-1.5-Mini-mthreads-FlagOS
```

### Start the Container
```bash
docker run -itd \
  --name=ai21-jamba-1.5-mini-mthreads-flagos \
  --privileged \
  --network=host \
  --pid=host \
  --ipc=host \
  --shm-size=16g \
  --tmpfs /tmp:exec \
  -v /data/AI21-Jamba-1.5-Mini-mthreads-FlagOS:/data/AI21-Jamba-1.5-Mini-mthreads-FlagOS \
  -v /dev:/dev \
  -v /usr/bin/mthreads-gmi:/usr/bin/mthreads-gmi:ro \
  -e MTHREADS_VISIBLE_DEVICES=all \
  harbor.baai.ac.cn/external-cooperation/ai21-jamba-1.5-mini-mthreads-tree_0.5.1_mthreads3.2-gems_5.0.2-vllm_0.13.1.dev44_g3d4cc4bc7.d20260310.musa-plugin_0.1.1-cx_none-python_3.10.12-torch_2.7.1-pcp_musa4.3.5-mtt_s5000-arc_x86_64:260805 \
  sleep infinity

docker exec -it ai21-jamba-1.5-mini-mthreads-flagos bash
```


### Start the Server
```bash
export VLLM_FL_FLAGOS_WHITELIST="add,arange_start,argmax,bincount,cumsum,cumsum_out,diff,embedding,fill_scalar_,floor_divide,full,gather,index,index_put_,le,lt,lt_scalar,masked_fill_,max,ones,repeat_interleave_self_int,rsub_scalar,scatter,softmax,softmax_out,sub,sum_dim,to_copy,topk_softmax,true_divide_,where_self,where_self_out,zero_,zeros"

nohup env \
  MUSA_VISIBLE_DEVICES=1,2 \
  VLLM_MUSA_ENABLE_MOE_MATE=1 \
  VLLM_PLUGINS=fl \
  TRITON_ALL_BLOCKS_PARALLEL=1 \
  VLLM_MUSA_ENABLE_MOE_TRITON=1 \
  VLLM_TUNED_CONFIG_FOLDER=/workspace/vllm/musa_moe_tuned_configs \
  vllm serve \
    --model /data/AI21-Jamba-1.5-Mini-mthreads-FlagOS \
    --tensor-parallel-size 2 \
    --enforce-eager \
    --served-model-name ai21_flagos \
    --port 8000 \
  > /workspace/ai21-flagos.log 2>&1 &

tail -f ai21-flagos.log
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "ai21_flagos",
    "messages": [{"role": "user", "content": "你好"}]
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
The model weights are derived from AI-ModelScope/AI21-Jamba-1.5-Mini and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
