---
base_model:
- ""
---
# Introduction
Leveraging the cross-chip capabilities of FlagOS, a unified open-source system software stack purpose-built for diverse AI chips, [the FlagOS community](https://flagos.io "Visit the official FlagOS website") completed full adaptation, accuracy alignment, enabling the simultaneous adaptation and launch of GLM-5 on Ascend chips:	 
 	  
### Integrated Deployment

- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS** container image supporting deployment within minutes

### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	


# Evaluation Results
## Benchmark Result
|Metrics|GLM-5 Technical Report|GLM-5-ascend-FlagOS(W4A8)|
|-------|---------------|---------------|
|GPQA-Diamond|86|82.32|
|AIME | 92.7(2026) |96.67(2024)|

# User Guide

Environment Setup
|Item|Version|
|-------|--------------|
|Docker Version|20.10.8 |
|Operating System|Linux 5.10.0|

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagreleaes_ascend_glm5
```

### Download Open-source Model Weights
```bash
mkdir -p /data/glm
pip install modelscope
modelscope download --model FlagRelease/GLM-5-ascend-FlagOS --local_dir /data/glm/glm5-w4a8
```


### Start the inference service
```bash
# Container Startup
docker run -itd --name flagos -u root --privileged=true --shm-size=1000g --net=host     -v /usr/local/Ascend/driver:/usr/local/Ascend/driver     -v /usr/local/bin/npu-smi:/usr/local/bin/npu-smi     -v /usr/local/dcmi:/usr/local/dcmi     -v /usr/local/sbin:/usr/local/sbin     -v /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime     -v /etc/ascend_install.info:/etc/ascend_install.info     -v /data:/data     -v /root/.cache:/root/.cache       harbor.baai.ac.cn/flagrelease-public/flagreleaes_ascend_glm5 bash

docker exec -it flagos bash
```
### Serve
```bash
export HCCL_OP_EXPANSION_MODE="AIV"
export OMP_PROC_BIND=false
export OMP_NUM_THREADS=10
export VLLM_USE_V1=1
export HCCL_BUFFSIZE=400
export PYTORCH_NPU_ALLOC_CONF=expandable_segments:True
export VLLM_ASCEND_BALANCE_SCHEDULING=1
vllm serve /data/glm/glm5-w4a8 --port 9010 --tensor-parallel-size 16 --data-parallel-size 1 --enable-expert-parallel --trust-remote-code --quantization ascend --async-scheduling --gpu-memory-utilization 0.95 --tool-call-parser glm47 --reasoning-parser glm45 --enable-auto-tool-choice --served-model-name glm5-ascend-flagos --compilation-config '{"cudagraph_mode": "FULL_DECODE_ONLY"}'
```

## Service Invocation


### API-based Invocation Script
```bash
import openai
openai.api_key = "EMPTY"
openai.base_url = "http://<server_ip>:9010/v1/"
model = "glm5-ascend-flagos"
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

本模型的权重来源于Eco-Tech/GLM-5-w4a8-mtp-QuaRot，以apache2.0协议https://www.apache.org/licenses/LICENSE-2.0.txt开源。



