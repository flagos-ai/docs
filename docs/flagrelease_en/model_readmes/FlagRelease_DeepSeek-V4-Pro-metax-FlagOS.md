---
base_model:
- ""
---
# Introduction
DeepSeek-V4-Pro is the flagship model of the DeepSeek-V4 series, built on a MoE architecture with 1.6T total parameters and 49B activated parameters, supporting up to one million tokens of context. Architecturally, it employs a hybrid attention mechanism (CSA + HCA) that, in million-token scenarios, requires only 27% of the inference FLOPs and 10% of the KV cache compared to V3.2. It also introduces Manifold-Constrained Hyperconnections (mHC) to improve cross-layer signal propagation stability, and uses the Muon optimizer to enhance training efficiency. The model was pre-trained on 32T+ high-quality tokens. Its most powerful inference mode, Pro-Max, achieves top-tier results on coding benchmarks and substantially closes the gap with leading closed-source models on reasoning and agent tasks — making it one of the best open-source models currently available.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Metax** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
| Metrics      | DeepSeek-V4-Pro-Nvidia-Origin | DeepSeek-V4-Pro-Metax-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| GPQA | -                              | 0.6333                                   |
| Aime       | -                              | 0.7                                    |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 27.5.1, build 27.5.1-0ubuntu3~22.04.2 |
| Operating System | Ubuntu 22.04.5 LTS (Jammy Jellyfish) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagos-inner-models-release/flagrelease-metax-release-model_metax-new-gems-tree-tree_none-gems_none-scale_none-cx_none-python_3.12-pcp_3.5.3.20-gpu_metax001-arc_amd64-driver_3.5.3.11:04240026
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/DeepSeek-V4-Pro --local_dir /data/DeepSeek-V4-Pro
```

### Start the Container
```bash
docker run -d \
  --name flagos \
  --network host \
  --shm-size 100g \
  --workdir /metaxdata \
  --device /dev/dri:/dev/dri:rwm \
  --device /dev/mxcd:/dev/mxcd:rwm \
  -v /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime:ro \
  -v /data:/data \
  -v /home:/home \
  harbor.baai.ac.cn/flagos-inner-models-release/flagrelease-metax-release-model_metax-new-gems-tree-tree_none-gems_none-scale_none-cx_none-python_3.12-pcp_3.5.3.20-gpu_metax001-arc_amd64-driver_3.5.3.11:04240026\
  /bin/bash -c "sleep infinity"

docker exec -it flagos /bin/bash
```

## Service Invocation
### Invocation Script
请更改容器/root下的eval_n0.sh和eval_n1.sh文件中的权重路径--ckpt-path /data/Model-X，并在两个节点执行
```bash
bash eval_n0.sh
```
```bash
bash eval_n1.sh
```
推理完成后会在结果文件results.csv中看到三条case答案
```bash
......
“The best answer is D”
......
“The best answer is C”
.....
“The best answer is D”
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

