# Introduction
C2S-Scale-Gemma-27B was jointly developed by the van Dijk Lab at Yale University, Google Research, and Google DeepMind. Built on the Gemma-2 27B architecture, it was trained using the Cell2Sentence (C2S) framework, which converts single-cell RNA sequencing data into "cell sentences" for model training. Trained on over 57 million cells, the model supports tasks such as cell type prediction, tissue classification, and gene expression profile generation, demonstrating the tremendous potential of applying large language models to single-cell biology.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Hygon** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | C2S-Scale-Gemma-2-27B-Nvidia-Origin | C2S-Scale-Gemma-2-27B-Hygon-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| medqa_4options | 0.5169                            | 0.5208                                    |
| pubmedqa          | 0.542                            | 0.542                                   |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 20.10.24, build 297e128 |
| Operating System | Sugon OS 8.9 |

## Operation Steps

### Download FlagOS Image
```
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-c2s-scale-gemma-2-27b-hygon-tree_0.5.0_hcu3.0-gems_5.0.0-vllm_0.15.1_das.opt1.alpha.dtk2604.20260220.g2799735a-plugin_none-cx_none-python_3.10.12-torch_2.9.0_das.opt1.dt:202605211626
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/C2S-Scale-Gemma-2-27B-hygon-FlagOS --local_dir /data/C2S-Scale-Gemma-2-27B
```

### Start the Container
```bash
docker run \
    --name flagos \
    --network=host \
    --ipc=host \
    --device=/dev/kfd \
    --device=/dev/mkfd \
    --device=/dev/dri \
    -v /opt/hyhal:/opt/hyhal \
    -v /root/perfxlab:/workspace \
    -v /data:/data \
    --group-add video \
    --cap-add=SYS_PTRACE \
    --security-opt seccomp=unconfined \
    -itd \
    harbor.baai.ac.cn/flagrelease-public/flagrelease-c2s-scale-gemma-2-27b-hygon-tree_0.5.0_hcu3.0-gems_5.0.0-vllm_0.15.1_das.opt1.alpha.dtk2604.20260220.g2799735a-plugin_none-cx_none-python_3.10.12-torch_2.9.0_das.opt1.dt:202605211626
```
### Start the Server
```bash
vllm serve /data/C2S-Scale-Gemma-2-27B --enforce-eager -tp 2 --served-model-name flagos
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "flagos",
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
The model weights are derived from vandijklab/C2S-Scale-Gemma-2-27B and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
