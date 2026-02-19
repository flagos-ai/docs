# Introduction
**FlagOS** is a unified heterogeneous computing software stack for large models, co-developed with leading global chip manufacturers. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of \<chip + open-source model\>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.
 	 
Based on this, the Qwen3.5-397B-A17B-nvidia-FlagOS model is adapted for the Nvidia chip using the FlagOS software stack, enabling:	
 	 
 
### Integrated Deployment
 
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Nvidia** container image supporting deployment within minutes
 
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	
# Technical Overview

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
  
 
# Evaluation Results
## Benchmark Result
|Metrics|Alibaba Tongyi's Report|Qwen3.5-397B-A17B-FlagOS|
|-------|--------------|---------------|
|ERQA(vision)|67.5 |65.28|
|AIME(Text) |91.3(2026) | 100.0(2024) |

# User Guide
 	 
Environment Setup
|  Item | Version  |
|---|---|	
|Docker Version|24.0.0|
|Operating System|Ubuntu 22.04.4|	

## Operation Steps (version 1)

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.5-397B-A17B-nvidia-FlagOS --local_dir /mnt/baai_cp_perf/flagos/models
```
### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_qwen3.5-397b-a17b-tree_none-gems_4.2.1rc0-scale_none-cx_none-python_3.12.3-torch_2.10.0-pcp_cuda13.1-gpu_nvidia003-arc_amd64-driver_570.158.01:v1
```
### Start the Container
```bash
#Container Startup
docker run --gpus all \
  --name=flagos \
  --hostname=baai-sailing-3 \
  -v /mnt/baai_cp_perf/flagos/zhouyou:/mine \
  -v /mnt/baai_cp_perf/flagos/models:/models \
  -v /mnt/baai_cp_perf/Qwen3.5-397B-A17B/snapshots/7cad2bae11cb49ca79f7d6a0954de2e2756f4e27:/models/Qwen3.5-397B-A17B-Real \
  --network=host \
  --privileged \
  --workdir=/workspace \
  harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_qwen3.5-397b-a17b-tree_none-gems_4.2.1rc0-scale_none-cx_none-python_3.12.3-torch_2.10.0-pcp_cuda13.1-gpu_nvidia003-arc_amd64-driver_570.158.01:v1 \
  /bin/bash
  
docker exec -it flagos bash
```

### Serve and use Qwen3.5-397B-A17B with vllm

Notes: you can refers to https://github.com/vllm-project/vllm to know how to use vllm

You can use 

```bash
cd /mine/qwen3_5/vllm-plugin-FL
bash run_server.sh
```
to launch server 

After that, you can do whatever you want with the vllm's server at 0.0.0.0:8000!
## Operation Steps (version 2)

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.5-397B-A17B-nvidia-FlagOS --local_dir /data/qwen35
```

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_qwen3.5-397b-a17b-tree_none-gems_4.2.1rc0-scale_none-cx_none-python_3.12.3-torch_2.10.0-pcp_cuda13.1-gpu_nvidia003-arc_amd64-driver_570.158.01:2602171855
```
### Start the inference service
```bash
#Container Startup
docker run --init --detach --net=host --user 0 --ipc=host \
           -v /data:/data --security-opt=seccomp=unconfined \
           --privileged --ulimit=stack=67108864 --ulimit=memlock=-1 \
           --shm-size=512G --gpus all  \
           --name flagos harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_qwen3.5-397b-a17b-tree_none-gems_4.2.1rc0-scale_none-cx_none-python_3.12.3-torch_2.10.0-pcp_cuda13.1-gpu_nvidia003-arc_amd64-driver_570.158.01:2602171855 sleep infinity
```
### Serve
```bash
vllm serve /data/qwen35 --port 9010 --served-model-name owen35-flagos --tensor-parallel-size 8 --max-num-batched-tokens 16384 --max-num-seqs 2048 --reasoning-parser qwen3
```

## Service Invocation

### CURL-based Invocation Script (version 1)

```bash
curl http://<server_ip>:8121/v1/chat/completions \
          -H "Content-Type: application/json" \
          -d '{
                "model": "/models/Qwen3.5-397B-A17B-Real",
                "messages": [
                               {"role": "user", "content": "介绍一下 AI agent?"}
                            ],
                "max_tokens": 10000
              }'

```
### API-based Invocation Script (version 2)
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

# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support

# License

 
  
 	 
本模型的权重来源于Qwen/Qwen3.5-397B-A17B，以apache2.0协议https://www.apache.org/licenses/LICENSE-2.0.txt开源。
