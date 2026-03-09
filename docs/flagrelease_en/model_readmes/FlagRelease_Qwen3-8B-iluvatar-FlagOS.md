# Introduction

**FlagOS** is a unified heterogeneous computing software stack for large models, co-developed with leading global chip manufacturers. With core technologies such as the **FlagScale** distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the FlagOS stack to automatically produce and release various combinations of <chip + open-source model>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.

Based on this, the **Qwen3-8B-Iluvatar-FlagOS** model is adapted for the Iluvatar chip using the FlagOS software stack, enabling:

### Integrated Deployment

- Deep integration with the open-source [FlagScale framework](https://github.com/FlagOpen/FlagScale)
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Iluvatar** container image supporting deployment within minutes

### Consistency Validation

- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Technical Overview
**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a “develop once, run anywhere” workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of \<chip + open-source model\>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.

## FlagGems
FlagGems is a high-performance, generic operator libraryimplemented in [Triton](https://github.com/openai/triton) language. It is built on a collection of backend-neutralkernels that aims to accelerate LLM (Large-Language Models) training and inference across diverse hardware platforms.
## FlagTree
FlagTree is an open source, unified compiler for multipleAI chips project dedicated to developing a diverse ecosystem of AI chip compilers and related tooling platforms, thereby fostering and strengthening the upstream and downstream Triton ecosystem. Currently in its initial phase, the project aims to maintain compatibility with existing adaptation solutions while unifying the codebase to rapidly implement single-repository multi-backend support. Forupstream model users, it provides unified compilation capabilities across multiple backends; for downstream chip manufacturers, it offers examples of Triton ecosystem integration.
## FlagScale and vllm-plugin-fl
Flagscale is a comprehensive toolkit designed to supportthe entire lifecycle of large models. It builds on the strengths of several prominent open-source projects, including [Megatron-LM](https://github.com/NVIDIA/Megatron-LM) and [vLLM](https://github.com/vllm-project/vllm), to provide a robust, end-to-end solution for managing and scaling large models.
vllm-plugin-fl is a vLLM plugin built on the FlagOS unified multi-chip backend, to help flagscale support multi-chip on vllm framework.

## **FlagEval Evaluation Framework**
 FlagEval is a comprehensive evaluation system and open platform for large models launched in 2023. It aims to establish scientific, fair, and open benchmarks, methodologies, and tools to help researchers assess model and training algorithm performance. It features:
 - **Multi-dimensional Evaluation**: Supports 800+ modelevaluations across NLP, CV, Audio, and Multimodal fields,covering 20+ downstream tasks including language understanding and image-text generation.
 - **Industry-Grade Use Cases**: Has completed horizonta1 evaluations of mainstream large models, providing authoritative benchmarks for chip-model performance validation.

# User Guide

**Environment Setup**

| Accelerator Card Driver Version | Kernel Mode Driver Version: 2.3.0          |
| ------------- | ------------------------------------------------------------ |
| Docker Version                  | Docker version 28.1.1, build 4eba377 |
| Operating System                | Description:    Ubuntu 22.04.4 LTS      |
| FlagScale                       | Version: 0.8.0                 |
| FlagGems                        | Version: 4.2.1rc0                          |

## Operation Steps

### Download FlagOS Image

```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-iluvatar-release-model_qwen3-8b-tree_none-gems_4.2.1rc0-scale_0.8.0-cx_none-python_3.10.18-torch_2.7.1_corex.4.4.0-pcp_ix-ml4.4.0-gpu_iluvatar001-arc_amd64-driver_4.4.0:260227
```

### Download Open-source Model Weights

```bash
pip install modelscope
modelscope download --model Qwen/Qwen3-8B --local_dir /nfs/Qwen3-8B

```

### Start the inference service

```bash
#Container Startup
docker run --shm-size 128g -dit --name flagos  -v /nfs:/root/data -e USE_FLAGGEMS=1 -e QWEN3_PORT=8000 -e QWEN3_PATH=/root/data/Qwen3-8B --privileged --cap-add=ALL --pid=host --net=host harbor.baai.ac.cn/flagrelease-public/flagrelease-iluvatar-release-model_qwen3-8b-tree_none-gems_4.2.1rc0-scale_0.8.0-cx_none-python_3.10.18-torch_2.7.1_corex.4.4.0-pcp_ix-ml4.4.0-gpu_iluvatar001-arc_amd64-driver_4.4.0:260227
```

### Serve

```bash
flagscale serve qwen3

```

## Service Invocation

### API-based Invocation Script

```bash
import openai

openai.api_key = "EMPTY"
openai.base_url = "http://<server_ip>:8000/v1/"

model = "/root/data/Qwen3-8B"

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What's the weather like today?"}
]

response = openai.chat.completions.create(
    model=model,
    messages=messages,
    temperature=0.7,
    top_p=0.95,
    stream=False,
)

print(response.choices[0].message.content)

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

# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support

# License

本模型的权重来源于Qwen/Qwen3-4B，以apache2.0协议https://www.apache.org/licenses/LICENSE-2.0.txt开源。