---
base_model:
- ""
---
# Introduction
新模型介绍，待定....

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Kunlunxin** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | Model-X-Nvidia-Origin | Model-X-Kunlunxin-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| GPQA_Diamond | -                              | -                                    |
| ERQA         | -                              | -                                    |
| Aime24       | -                              | -                                    |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 28.2.2, build e6534b4 |
| Operating System | 22.04.4 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-kunlunxin-deepseek:202604232050
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Model-X --local_dir /data/Model-X
```

### Start the Container
```bash
docker run -dti --name docker_name \
  --net=host --security-opt=seccomp=unconfined \
  --cap-add=SYS_PTRACE --shm-size=256g --cap-add=SYS_ADMIN \
  --device /dev/fuse --restart=always --ulimit=memlock=-1 \
  --ulimit=nofile=120000 --ulimit=stack=67108864 \
  -v /tmp:/tmp \
  -v /data:/data \
  -v /public-nvme:/public-nvme \
  --cpuset-cpus=0-120 \
  --device=/dev/xpu0:/dev/xpu0 --device=/dev/xpu1:/dev/xpu1 \
  --device=/dev/xpu2:/dev/xpu2 --device=/dev/xpu3:/dev/xpu3 \
  --device=/dev/xpu4:/dev/xpu4 --device=/dev/xpu5:/dev/xpu5 \
  --device=/dev/xpu6:/dev/xpu6 --device=/dev/xpu7:/dev/xpu7 \
  --device=/dev/xpuctrl:/dev/xpuctrl --privileged \
  harbor.baai.ac.cn/flagrelease-public/flagrelease-kunlunxin-deepseek:202604232050 /bin/bash
```

## Service Invocation
### Invocation Script
```bash
cd /workspace/code_ds_v4/
# 测试三条gpqa
bash test_gpqa_0.sh
bash test_gpqa_2.sh
bash test_gpqa_5.sh
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
The model weights are derived from XXXXXXXX/Model-X and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

