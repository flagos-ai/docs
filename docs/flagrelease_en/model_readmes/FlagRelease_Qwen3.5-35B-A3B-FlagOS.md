---
base_model:
- ""
---
# Introduction
On February 16, 2026, Alibaba Cloud officially launched and open-sourced the new multimodal large model **Qwen3.5 (Qwen3.5-35B-A3B-FlagOS)**.Qwen3.5 features the following enhancement:  
**Unified Vision-Language Foundation**: Early fusion training on multimodal tokens achieves cross-generational parity with Qwen3 and outperforms Qwen3-VL models across reasoning, coding, agents, and visual understanding benchmarks.  
**Efficient Hybrid Architecture**: Gated Delta Networks combined with sparse Mixture-of-Experts deliver high-throughput inference with minimal latency and cost overhead.  
**Scalable RL Generalization**: Reinforcement learning scaled across million-agent environments with progressively complex task distributions for robust real-world adaptability.  
**Global Linguistic Coverage**: Expanded support to 201 languages and dialects, enabling inclusive, worldwide deployment with nuanced cultural and regional understanding.  
**Next-Generation Training Infrastructure**: Near-100% multimodal training efficiency compared to text-only training and asynchronous RL frameworks supporting massive-scale agent scaffolds and environment orchestration.  

Leveraging the cross-chip capabilities of FlagOS, a unified open-source system software stack purpose-built for diverse AI chips, [the FlagOS community](https://flagos.io "Visit the official FlagOS website") completed full adaptation, accuracy alignment, and multi-chip migration of the largest 397B MoE model immediately after the release of Qwen3.5, enabling the simultaneous adaptation and launch of Qwen3.5 on NVIDIA chips:	 
 	  
### Integrated Deployment

- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Nvidia** container image supporting deployment within minutes

### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
|Metrics|Qwen3.5-35B-A3B-Nvidia-Origin|Qwen3.5-35B-A3B-FlagOS|
|-------|---------------|---------------|
|ERQA(vision)|60|56.5|
|AIME(Text) | 50(2024) |50(2024)|

# User Guide

Environment Setup
|Item|Version|
|-------|--------------|
|Docker Version|24.0.0 |
|Operating System|Ubuntu 22.04.4|

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.5-35B-A3B-FlagOS --local_dir /data/Qwen3.5-35B-A3B
```

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_qwen3.5-35b-a3b-tree_0.4.0-3.5-gems_4.2.1rc0-scale_none-cx_none-python_3.12.3-torch_2.10.0-pcp_cuda13.1-gpu_nvidia003-arc_amd64-driver_570.158.01:2603031500
```
### Start the inference service
```bash
# Container Startup
docker run --init --detach --net=host --user 0 --ipc=host \
           -v /data:/data --security-opt=seccomp=unconfined \
           --privileged --ulimit=stack=67108864 --ulimit=memlock=-1 \
           --shm-size=512G --gpus all \
           -e USE_FLAGOS=1 \
           --name flagos harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_qwen3.5-35b-a3b-tree_0.4.0-3.5-gems_4.2.1rc0-scale_none-cx_none-python_3.12.3-torch_2.10.0-pcp_cuda13.1-gpu_nvidia003-arc_amd64-driver_570.158.01:2603031500 sleep infinity

docker exec -it flagos bash
```
### Serve
```bash
vllm serve /data/Qwen3.5-35B-A3B --port 9010 --served-model-name qwen35-flagos --tensor-parallel-size 1 --max-num-batched-tokens 16384 --max-num-seqs 2048 --reasoning-parser qwen3
```

## Service Invocation


### API-based Invocation Script
```bash
import openai
openai.api_key = "EMPTY"
openai.base_url = "http://<server_ip>:9010/v1/"
model = "qwen35-flagos"
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
for item in response:
    print(item)

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

本模型的权重来源于Qwen/Qwen3.5-35B-A3B，以apache2.0协议https://www.apache.org/licenses/LICENSE-2.0.txt开源。



