---
license: apache-2.0
language:
- zh
- en
---

# Introduction
ModelBest, together with OpenBMB, has open-sourced the MiniCPM-OCR series for document parsing and text recognition, comprising two models: MiniCPM-OCR 1.0 (1.3B) and MiniCPM-OCR Jev (2B). Built on a unified multi-chip software stack, the FlagOS community provides Day-0 cross-chip adaptation for both models, covering 12 platforms in total: T-Head, NVIDIA, Huawei Ascend, Hygon, KUNLUNXIN, MetaX, Moore Threads, Tsingmicro, Iluvatar CoreX, Xiwang, Mac (ARM), and CIX. In this round of evaluation, the FlagOS build of Jev reached 98.7% of NVIDIA native compute throughput, while on the same platform OCR 1.0 delivered up to 1.69× native P50 throughput per unit of peak compute. On ARM edge devices, Jev completes a page-block assessment in an average of 1.20 seconds using the M5 CPU alone. Backed by FlagOS support for both multi-chip servers and ARM terminals, industry users can pick a document parsing and quality-inspection deployment that matches their business requirements and existing compute resources.

MiniCPM-OCR 1.0 targets real-world document scenarios — scans, photos, curved pages, and re-photographed screens — with support for text, formula, and complex table parsing as well as key information extraction. In official evaluations, this lightweight 1.3B-parameter model scored 93.68 on Real5-OmniDocBench, and with DSpark decoding acceleration its end-to-end processing efficiency improved by 55%. To address the problem that parsed output still needs manual verification, the 2B-parameter MiniCPM-OCR Jev acts as an "AI quality inspector" for documents: it scores the reliability of parsing results and can be plugged into different OCR models to help flag content that requires human review. Its overall AUROC on JevOCRBench reaches 0.936, close to the 0.938 of Qwen3.5-397B-A17B.


### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-T-Head** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniCPM-OCR-1.0-Nvidia-Origin | MiniCPM-OCR-1.0-T-Head-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| OcrBench     | 80.5                           | 80                                   |
| omni_doc_bench_v1_6 | 96.4585                        | 96.4217                              |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 29.7.2 |
| Operating System | 24.04.2 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minicpm-ocr-pp001-gems5.5.0-tree0.7.0-cxnone-plugin0.0.0-vllm0.24.0-cp312-pt210-hggc130-x64-2.1.1-rbd225:202610270944
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-OCR-1.0-zhenwu-FlagOS --local_dir /data/MiniCPM-OCR-1.0
```

### Start the Container
```bash
sudo docker run --privileged -dit \
  -e HOST_HOSTNAME=$(hostname) \
  --network=host \
  --device=/dev/infiniband \
  --ipc=host \
  --device=/dev/alixpu_ctl \
  --device=/dev/alixpu \
  --ulimit memlock=-1 \
  --ulimit stack=67108864 \
  --init \
  -v /mnt:/mnt \
  --name minicpm-ocr \
  harbor.baai.ac.cn/flagrelease-public/minicpm-ocr-pp001-gems5.5.0-tree0.7.0-cxnone-plugin0.0.0-vllm0.24.0-cp312-pt210-hggc130-x64-2.1.1-rbd225:202610270944
```
### Start the Server
```bash
#!/usr/bin/env bash
export CUDA_VISIBLE_DEVICES=0
export VLLM_PLUGINS=fl
export VLLM_FL_USE_FLAGGEMS_VLLM=1

vllm serve /data/MiniCPM-OCR-1.0 \
  --host 0.0.0.0 \
  --port 8000 \
  --served-model-name MiniCPM-OCR-FlagOS \
  --mm-encoder-attn-backend TORCH_SDPA \
  --max-model-len 262144 \
  --max-num-seqs 64 \
  --gpu-memory-utilization 0.55 \
  --enable-prefix-caching \
  --limit-mm-per-prompt '{"image":4,"video":1}' \
  --compilation-config '{"cudagraph_mode": "FULL_AND_PIECEWISE"}'
