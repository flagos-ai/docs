# Introduction
The Zhongzhi FlagOS community officially releases the Iluvatar image for Qwen3.5-35B-A3B, adapted based on FlagOS. Qwen3.5-35B-A3B is a new multimodal MoE model subsequently open-sourced by Alibaba Cloud Qwen team following the release of Qwen3.5 397B MoE, featuring 35 billion total parameters and 3 billion activated parameters, with native support for ultra-long contexts of 262,144 tokens. The model adopts an efficient hybrid architecture combining Gated Delta Networks with sparse Mixture-of-Experts (MoE), trained with early fusion on multimodal tokens, enabling unified vision-language understanding covering image, video, and other multimodal inputs, achieving comprehensive breakthroughs in reasoning, coding, Agent tasks, and visual understanding.
### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters	
- Released **FlagOS-Iluvatar** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.	

# Evaluation Results
## Benchmark Result
|Metrics|Qwen3.5-35B-A3B-Nvidia-Origin|Qwen3.5-35B-A3B-Nvidia-FlagOS|Qwen3.5-35B-A3B-Iluvatar-FlagOS|
|-------|---------------|---------------|---------------|
|ERQA(vision)|60| 56.5 |59.72 |
|GPQA_Diamond | 78.28 | 78.28 |78.28 |

# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 27.1.0, build 6312585 |
| Operating System | Ubuntu 20.04.6 LTS (focal) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-iluvatar-release-model_qwen3.5-35b-a3b-tree_none-gems_4.2.1rc0-scale_none-cx_none-python_3.10.18-torch_2.7.1_corex.4.4.0-pcp_ix-ml4.4.0-gpu_iluvatar001-arc_amd64-driver_4.4.0:202603182010
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Qwen3.5-35B-A3B-iluvatar-FlagOS --local_dir /data/Qwen3.5-35B-A3B
```

### Start the Container
```bash
docker run --shm-size="32g" -itd \
  -v /dev:/dev -v /usr/src/:/usr/src \
  -v /lib/modules/:/lib/modules \
  -v /data/:/data/ \
  --privileged --cap-add=ALL --pid=host --net=host \
  --name flagos harbor.baai.ac.cn/flagrelease-public/flagrelease-iluvatar-release-model_qwen3.5-35b-a3b-tree_none-gems_4.2.1rc0-scale_none-cx_none-python_3.10.18-torch_2.7.1_corex.4.4.0-pcp_ix-ml4.4.0-gpu_iluvatar001-arc_amd64-driver_4.4.0:202603182010 /bin/bash
docker exec -it flagos /bin/bash
```
### Start the Server
```bash
export VLLM_ENGINE_ITERATION_TIMEOUT_S=36000
export VLLM_RPC_TIMEOUT=36000000
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=3600
vllm serve /data/Qwen3.5-35B-A3B/ -tp 8 --served-model-name qwen --enforce-eager --port 8010  --max-model-len 262144 

```

## Service Invocation
### Invocation Script
Input: text
```python
from openai import OpenAI
# Set OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8010/v1"
 
client = OpenAI(
    api_key=openai_api_key,
    base_url=openai_api_base,
                )
 
response = client.chat.completions.create(
        model="qwen",
        messages=[
            {"role": "user", "content": "Give me a short introduction to large language models."},
            ],
        max_tokens=20,
        #max_tokens=1024,
        temperature=0.7,
        top_p=0.8,
        presence_penalty=1.5,
        extra_body={
            "top_k": 20,
            "chat_template_kwargs": {"enable_thinking": False},
            },
        stream=True,
        )

for chunk in response:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```
Input: image
```python
from openai import OpenAI
# Configured by environment variables
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8010/v1"
client = OpenAI(
    api_key=openai_api_key,
    base_url=openai_api_base,
                )
messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "image_url",
                "image_url": {
                    "url": "https://qianwen-res.oss-accelerate.aliyuncs.com/Qwen3.5/demo/CI_Demo/mathv-1327.jpg"
                }
            },
            {
                "type": "text",
                "text": "The centres of the four illustrated circles are in the corners of the square. The two big circles touch each other and also the two little circles. With which factor do you have to multiply the radii of the little circles to obtain the radius of the big circles?\nChoices:\n(A) $\\frac{2}{9}$\n(B) $\\sqrt{5}$\n(C) $0.8 \\cdot \\pi$\n(D) 2.5\n(E) $1+\\sqrt{2}$"
            }
        ]
    }
]
response = client.chat.completions.create(
    model="qwen",
    messages=messages,
    max_tokens=60,
    temperature=1.0,
    top_p=0.95,
    presence_penalty=1.5,
    extra_body={
        "top_k": 20,
    }, 
    stream=False,
)

if response.choices and response.choices[0].message.content:
    print(response.choices[0].message.content)
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
The model weights are sourced from Qwen/Qwen3.5-35B-A3B and open-sourced under the Apache 2.0 license: https://www.apache.org/licenses/LICENSE-2.0.txt。