# Introduction


### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | T-pro-it-2.0-mthreads-FlagOS-Origin | T-pro-it-2.0-mthreads-FlagOS-FlagOS |
|--------------|-------------------------------------|-------------------------------------|
| GPQA_Diamond | - | - |
| ERQA | - | - |
| Aime24 | - | - |
| MATH_500 | 95.4 | 94.8 |
| MMLU | 88.31 | 88.49 |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | 24.0.7 |
| Operating System | Ubuntu 22.04.5 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-project/t-pro-it-2.0-mthreads001-gems5.4.0-tree3.6.0-cxnone-plugin0.3.0-vllm0.28.0-cp310-pt29-musa43-x64-3.3.6-server:202611271651-v3
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/T-pro-it-2.0-mthreads-FlagOS --local_dir /data/T-pro-it-2.0-FlagOS
```

### Start the Container
```bash
docker run -itd --name flagos --runtime=mthreads --net=host --ipc=host --privileged --shm-size=64g --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --tmpfs /tmp:exec -e MTHREADS_VISIBLE_DEVICES=all -e MTHREADS_DRIVER_CAPABILITIES=all -v /data:/data --entrypoint /bin/bash harbor.baai.ac.cn/flagrelease-project/t-pro-it-2.0-mthreads001-gems5.4.0-tree3.6.0-cxnone-plugin0.3.0-vllm0.28.0-cp310-pt29-musa43-x64-3.3.6-server:202611271651-v3
```
### Start the Server
```bash
PYTHONSAFEPATH=1 VLLM_WORKER_MULTIPROC_METHOD=spawn MUSA_CI_DEPENDENCY_MANIFEST=/opt/musa/dependency-manifest.json MUSA_CI_DEPENDENCY_MANIFEST_SHA256=cd5b1e7a1c232c60df49c1384278a924e17e2a0bc71f9546fe4f8516ad9d5cf2 MUSA_CI_DEPENDENCY_PROFILE=latest MUSA_CI_EMPTY_WHEEL=/opt/musa/wheelhouse/vllm-0.28.0+empty-cp310-cp310-linux_x86_64.whl MUSA_CI_EMPTY_WHEEL_SHA256=2306c2ea119182a5690eb05776cdffa4ba097a92ba13114a6cb49722d0b53fec MUSA_HOME=/usr/local/musa PYTHONUNBUFFERED=1 USE_FLAGGEMS=1 VLLM_FL_FLAGOS_BLACKLIST='' VLLM_FL_FLAGOS_BLACKLIST_APPEND='' VLLM_FL_PREFER_ENABLED=true VLLM_PLUGINS=fl VLLM_VENDOR=musa PYTHONPATH=/opt/flagos/startup/compat FLAGOS_ASCEND_COMPAT=1 FLAGOS_GPU_VENDOR=mthreads python3 -m vllm.entrypoints.cli.main serve /data/T-pro-it-2.0-FlagOS --host 0.0.0.0 --port 8000 --served-model-name T-pro-it-2.0 --tensor-parallel-size 2 --max-model-len 32768 --trust-remote-code
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "T-pro-it-2.0",
    "max_tokens": 4096,
    "messages": [{"role": "user", "content": "Answer the following multiple choice question. The last line of your response should be of the following format: ANSWER: [LETTER] where [LETTER] is one of A,B,C,D. Think step by step before answering.\n\nThe access matrix approach to protection has the difficulty that\n\nA) the matrix, if stored directly, is large and can be clumsy to manage\nB) it is not capable of expressing complex protection requirements\nC) deciding whether a process has access to a resource is undecidable\nD) there is no way to express who has rights to change the access matrix itself"}]
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
**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a "develop once, run anywhere" workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of \<chip + open-source model\>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.
## FlagGems
FlagGems is a high-performance, generic operator library implemented in [Triton](https://github.com/openai/triton) language. It is built on a collection of backend-neutral kernels that aims to accelerate LLM (Large-Language Models) training and inference across diverse hardware platforms.
## FlagTree
FlagTree is an open source, unified compiler for multiple AI chips project dedicated to developing a diverse ecosystem of AI chip compilers and related tooling platforms, thereby fostering and strengthening the upstream and downstream Triton ecosystem. Currently in its initial phase, the project aims to maintain compatibility with existing adaptation solutions while unifying the codebase to rapidly implement single-repository multi-backend support. For upstream model users, it provides unified compilation capabilities across multiple backends; for downstream chip manufacturers, it offers examples of Triton ecosystem integration.
## FlagScale and vllm-plugin-fl
Flagscale is a comprehensive toolkit designed to support the entire lifecycle of large models. It builds on the strengths of several prominent open-source projects, including [Megatron-LM](https://github.com/NVIDIA/Megatron-LM) and [vLLM](https://github.com/vllm-project/vllm), to provide a robust, end-to-end solution for managing and scaling large models.
vllm-plugin-fl is a vLLM plugin built on the FlagOS unified multi-chip backend, to help flagscale support multi-chip on vllm framework.
## **FlagCX**
FlagCX is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.

## **FlagEval Evaluation Framework**
 FlagEval is a comprehensive evaluation system and open platform for large models launched in 2023. It aims to establish scientific, fair, and open benchmarks, methodologies, and tools to help researchers assess model and training algorithm performance. It features:
 - **Multi-dimensional Evaluation**: Supports 800+ model evaluations across NLP, CV, Audio, and Multimodal fields, covering 20+ downstream tasks including language understanding and image-text generation.
 - **Industry-Grade Use Cases**: Has completed horizontal evaluations of mainstream large models, providing authoritative benchmarks for chip-model performance validation.

# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support
# License
The model weights are derived from t-tech/T-pro-it-2.0. See the upstream model repository for the license terms that apply to the weights.
