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
- Released **FlagOS-Hygon** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniCPM-OCR-1.0-Nvidia-Origin | MiniCPM-OCR-1.0-Hygon-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| OcrBench     | 80.5                           | 79.4                                 |
| omni_doc_bench_v1_6 | 96.4585                        | 96.42094                             |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 27.3.1 |
| Operating System | 22.04 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minicpm-ocr-hygon001-gems0.0-tree0.6.2-cxnone-plugin0.0.0-vllm0.24.0-sglangnone-sglangflnone-cp310-pt210-dtk2604-x64-6.3.30-v1.4.1a:202610261850
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-OCR-1.0-hygon-FlagOS --local_dir /data/MiniCPM-OCR-1.0
```

### Start the Container
```bash
docker run -d \
  --name minicpm-ocr-hygon-release-20261026 \
  --network host \
  --ipc host \
  --device /dev/kfd \
  --device /dev/dri \
  --cap-add SYS_PTRACE \
  --security-opt seccomp=unconfined \
  --security-opt label=disable \
  -e HIP_VISIBLE_DEVICES=4 \
  -e CUDA_VISIBLE_DEVICES=4 \
  --mount type=bind,src=/data/adaptation/ocr-dual/vllm/hygon/20261022/ocr/work/models/merge_rl_mergedp1_7140_hf5_4x,dst=/models/merge_rl_mergedp1_7140_hf5_4x,readonly \
  --mount type=bind,src=/opt/hyhal,dst=/opt/hyhal,readonly \
  -v /data:/data \
  -v /data/adaptation/ocr-dual/vllm/hygon/20261022/ocr/release-20261026/registry-validation/logs:/logs \
  -v /data/adaptation/ocr-dual/vllm/hygon/20261022/ocr/release-20261026/registry-validation/cache:/cache \
  -v /data/adaptation/ocr-dual/vllm/hygon/20261022/ocr/release-20261026/registry-validation/cache/home-cache:/root/.cache \
  -v /data/adaptation/ocr-dual/vllm/hygon/20261022/ocr/release-20261026/registry-validation/cache/home-flaggems:/root/.flaggems \
  -v /data/adaptation/ocr-dual/vllm/hygon/20261022/ocr/release-20261026/registry-validation/cache/home-flagtree:/root/.flagtree \
  -v /data/adaptation/ocr-dual/vllm/hygon/20261022/ocr/release-20261026/registry-validation/cache/home-flagdnn:/root/.flagdnn \
  -v /data/adaptation/ocr-dual/vllm/hygon/20261022/ocr/release-20261026/registry-validation/cache/home-triton:/root/.triton \
  harbor.baai.ac.cn/flagrelease-public/minicpm-ocr-hygon001-gems0.0-tree0.6.2-cxnone-plugin0.0.0-vllm0.24.0-sglangnone-sglangflnone-cp310-pt210-dtk2604-x64-6.3.30-v1.4.1a:202610261850
```
### Start the Server
```bash
docker exec -d minicpm-ocr-hygon-release-20261026 /bin/bash -c 'set -euo pipefail
export LD_LIBRARY_PATH=/opt/dtk-26.04-DCC2602-0317/hip/lib:/opt/dtk-26.04-DCC2602-0317/lib:/opt/dtk-26.04-DCC2602-0317/.hyhal/rocm_smi/lib:/opt/dtk-26.04-DCC2602-0317/aillvm/lib
export TRITON_HIP_CLANG_PATH=/opt/ocr/bin/clang18-hygon.sh
export HIP_VISIBLE_DEVICES=4 CUDA_VISIBLE_DEVICES=4 FLAGGEMS_VENDOR=hygon
export TRITON_CACHE_DIR=/cache/triton FLAGGEMS_CACHE_DIR=/cache/flaggems
export VLLM_CACHE_ROOT=/cache/vllm TORCHINDUCTOR_CACHE_DIR=/cache/torchinductor
export XDG_CACHE_HOME=/cache
export FLAGGEMS_ENABLE_OPLIST_PATH=/logs/flaggems_enable_oplist.txt
unset PYTHONPATH
export VLLM_PLUGINS=fl,ocr_reference,ocr_graph,ocr_full_graph,ocr_vision_fa2,ocr_encoder_graph,ocr_cpu_merger_metadata OCR_CPU_MERGER_METADATA=1 OCR_DECODE_GRAPH=1 OCR_FULL_DECODE_GRAPH=1 OCR_VISION_VARLEN_FA2=1 OCR_VISION_ENCODER_GRAPH=1 OCR_VISION_DYNAMIC_MASK_GRAPH=1 OCR_KV_METADATA_GRAPH=0 OCR_PACK_CAPACITY_POLICY=adaptive
export OCR_UNIQUE_TOPK1_MASK=1
export USE_FLAGGEMS=1 VLLM_FL_FLAGOS_WHITELIST=rms_norm,rotary_embedding,silu_and_mul,gelu_and_mul,attention_backend,gelu,linear,bmm,layer_norm,mean,pow,rsqrt
export BATCH_INVARIANT=0 VLLM_BATCH_INVARIANT=0
export VLLM_USE_FLASHINFER_SAMPLER=0
export OMP_NUM_THREADS=8 MKL_NUM_THREADS=8 OPENBLAS_NUM_THREADS=8
export HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1
unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY all_proxy ALL_PROXY
cd /tmp
exec taskset -c 64-79 /usr/bin/python -m vllm.entrypoints.openai.api_server \
 --model /data/MiniCPM-OCR-1.0 \
 --served-model-name minicpm-ocr-1.0 --trust-remote-code --dtype bfloat16 \
 --tensor-parallel-size 1 --host 0.0.0.0 --port "${VLLM_PORT:-18509}" \
 --mm-processor-kwargs '"'"'{"downsample_mode":"4x","max_slice_nums":9}'"'"' \
 --max-model-len 40960 --gpu-memory-utilization 0.65 \
 --limit-mm-per-prompt '"'"'{"image":1,"video":0}'"'"' \
 --attention-backend FLASH_ATTN --skip-mm-profiling \
 --max-num-seqs 32 --max-num-batched-tokens 8192 --compilation-config '"'"'{"mode":3,"cudagraph_mode":"FULL_AND_PIECEWISE","cudagraph_capture_sizes":[1,2,4,8,12,16,24,32]}'"'"' \
 "$@" > /logs/server.log 2>&1
'
ready=0
deadline=$((SECONDS + 1800))
while (( SECONDS < deadline )); do
  if curl --noproxy '*' --silent --fail --max-time 2 http://10.232.2.32:18509/health >/dev/null; then ready=1; break; fi
  sleep 2
done
if (( ready == 0 )); then
  docker exec minicpm-ocr-hygon-release-20261026 tail -n 100 /logs/server.log
  exit 1
fi
```

## Service Invocation
### Invocation Script
```bash
curl --noproxy '*' --fail-with-body --silent --show-error \
  --max-time 300 http://localhost:18509/v1/chat/completions \
  -H 'Content-Type: application/json' \
  --data-binary @- <<'JSON'
{"model": "minicpm-ocr-1.0", "messages": [{"role": "user", "content": [{"type": "image_url", "image_url": {"url": "data:image/png;base64,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"}}, {"type": "text", "text": "Text Recognition:"}]}], "max_tokens": 512, "temperature": 0.01, "top_p": 0.001, "top_k": 1, "repetition_penalty": 1.0, "no_repeat_ngram_size": 100, "mm_processor_kwargs": {"downsample_mode": "4x", "max_slice_nums": 9}, "chat_template_kwargs": {"enable_thinking": false}}
JSON
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
