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
FlagOS is a fully open-source system software stack for heterogeneous AI chips. It unifies the model–system–chip layers to enable a "develop once, run anywhere" workflow, eliminating the fragmentation among vendor-specific software stacks and substantially lowering the cost of porting AI workloads across accelerators.
In this release, Qwen-Image-2.1 leverages the FlagOS software stack to provide direct multi-chip support. By integrating the Triton-based operator library FlagGems via the Torch-FL plugin, FlagOS enables seamless adaptation of the Diffusers library across chip platforms; the usage experience remains identical to that on NVIDIA, requiring zero code modifications. Inference accuracy across all platforms has been aligned with the official implementation.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | Qwen-Image-2.1-Nvidia-Origin | Qwen-Image-2.1-Mthreads-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| T2I-100 (ClipScore) | 33.66                              | 33.56                                   |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 29.3.1 |
| Operating System | 22.04.5 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/qwen-image-2.1-mthreads001-gemsnone-treenone-cxnone-pluginnone-vllmnone-sglangnone-sglangflnone-cp310-ptnone-musanone-x64-3.3.5-server:202609200725
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen-Image-2.1-BF16-mthreads-FlagOS --local_dir /data/Qwen-Image-2.1
```

### Start the Container
```bash
docker run -d \
  --name qwen \
  --runtime=mthreads --network=host --ipc=host --shm-size=32g \
  -e MUSA_VISIBLE_DEVICES=3 \
  -e TORCH_DEVICE_BACKEND_AUTOLOAD=0 \
  -e MODEL_PATH=/public-flash/models/Qwen-Image-2.1 \
  -e OUT_DIR=/output/bench_1024 \
  -v /data/models/Qwen-Image-2.1:/public-flash/models/Qwen-Image-2.1:ro \
  --entrypoint sleep \
  harbor.baai.ac.cn/flagrelease-public/qwen-image-2.1-mthreads001-gemsnone-treenone-cxnone-pluginnone-vllmnone-sglangnone-sglangflnone-cp310-ptnone-musanone-x64-3.3.5-server:202609200725 infinity
```
### Start the Server
```bash
cd /opt/qwen21-no-fbc-optimized/pr342-source

export PYTHON=/review/delivery/venv/bin/python
export PYTHONPATH=/review/pr342-autoload:/review/pr342-site:/opt/qwen21-runtime:/review/pr342-diffusers:$PWD
export TORCH_DEVICE_BACKEND_AUTOLOAD=0
export LD_LIBRARY_PATH=/usr/local/musa/lib:/usr/local/musa/lib64:${LD_LIBRARY_PATH:-}
export QWEN_IMAGE_21_MODEL=/data/Qwen-Image-2.1
export QWEN_IMAGE_21_DIFFUSERS=/review/pr342-diffusers
export TRITON_CACHE_DIR=/opt/qwen21-triton-cache
export PYTHONWARNINGS=ignore
export FLAGGEMS_LIBENTRY_DEFAULT_BENCHMARK=event
export FLAGOS_ACCELERATOR=musa
export FLAGOS_LOG=fallback
export FLAGOS_OP_randn=musa
export FLAGOS_OP_convolution_overrideable=flaggems
export FLAGOS_OP_add__Tensor=flaggems
export FLAGOS_OP_div__Tensor=flaggems
export FLAGOS_OP_add___Tensor=flaggems
export FLAGOS_OP_sub__Tensor=flaggems
export LOG=/output/bench_1024/bench.log

mkdir -p /output/bench_1024
tests/manual/qwen_image_21/run.sh bench \
  --device flagos --batch 1 --steps 40 \
  --height 1024 --width 1024 --seed 42 --true-cfg-scale 1 \
  --warmup 2 --min-run-time 60 \
  --out /output/bench_1024/result.json \
  --image /output/bench_1024/result.png
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
The model weights are derived from Qwen/Qwen-Image-2.1 and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

