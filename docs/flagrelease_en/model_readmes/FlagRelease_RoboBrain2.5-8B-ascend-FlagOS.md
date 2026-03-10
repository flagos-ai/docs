# Introduction

**FlagOS** is a unified heterogeneous computing software stack for large models, co-developed with leading global chip manufacturers. With core technologies such as the **FlagScale** distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the FlagOS stack to automatically produce and release various combinations of <chip + open-source model>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.

Based on this, the **RoboBrain2.5-8B-FlagOS** model is adapted for the Ascend chip using the FlagOS software stack, enabling:

### Integrated Deployment

- Deep integration with the open-source [FlagScale framework](https://github.com/FlagOpen/FlagScale)
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Ascend** container image supporting deployment within minutes

### Consistency Validation

- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Technical Overview

## **FlagScale Distributed Training and Inference Framework**

FlagScale is an end-to-end framework for large models across heterogeneous computing resources, maximizing computational efficiency and ensuring model validity through core technologies. Its key advantages include:

- **Unified Deployment Interface:** Standardized command-line tools support one-click service deployment across multiple hardware platforms, significantly reducing adaptation costs in heterogeneous environments.
- **Intelligent Parallel Optimization:** Automatically generates optimal distributed parallel strategies based on chip computing characteristics, achieving dynamic load balancing of computation/communication resources.
- **Seamless Operator Switching:** Deep integration with the FlagGems operator library allows high-performance operators to be invoked via environment variables without modifying model code.

## **FlagGems Universal Large-Model Operator Library**

FlagGems is a Triton-based, cross-architecture operator library collaboratively developed with industry partners. Its core strengths include:

- **Full-stack Coverage**: Over 100 operators, with a broader range of operator types than competing libraries.
- **Ecosystem Compatibility**: Supports 7 accelerator backends. Ongoing optimizations have significantly improved performance.
- **High Efficiency**: Employs unique code generation and runtime optimization techniques for faster secondary development and better runtime performance compared to alternatives.

## **FlagEval Evaluation Framework**

FlagEval (Libra)** is a comprehensive evaluation system and open platform for large models launched in 2023. It aims to establish scientific, fair, and open benchmarks, methodologies, and tools to help researchers assess model and training algorithm performance. It features:
  - **Multi-dimensional Evaluation**: Supports 800+ model evaluations across NLP, CV, Audio, and Multimodal fields, covering 20+ downstream tasks including language understanding and image-text generation.
  - **Industry-Grade Use Cases**: Has completed horizontal evaluations of mainstream large models, providing authoritative benchmarks for chip-model performance validation.

# Evaluation Results

## Benchmark Result 

| Metrics           | RoboBrain2.5-8B-NV-CUDA | RoboBrain2.5-8B-ascend-FlagOS|
|-------------------|--------------------------|-----------------------------|
| erqa | 41.250 | 41.000 |
| Where2Place | 1.220 | 0.450 |
| blink_val_ev | 78.180 | 80.490 |
| cv_bench_test | 87.490 | 87.680 |
| embspatial_bench | 75.910 | 77.390 |
| SAT | 69.330 | 74.000 |
| vsi_bench_tiny | 38.340 | 35.610 |
| robo_spatial_home_all | 49.429 | 44.286 |
| all_angles_bench | 48.360 | 50.420 |
| egoplan_bench2 | 49.050 | 49.430 |
| EmbodiedVerse-Open-Sampled | 44.320 | 44.910 |
| ERQAPlus | 21.880 | 20.880 |

# User Guide

**Environment Setup**

|Accelerator Card Driver Version | Driver Version: 25.2.0       |
| ------------------------------- | ----------------------------------- |
| CANN                 |  8.3.0.2.220 (8.3.RC2) |
| FlagTree                        | Version: 0.4.0                      |
| FlagGems                        | Version: 4.2.0                      |
| VLLM-FL                         | Version: 0.0.0                      |

## Operation Steps

### Download FlagOS Image

```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-ascend-release-model_robobrain2.5-8b-tree_0.4.0_ascend3.2e-gems_4.2.0-scale_1.0.0-cx_0.8.0-python_3.11.13-torch_npu2.8.0-pcp_cann8.3.0.2.220_8.3.rc2-gpu_ascend001-arc_arm64-driver_25.2.0:2601291835

### Download Open-source Model Weights

```bash
pip install modelscope
modelscope download --model FlagRelease/RoboBrain2.5-8B-FlagOS --local_dir /data/workspace-robobrain2.5/RoboBrain2.5-8B
```

### Start the inference service

```bash
#Container Startup
docker run -itd --name flagos -u root --privileged=true --shm-size=1000g --net=host \
    -v /usr/local/Ascend/driver:/usr/local/Ascend/driver \
    -v /usr/local/bin/npu-smi:/usr/local/bin/npu-smi \
    -v /usr/local/dcmi:/usr/local/dcmi \
    -v /usr/local/sbin:/usr/local/sbin \
    -v /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime \
    -v /etc/ascend_install.info:/etc/ascend_install.info \
    -v /data/workspace-robobrain2.5:/workspace-robobrain2.5 \
    -v /root/.cache:/root/.cache \
    -w /workspace-robobrain2.5   \
    -e VLLM_USE_V1=1 \
    -e CPU_AFFINITY_CONF=2 \
    -e PYTORCH_NPU_ALLOC_CONF=max_split_size_mb:256 \
    -e USE_FLAGGEMS=true \
harbor.baai.ac.cn/flagrelease-public/flagrelease-ascend-release-model_robobrain2.5-8b-tree_0.4.0_ascend3.2e-gems_4.2.0-scale_1.0.0-cx_0.8.0-python_3.11.13-torch_npu2.8.0-pcp_cann8.3.0.2.220_8.3.rc2-gpu_ascend001-arc_arm64-driver_25.2.0:2601291835 bash
```

### Serve

```bash
docker exec -it flagos bash
flagscale serve rb25
```

## Service Invocation

### API-based Invocation Script

```bash
import openai
openai.api_key = "EMPTY"
openai.base_url = "http://<server_ip>:9014/v1/"
model = "RoboBrain2.5-8B-ascend-flagos"
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

本模型的权重来源于BAAI/RoboBrain2.5-8B-NV，以apache2.0协议https://www.apache.org/licenses/LICENSE-2.0.txt开源。