```

## Service Invocation
### Invocation Script
```bash
curl --noproxy "*" --fail-with-body --silent --show-error --max-time 300 \
  http://127.0.0.1:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  --data-raw '{"model": "MiniCPM-OCR-FlagOS", "messages": [{"role": "user", "content": [{"type": "image_url", "image_url": {"url": "data:image/png;base64,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58qtOxV/QkKCzW9L3nzzTccrcVBMTExZz4nanNai7D3nueeeE+qZN29euZ/tk5KS5OngvXr1sn+WfE86JCSk3MfTc3NzW7duLZzo4eHh+Ncs9mVmZjZo0MDmODs1sMuWLavoSwIAKhqJe2Xr1KmTdRgrV640mUzC84gRERFqmjhw4ID8DNaiRYucrcdoNE6bNk2ox8vLy7wCXbnmzZsnnKvX6z/++GPnO2QymUzvv/++/Ed85ZVXyj0xIyNDWKWubdu2jv/1jx8/Lkwa8fb2TklJUdYLmZuMktmRI0fkm8cREREKvgKKjo6WL8Kvv/663BPl+J19qebm5sqToWvXru3CpYGuXr1q84sFs+HDh1+7dk19R0wmU0JCgnD59ezZ08F61q1bJ8dw6tQpO6d06NDB+mA/P7+LFy860talS5fkK+e9995zqJPlGT58eFlD7dTACs+QbNiwwSXhAUBlInGvVJcuXbKOwdPTMyMjwyRNawkODla8ikt2drZ8d0rx19YlJSU9evQQahs4cGC5Jx4+fFj+anvFihXKwjB7++23hQr1en2530589NFHwlmff/65U+3K3zwsXbpURT/+l/uMkslkys3NlefbTJ48WXEk77zzjlBb/fr1y/3ORydR8FK9fPmyt7e3UM/69euVdkVU1nOijzzyyI4dO1zYkdmzZwuVOD612mg0yisU2bnN/MsvvwgHL1682PFQp0yZIpz+5JNPOn56WYTXb6NGjRQP7JAhQ6zPOnLkiPrwAKCSkbhXqkWLFlnHMHjwYHN5fHy8EN6+ffuUNSGvTNKpUyc1nU1KSpKnPdhfJ6S4uFjOGJ5++mnFMVjI994ef/xx+x9y5FN+++03pxpNSEgQanDJqp1uNUomk0le/q9169blzrC3o6Sk5M9//rNQ58aNG+2fpZMou3qfffZZoZ5p06Yp6odDQVarVu1vf/ub9TMA6jtSWlpar1496xocnG5kIX926tOnT1kHCzPKvLy8nJoftW3bNqGt5s2bOxWtLCEhQfi6LDo6WvHAtmrVyvqs69evqwwPACofiXvlMRqNwoItX375peW3wraXypKMCxcuCF+sGwwG9asfyJOn//rXv9o5/ssvvxSO9/f3T01NVRmGyWS6fv16jRo1hMrt54LyfqIKpkzIz7aqny3jVqN0+fJlYWaLXq935FlG+3788UchjAED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P378+vXrzZo1s3OWSfp/Vlxc7NT0gNOnT8vfC9thc26SPI9c2MzVVeRqHZ9k1a9fv8OHD1++fHndunWbN28Wlpuw6cCBA126dHn//fdVbt9o5lajpP7KcUNTp05du3atyx/EdHPZ2dlDhw4V5j41adJk69atCqavOMtoNMbExGzbtu2NN95YvHixgwut7t69++OPP7YuiYyMdOprMUcIa0GarV27dsqUKeWeO3jw4G+//VbY2SAzM3PNmjXz5893WYgA4BgS9wpUWlq6ZcsW65IOHTocOXKk3BNDQkKsfzSZTFu2bFmwYIGdU3x8fAoKCqxL7t27J88csOP55593aktLOeHT6XS+vr7CLuv37t1T9hCYfffu3ZObdqqG0NDQd95555133rl06dK+ffv2799/+PBhOx9dioqKXnzxxYSEhKioKCUR/2eo7jNK1apVE27MO3vluKH169ffuHFj8+bNQUFBVR1LJcnPz3/qqaeE9R9r1qy5c+fOcp+QcaHS0tIlS5acO3duy5Yt5X5wSk9PF9aR7Ny587Jly1welZy4z5w505Gs3WzYsGHTp0//4osvrAvNH+Ndu+MBAJSvCu/2y8H8wVaVKWuHeQXat29vvy05QUlMTHQq2nbt2jkVks1K5BX3kpKSnArDQefOnRMaatSokco6i4qKfvrpp5dfftl+orNkyRKVDbnVKMm75Dh75biWo9efA9q2bZudne0+Ham495wHDx7Ij7z7+PgcPnzYtQ0Zjcbc3Ny0tLQTJ058/vnn4eHhZS37OH369HKrEnaDqlGjxu+//15uDAoGVhic4ODgvLw8J7ptMqWkpMifQ3766SenKgEA9VjHvQIJ82TUOHv2rPVKybL69esLJTk5Oa5q3XHybvbyTV+XkKuVm3aWl5dX7969//nPf6alpcXExJT1Seatt96Sd+V0iluNkptcOXaUm5alp6dv27ZtyJAhwomJiYmzZs2qkpgr08OHD0eNGiU8f+nh4bFp0yZnn+Uol16v9/f3b9iwYdeuXWfMmPH111/fvn17yZIl8no1X3zxxfbt2+1UtWLFiv3791uXrFy5skWLFq4N2Kx///4RVqKiomrUqOFUDc2aNRs6dKhQePjwYZeFCAAOqpzPBzbJwfyR7rjn5eW5ausQM/s3euWtWKOiopwK2CV33J9++mnhMPNqmC63ceNGoaHR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AAAA0AASdwAAAEADSNwBAAAADSBxBwAAADSAxB0AAADQABJ3AAAAQANI3AEAAAANIHEHAAAANIDEHQAAANAAEncAAABAA0jcAQAAAA0gcQcAAAA0gMQdAAAA0AASdwAAAEADSNwBAAAADSBxBwAAADSAxB0AAADQABJ3AAAAQANI3AEAAAANIHEHAAAANIDEHQAAANAAEncAAABAA0jcAQAAAA0gcQcAAAA0gMQdAAAA0AASdwAAAEADSNwBAAAADSBxBwAAADSAxB0AAADQABJ3AAAAQANI3AEAAAANIHEHAAAANIDEHQAAANAAEncAAABAA0jcAQAAAA0gcQcAAAA0gMQdAAAA0AASdwAAAEADSNwBAAAADSBxBwAAADSAxB0AAADQABJ3AAAAQANI3AEAAAANIHEHAAAANIDEHQAAANAAEncAAABAA0jcAQAAAA0gcQcAAAA0gMQdAAAA0AASdwAAAEADSNwBAAAADSBxBwAAADSAxB0AAADQABJ3AAAAQANI3AEAAAANIHEHAAAANIDEHQAAANAAEncAAABAA0jcAQAAAA0gcQcAAAA0gMQdAAAA0AASdwAAAEADSNwBAAAADSBxBwAAADSAxB0AAADQABJ3AAAAQANI3AEAAAANIHEHAAAANIDEHQAAANAAEncAAABAA0jcAQAAAA0gcQcAAAA0gMQdAAAA0AASdwAAAEADSNwBAAAADSBxBwAAADSAxB0AAADQgP8HZhXxO3MhDQYAAAAASUVORK5CYII="}}, {"type": "text", "text": "Text Recognition:"}]}], "max_tokens": 512, "mm_processor_kwargs": {"downsample_mode": "4x", "max_slice_nums": 9}, "chat_template_kwargs": {"enable_thinking": false}, "temperature": 0.01, "top_p": 0.001, "top_k": 1, "repetition_penalty": 1.0}'
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
- Enter your question (e.g., "Explain the basics of quantum computing")
- Click the send button to get a response
# Technical Overview
**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a "develop once, run anywhere" workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of <chip + open-source model>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.
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
The model weights are derived from OpenBMB/MiniCPM-OCR-1.0 and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
