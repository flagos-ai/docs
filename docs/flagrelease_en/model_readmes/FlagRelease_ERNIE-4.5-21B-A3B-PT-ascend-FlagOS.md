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
The advanced capabilities of the ERNIE 4.5 models, particularly the MoE-based A47B and A3B series, are underpinned by several key technical innovations.

1. **Multimodal Heterogeneous MoE Pre-Training:** The models are jointly trained on both textual and visual modalities to better capture the nuances of multimodal information and improve performance on tasks involving text understanding and generation, image understanding, and cross-modal reasoning. To achieve this without one modality hindering the learning of another, a *heterogeneous MoE structure* was designed, incorporating *modality-isolated routing*, *router orthogonal loss*, and *multimodal token-balanced loss*. These architectural choices ensure that both modalities are effectively represented, allowing for mutual reinforcement during training.

2. **Scaling-Efficient Infrastructure:** A novel heterogeneous hybrid parallelism and hierarchical load balancing strategy is introduced for efficient training of ERNIE 4.5 models. By utilizing intra-node expert parallelism, memory-efficient pipeline scheduling, FP8 mixed-precision training, and fine-grained recomputation methods, high pre-training throughput is achieved. For inference, a *multi-expert parallel collaboration* method and a *convolutional code quantization* algorithm are employed to achieve 4-bit/2-bit lossless quantization. Furthermore, PD disaggregation with dynamic role switching is introduced for effective resource utilization, enhancing inference performance for ERNIE 4.5 MoE models. Built on [PaddlePaddle](GitHub - PaddlePaddle/Paddle: PArallel Distributed Deep LEarning: Machine Learning Framework from In), ERNIE 4.5 delivers high-performance inference across a wide range of hardware platforms.

3. **Modality-Specific Post-Training:** To meet the diverse requirements of real-world applications, variants of the pre-trained model are fine-tuned for specific modalities. The LLMs are optimized for general-purpose language understanding and generation, while the VLMs focus on vision-language understanding and support both thinking and non-thinking modes. Each model employs a combination of *Supervised Fine-tuning (SFT)*, *Direct Preference Optimization (DPO)*, or a modified reinforcement learning method named *Unified Preference Optimization (UPO)* during post-training.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Ascend** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.


# Evaluation Results
## Benchmark Result
| Metrics      | ERNIE-4.5-21B-A3B-PT-Nvidia-Origin | ERNIE-4.5-21B-A3B-PT-Ascend-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| aime | 0.3667 | 0.3333 |
| gpqa_generative_cot | 0.5713 | 0.5906 |
| mmlu_pro | 0.6644 | 0.6605 |
| musr_generative | 0.6296 | 0.6481 |
| livebench_new | 0.5563 | 0.5637 |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 20.10.8, build 3967b7d |
| Operating System | openEuler 22.03 (LTS-SP4) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/external-cooperation/ernie-4.5-21b-a3b-pt-ascend-tree_0.5.0_ascend3.2-gems_5.0.2-vllm_0.13.0_empty-plugin_0.1.1-cx_none-python_3.11.14-torch_2.8.0-pcp_none-npu_ascend910c-arc_aarch64-driver_25.5.0:2607070818
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/ERNIE-4.5-21B-A3B-PT-ascend-FlagOS --local_dir /data/models/ERNIE-4.5-21B-A3B-PT-ascend-FlagOS
```

### Start the Container
```bash
docker run -itd \
    --name flagos \
    --privileged \
    --ipc=host \
    --network host \
    --shm-size=32g \
    -v /usr/local/Ascend/driver:/usr/local/Ascend/driver \
    -v /usr/local/sbin/npu-smi:/usr/local/sbin/npu-smi \
    -v /usr/local/dcmi:/usr/local/dcmi \
    -v /usr/local/sbin:/usr/local/sbin \
    -v /etc/ascend_install.info:/etc/ascend_install.info \
    -v /data/models:/data/models \
    harbor.baai.ac.cn/external-cooperation/ernie-4.5-21b-a3b-pt-ascend-tree_0.5.0_ascend3.2-gems_5.0.2-vllm_0.13.0_empty-plugin_0.1.1-cx_none-python_3.11.14-torch_2.8.0-pcp_none-npu_ascend910c-arc_aarch64-driver_25.5.0:2607070818 \
    sleep infinity
docker exec -it flagos bash
```
### Start the Server
```bash
nohup env TRITON_ALL_BLOCKS_PARALLEL=0 \
        VLLM_PLUGINS=fl \
        USE_FLAGGEMS=1 \
        VLLM_FL_FLAGOS_WHITELIST=pow_scalar,zero_,cos,embedding,repeat_interleave_self_int,sin,where_self,lt_scalar,le,index \
        vllm serve \
        --model /data/models/ERNIE-4.5-21B-A3B-PT-ascend-FlagOS \
        --tensor-parallel-size 2 \
        --enforce-eager \
        --served-model-name ernie-4.5-21b-a3b-pt-flagos \
        --port 8000 > serve.log 2>&1 &
```

## Service Invocation
### Invocation Script
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "ernie-4.5-21b-a3b-pt-flagos",
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
The model weights are derived from PaddlePaddle/ERNIE-4.5-21B-A3B-PT and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

