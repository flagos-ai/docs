---
base_model:
- ""
---
# Introduction
DeepSeek-V4-Pro is the flagship model of the DeepSeek-V4 series, built on a MoE architecture with 1.6T total parameters and 49B activated parameters, supporting up to one million tokens of context. Architecturally, it employs a hybrid attention mechanism (CSA + HCA) that, in million-token scenarios, requires only 27% of the inference FLOPs and 10% of the KV cache compared to V3.2. It also introduces Manifold-Constrained Hyperconnections (mHC) to improve cross-layer signal propagation stability, and uses the Muon optimizer to enhance training efficiency. The model was pre-trained on 32T+ high-quality tokens. Its most powerful inference mode, Pro-Max, achieves top-tier results on coding benchmarks and substantially closes the gap with leading closed-source models on reasoning and agent tasks — making it one of the best open-source models currently available.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Hygon** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | DeepSeek-V4-Pro-Nvidia-Origin | DeepSeek-V4-Pro-Hygon-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| GPQA | -                              | 0.6333                                  |
| Aime       | -                              | 0.7                                    |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 20.10.24, build 297e128 |
| Operating System | Sugon OS 8.9 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-hygon-release-model_hygon-new-gems-tree-tree_0.5.0_hcu3.0-gems_5.0.1rc0-cx_none-python_3.10.12-torch_2.9.0_das.opt1.dtk2604.20260206.g275d08c2-gpu_hygon001-arc_amd64-driver_6.3.31-v1.5.0a:202604242039
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/DeepSeek-V4-Pro --local_dir /data/DeepSeek-V4-Pro
```

### Start the Container
```bash
export NCCL_SOCKET_IFNAME=eno1
export NCCL_IB_DISABLE=1
export NCCL_DEBUG=INFO
export USE_FLAGGEMS=1
export NCCL_DEBUG=WARN
export GEMS_VENDOR=hygon
docker run \
  --name flagos \
  --network=host \
  --ipc=host \
  --device=/dev/kfd \
  --device=/dev/mkfd \
  --device=/dev/dri \
  -v /opt/hyhal:/opt/hyhal \
  -v /baai:/baai \
  --group-add video \
  --cap-add=SYS_PTRACE \
  --security-opt seccomp=unconfined \
  -itd \
  harbor.baai.ac.cn/flagrelease-public/flagrelease-hygon-release-model_hygon-new-gems-tree-tree_0.5.0_hcu3.0-gems_5.0.1rc0-cx_none-python_3.10.12-torch_2.9.0_das.opt1.dtk2604.20260206.g275d08c2-gpu_hygon001-arc_amd64-driver_6.3.31-v1.5.0a:202604242039
docker exec -it flagos /bin/bash
```

## Service Invocation
### Invocation Script
```bash
cd /workspace
bash run_node0.sh
bash run_node1.sh
# The reasoning answers are DCD
```

## Using FlagOS Source Code for Installation and Deployment

### Installing the FlagOS Operator Library

Official repository: https://github.com/flagos-ai/FlagGems

```powershell
# Install base dependencies
pip install -r requirements.txt
pip install flag-gems==5.0.2
```

### Installing the FlagOS Compiler

Official repository: https://github.com/flagos-ai/flagtree

```shell
# The installation command uses the NVIDIA platform as an example:
python3 -m pip uninstall -y triton
python3 -m pip install flagtree===0.5.0 --index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple
```

### Deploying with the DeepSeek-V4-FlagOS Code Repository

Official repository: https://github.com/flagos-ai/DeepSeek-V4-FlagOS

- **Single Node (8 GPUs)**

Use the following command, or run `bash run_mp8.sh` directly:

```bash
export USE_FLAGGEMS=1  # Enable acceleration
torchrun --nproc-per-node 8 generate.py \
  --max-new-tokens 64 \
  --ckpt-path /path/to/model_bf16_mp8 \
  --config config_from_bf16.json \
  --input-file prompt.txt
```

- **Dual Node (16 GPUs)**

**Node 0:**

Use the following command, or run `bash run_node_0.sh` directly on Node 0:

```bash
export NCCL_SOCKET_IFNAME=eth0
export NCCL_IB_DISABLE=1
export USE_FLAGGEMS=1
export USE_OGROUPS_COMM=1

torchrun --nnodes=2 --nproc_per_node=8 --node_rank=0 \
  --master_addr=<master_ip> --master_port=29500 generate.py \
  --ckpt-path /path/to/model_bf16_mp16 \
  --config config_from_bf16.json \
  --input-file prompt.txt \
  --max-new-tokens 64
```

**Node 1:**

Use the following command, or run `bash run_node_1.sh` directly on Node 1:

```bash
export NCCL_SOCKET_IFNAME=eth0
export NCCL_IB_DISABLE=1
export USE_FLAGGEMS=1
export USE_OGROUPS_COMM=1

torchrun --nnodes=2 --nproc_per_node=8 --node_rank=1 \
  --master_addr=<master_ip> --master_port=29500 generate.py \
  --ckpt-path /path/to/model_bf16_mp16 \
  --config config_from_bf16.json \
  --input-file prompt.txt \
  --max-new-tokens 64
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
The model weights are derived from deepseek-ai/DeepSeek-V4-Pro and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

