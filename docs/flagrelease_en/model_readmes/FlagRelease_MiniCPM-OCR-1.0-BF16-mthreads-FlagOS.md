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
- Released **FlagOS-Mthreads** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniCPM-OCR-1.0-Nvidia-Origin | MiniCPM-OCR-1.0-Mthreads-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| OcrBench     | 80.5                           | 79.2                                 |
| omni_doc_bench_v1_6 | 96.4585                        | 96.4934                              |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 29.3.1 |
| Operating System | 22.04.5 LTS |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minicpm-ocr-mthreads001-gems0.0.0-treenone-cx0.13.0-pluginnone-vllmnone-sglang0.0.0-sglangfl0.1.0-cp310-pt29-musa43-x64-3.3.5-server:202610261846
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-OCR-1.0-BF16-mthreads-FlagOS --local_dir /data/MiniCPM-OCR-1.0
```

### Start the Container
```bash
docker run -d \
  --name minicpm-ocr-flagos-release \
  --runtime mthreads \
  --privileged \
  --network host \
  --ipc host \
  --shm-size 1g \
  --mount type=bind,src=/data/adaptation/minicpm-ocr/sglang/mthreads_s5000/20261026-release/weights/merge_rl_mergedp1_7140_hf5_4x,dst=/models/merge_rl_mergedp1_7140_hf5_4x,readonly \
  -v /data:/data \
  -v /data/adaptation/minicpm-ocr/sglang/mthreads_s5000/20261026-release/deploy-logs:/var/log/ocr \
  -v /data/adaptation/minicpm-ocr/sglang/mthreads_s5000/20261026-release/deploy-cache:/var/cache/ocr \
  harbor.baai.ac.cn/flagrelease-public/minicpm-ocr-mthreads001-gems0.0.0-treenone-cx0.13.0-pluginnone-vllmnone-sglang0.0.0-sglangfl0.1.0-cp310-pt29-musa43-x64-3.3.5-server:202610261846 \
  /bin/sleep infinity
docker exec -it minicpm-ocr-flagos-release /bin/bash
```
### Start the Server
```bash
docker exec -d -w /tmp \
  -e OCR_FLAGOS_ENABLE=1 \
  -e OCR_CONV_FIXED=1 \
  -e OCR_CPU_POSITION_MASK=0 \
  -e MUSA_VISIBLE_DEVICES=1 \
  -e BATCH_INVARIANT=0 \
  -e VLLM_BATCH_INVARIANT=0 \
  -e OMP_NUM_THREADS=8 \
  -e MKL_NUM_THREADS=8 \
  -e OPENBLAS_NUM_THREADS=8 \
  -e USE_FLAGGEMS=1 \
  -e SGLANG_FL_FLAGOS_BLACKLIST=count_nonzero,cumsum,mm,unique,_unique2,unique_dim,unique_consecutive,uniform_,pin_memory,_pin_memory,_foreach_copy_,linear,addmm,index_put_,_index_put_impl_,sort,sort_stable \
  -e SGLANG_FLAGGEMS_RECORD=1 \
  -e SGLANG_FLAGGEMS_LOG_PATH=/var/log/ocr/flaggems-op.txt \
  -e SGLANG_FL_DISPATCH_DEBUG=1 \
  -e SGLANG_FL_DISPATCH_LOG=/var/log/ocr/dispatch.log \
  -e SGLANG_USE_MUSA_FUSED_KERNEL=1 \
  -e SGLANG_USE_DEEPGEMM_BMM=0 \
  -e SGLANG_GDN_CHUNK_H_BV=16 \
  -e SGLANG_GDN_CHUNK_H_NUM_WARPS=8 \
  -e SGLANG_GDN_CHUNK_H_NUM_STAGES=1 \
  -e OCR_GDN_PREFILL_POLICY=h16_o64_w8s1 \
  -e TRITON_CACHE_DIR=/var/cache/ocr/triton \
  -e TORCH_EXTENSIONS_DIR=/var/cache/ocr/torch-extensions \
  -e HF_HUB_OFFLINE=1 \
  -e NO_PROXY=127.0.0.1,localhost,::1 \
  -e no_proxy=127.0.0.1,localhost,::1 \
  -e LD_LIBRARY_PATH=/usr/local/musa/lib:/usr/local/openmpi/lib:/usr/local/musa/mudnn/lib: \
  -e SGLANG_ALLOW_OVERWRITE_LONGER_CONTEXT_LEN=1 \
  -e SGLANG_SET_CPU_AFFINITY=1 \
  -e SGLANG_MOE_PADDING=1 \
  -e XDG_CACHE_HOME=/var/cache/ocr/xdg \
  -e HF_HOME=/var/cache/ocr/huggingface \
  minicpm-ocr-flagos-release /bin/bash -c 'exec /usr/bin/python -m sglang.launch_server --model-path /data/MiniCPM-OCR-1.0 --served-model-name minicpm-ocr-1.0 --host 0.0.0.0 --port 30701 --tp 1 --base-gpu-id 0 --dtype bfloat16 --context-length 40960 --attention-backend fa3 --mm-attention-backend fa3 --linear-attn-backend triton --sampling-backend pytorch --mem-fraction-static 0.85 --max-running-requests 32 --chunked-prefill-size 8192 --page-size 1 --disable-radix-cache --skip-server-warmup --trust-remote-code --log-level-http warning > /var/log/ocr/server.log 2>&1'
/usr/bin/python3 - <<'WAIT_OCR'
import time, urllib.request, subprocess
end = time.monotonic() + 1500
while time.monotonic() < end:
    try:
        with urllib.request.urlopen('http://127.0.0.1:30701/health', timeout=5) as response:
            if response.status == 200:
                print('MiniCPM-OCR ready on port 30701')
                break
    except Exception:
        pass
    time.sleep(5)
else:
    subprocess.run(['docker', 'exec', 'minicpm-ocr-flagos-release', '/usr/bin/tail', '-n', '120', '/var/log/ocr/server.log'])
    raise SystemExit('OCR did not become ready within 1500 seconds; inspect logs before retrying')
WAIT_OCR
```

## Service Invocation
### Invocation Script
```bash
curl --fail-with-body --silent --show-error --max-time 300 \
  http://localhost:30701/v1/chat/completions \
  -H 'Content-Type: application/json' \
  --data-binary '{"model":"minicpm-ocr-1.0","messages":[{"role":"user","content":[{"type":"image_url","image_url":{"url":"data:image/png;base64,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"}},{"type":"text","text":"Text Recognition:"}]}],"max_tokens":512,"temperature":0.01,"top_p":0.001,"top_k":1,"repetition_penalty":1.0,"chat_template_kwargs":{"enable_thinking":false},"mm_processor_kwargs":{"downsample_mode":"4x","max_slice_nums":9}}'
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
