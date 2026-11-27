---
license: apache-2.0
language:
- zh
- en
---

# Introduction
BAAI (Beijing Academy of Artificial Intelligence) releases **Innata-0**, a native embodied world system. Built on a unified multi-chip software stack, the FlagOS open community provides **Day0 cross-chip adaptation support** focusing on embodied understanding, action-conditioned world prediction and robotic action generation. This adaptation targets six platforms: NVIDIA, MetaX, Hygon, Ascend, Moore Threads and T-Head. It verifies model outputs and inference efficiency across various tasks to support the deployment and evaluation of embodied models on diverse computing hardware.

Centered on three core capabilities — planning, recovery and evolution — Innata-0 is built with co-design of models and agents. **Innata-0-WAM** adopts a three-tower Mixture-of-Transformers architecture to jointly model world understanding, visual prediction, as well as action and tactile generation. **Innata-0-Agent** is responsible for task planning, execution validation, error recovery and accumulation of reusable experience. In the official RoboCasa365 simulation benchmark, equipping the base WAM with the complete agent stack raises the overall task success rate from **60.2% to 65.4%**. For unseen compositional tasks, the success rate increases from **32.4% to 43.6%**. These results illustrate the value of combining model execution with agent-enabled planning, validation and recovery.


### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | MTT S5000 x4卡 |
| Docker Version | 24.0.9 |
| Operating System | Ubuntu 22.04.4 LTS |
| Driver | 3.3.5-server |
| SDK | 4.3.5 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/innata-0-mthreads001-gems5.4.0-tree0.7.0-cx0.14.0-pluginnone-vllmnone-sglangnone-sglangflnone-cp310-pt210-musa52-x64-3.3.5-server:202611270428
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Innata-0-BF16-mthreads-FlagOS
```

### Start the Container
```bash
docker run -d --name innata-0 --network host --ipc host --privileged --shm-size 64g \
  -v /bjzyrgznyjy_ssd:/bjzyrgznyjy_ssd \
  arbor.baai.ac.cn/flagrelease-public/innata-0-mthreads001-gems5.4.0-tree0.7.0-cx0.14.0-pluginnone-vllmnone-sglangnone-sglangflnone-cp310-pt210-musa52-x64-3.3.5-server:202611270428 \
  bash -c "sleep infinity"
docker exec -it innata-0 /bin/bash
```

### Start the Inference Server
```bash
1. Innata-0-Understanding
export ASCEND_RT_VISIBLE_DEVICES=1
bash /opt/innata-opt/scripts/run_understanding.sh

2. Innata-0-ACWM
export ASCEND_RT_VISIBLE_DEVICES=2
bash /opt/innata-opt/scripts/run_acwm.sh

3. Innata-0-WAM-RoboDojo
export ASCEND_RT_VISIBLE_DEVICES=3
bash /opt/innata-opt/scripts/run_robodojo.sh

4. Innata-0-WAM-RoboCasa365
export ASCEND_RT_VISIBLE_DEVICES=4
bash /opt/innata-opt/scripts/run_robocasa.sh
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
The model weights are derived from Innata-0 and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

