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
The GLM family welcomes new members, the GLM-4-32B-0414 series models, featuring 32 billion parameters. Its performance is comparable to OpenAI’s GPT series and DeepSeek’s V3/R1 series. It also supports very user-friendly local deployment features. GLM-4-32B-Base-0414 was pre-trained on 15T of high-quality data, including substantial reasoning-type synthetic data. This lays the foundation for subsequent reinforcement learning extensions. In the post-training stage, we employed human preference alignment for dialogue scenarios. Additionally, using techniques like rejection sampling and reinforcement learning, we enhanced the model’s performance in instruction following, engineering code, and function calling, thus strengthening the atomic capabilities required for agent tasks. GLM-4-32B-0414 achieves good results in engineering code, Artifact generation, function calling, search-based Q&A, and report generation. In particular, on several benchmarks, such as code generation or specific Q&A tasks, GLM-4-32B-Base-0414 achieves comparable performance with those larger models like GPT-4o and DeepSeek-V3-0324 (671B).
GLM-Z1-32B-0414 is a reasoning model with deep thinking capabilities. This was developed based on GLM-4-32B-0414 through cold start, extended reinforcement learning, and further training on tasks including mathematics, code, and logic. Compared to the base model, GLM-Z1-32B-0414 significantly improves mathematical abilities and the capability to solve complex tasks. During training, we also introduced general reinforcement learning based on pairwise ranking feedback, which enhances the model's general capabilities.
GLM-Z1-Rumination-32B-0414 is a deep reasoning model with rumination capabilities (against OpenAI's Deep Research). Unlike typical deep thinking models, the rumination model is capable of deeper and longer thinking to solve more open-ended and complex problems (e.g., writing a comparative analysis of AI development in two cities and their future development plans). Z1-Rumination is trained through scaling end-to-end reinforcement learning with responses graded by the ground truth answers or rubrics and can make use of search tools during its deep thinking process to handle complex tasks. The model shows significant improvements in research-style writing and complex tasks.
Finally, GLM-Z1-9B-0414 is a surprise. We employed all the aforementioned techniques to train a small model (9B). GLM-Z1-9B-0414 exhibits excellent capabilities in mathematical reasoning and general tasks. Its overall performance is top-ranked among all open-source models of the same size. Especially in resource-constrained scenarios, this model achieves an excellent balance between efficiency and effectiveness, providing a powerful option for users seeking lightweight deployment.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.


# Evaluation Results
## Benchmark Result
| Metrics      | GLM-4-32B-Base-0414-Nvidia-Origin | GLM-4-32B-Base-0414-Mthreads-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| mmlu | 0.7710 | 0.7715 |
| cmmlu | 0.8325 | 0.8322 |
| gsm8k | 0.8719 | 0.8643 |
| leaderboard_bbh | 0.6574 | 0.6567 |
| hellaswag | 0.6469 | 0.6474 |
| truthfulqa_mc1 | 0.3268 | 0.3293 |
| winogrande | 0.7908 | 0.7877 |
| commonsense_qa | 0.7715 | 0.7715 |
| piqa | 0.8194 | 0.8199 |
| openbookqa | 0.368 | 0.370 |
| boolq | 0.8801 | 0.881 |
| arc_easy | 0.8561 | 0.8548 |
| arc_challenge | 0.5922 | 0.5913 |
| minerva_math_algebra | 0.6731 | 0.6748 |
| ceval-valid | 0.8076 | 0.812 |
| pubmedqa | 0.788 | 0.788 |
| medqa_4options | 0.729 | 0.7313 |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 24.0.9, build 2936816 |
| Operating System | 22.04.4 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/external-cooperation/glm-4-32b-base-0414-mthreads-tree_0.5.1_mthreads3.6-gems_5.0.2-vllm_0.13.1.dev44_g3d4cc4bc7.d20260310.musa-plugin_0.1.1-cx_none-python_3.10.12-torch_2.7.1-pcp_musa4.3.5-mtt_s5000-arc_x86_64-driver_3.3.5:2608061810
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/GLM-4-32B-Base-0414-mthreads-FlagOS --local_dir /data/models/GLM-4-32B-Base-0414-mthreads-FlagOS
```

### Start the Container
```bash
docker run -itd \
  --name=flagos \
  --privileged \
  --network=host \
  --pid=host \
  --ipc=host \
  --shm-size=32g \
  -v /data/models:/data/models \
  -v /dev:/dev \
  -v /usr/bin/mthreads-gmi:/usr/bin/mthreads-gmi:ro \
  -e LD_LIBRARY_PATH=/opt/musa/lib \
  -e MTHREADS_VISIBLE_DEVICES=all \
harbor.baai.ac.cn/external-cooperation/glm-4-32b-base-0414-mthreads-tree_0.5.1_mthreads3.6-gems_5.0.2-vllm_0.13.1.dev44_g3d4cc4bc7.d20260310.musa-plugin_0.1.1-cx_none-python_3.10.12-torch_2.7.1-pcp_musa4.3.5-mtt_s5000-arc_x86_64-driver_3.3.5:2608061810 \
  sleep infinity
docker exec -it flagos bash
```
### Start the Server
```bash
nohup env VLLM_PLUGINS=fl \
        USE_FLAGGEMS=1 \
        VLLM_FL_FLAGOS_BLACKLIST=mm,pow_tensor_scalar \
        vllm serve --model /data/models/GLM-4-32B-Base-0414-mthreads-FlagOS \
        --tensor-parallel-size 2 \
        --enforce-eager \
        --served-model-name glm-4-32b-base-0414-flagos \
        --port 8000 \
        > serve.log 2>&1 &
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4-32b-base-0414-flagos",
    "prompt": "你好"
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
The model weights are derived from ZhipuAI/GLM-4-32B-Base-0414 and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

