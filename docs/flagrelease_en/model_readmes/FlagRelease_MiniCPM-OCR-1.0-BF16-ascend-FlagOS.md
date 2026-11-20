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
- Released **FlagOS-Ascend** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniCPM-OCR-1.0-Nvidia-Origin | MiniCPM-OCR-1.0-Ascend-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| OcrBench     | 80.5                           | 80.6                                 |
| omni_doc_bench_v1_6 | 96.4585                        | 96.4263                              |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 20.10.8 |
| Operating System | openEuler 22.03 (LTS-SP4) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/minicpm-ocr-ascend001-gems0.0.0-treenone-cx0.13.0-pluginnone-vllmnone-sglang0.5.11-sglangfl0.1.0-cp311-ptnpu28-cann85-a64-none:202610262003
```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-OCR-1.0-BF16-ascend-FlagOS --local_dir /data/MiniCPM-OCR-1.0
```

### Start the Container
```bash
docker run \
  -d \
  --runtime ascend \
  --name minicpm-ocr-flagos \
  --network host \
  --ipc host \
  --shm-size 128g \
  --security-opt label=disable \
  -e ASCEND_RT_VISIBLE_DEVICES=0 \
  -e TORCH_DEVICE_BACKEND_AUTOLOAD=0 \
  --device /dev/davinci0 \
  --device /dev/davinci_manager \
  --device /dev/devmm_svm \
  --device /dev/hisi_hdc \
  --mount type=bind,src=/data/adaptation/ocr-main/sglang_fl/ascend910c/20261021-tp1/work/models/merge_rl_mergedp1_7140_hf5_4x,dst=/models/merge_rl_mergedp1_7140_hf5_4x,readonly,bind-propagation=rprivate \
  --mount type=bind,src=/usr/local/Ascend/driver,dst=/usr/local/Ascend/driver,readonly,bind-propagation=rprivate \
  --mount type=bind,src=/usr/local/Ascend/firmware,dst=/usr/local/Ascend/firmware,readonly,bind-propagation=rprivate \
  --mount type=bind,src=/etc/ascend_install.info,dst=/etc/ascend_install.info,readonly,bind-propagation=rprivate \
  -v /data:/data \
  -v /data/adaptation/ocr-main/sglang_fl/ascend910c/20261021-tp1/image-release20261026/deployment/logs:/var/log/minicpm-ocr:rprivate \
  -v /data/adaptation/ocr-main/sglang_fl/ascend910c/20261021-tp1/image-release20261026/deployment/logs/ascend:/root/ascend/log:rprivate \
  -v /data/adaptation/ocr-main/sglang_fl/ascend910c/20261021-tp1/image-release20261026/deployment/cache:/var/cache/minicpm-ocr:rprivate \
  -v /data/adaptation/ocr-main/sglang_fl/ascend910c/20261021-tp1/image-release20261026/deployment/tmp:/tmp:rprivate \
  -w /opt/minicpm-ocr \
  --entrypoint /bin/bash \
  harbor.baai.ac.cn/flagrelease-public/minicpm-ocr-ascend001-gems0.0.0-treenone-cx0.13.0-pluginnone-vllmnone-sglang0.5.11-sglangfl0.1.0-cp311-ptnpu28-cann85-a64-none:202610262003 \
  -lc 'sleep infinity'

```
### Start the Server
```bash
docker exec \
  -d \
  -w /opt/minicpm-ocr \
  -e ATB_STREAM_SYNC_EVERY_KERNEL_ENABLE=0 \
  -e ATB_STREAM_SYNC_EVERY_RUNNER_ENABLE=0 \
  -e ATB_STREAM_SYNC_EVERY_OPERATION_ENABLE=0 \
  -e ATB_WORKSPACE_MEM_ALLOC_ALG_TYPE=1 \
  -e ATB_OPSRUNNER_KERNEL_CACHE_LOCAL_COUNT=1 \
  -e ATB_OPSRUNNER_KERNEL_CACHE_GLOABL_COUNT=5 \
  -e ATB_COMPARE_TILING_EVERY_KERNEL=0 \
  -e ATB_SHARE_MEMORY_NAME_SUFFIX= \
  -e ATB_MATMUL_SHUFFLE_K_ENABLE=1 \
  -e LANG=C.UTF-8 \
  -e HOME=/root \
  -e PATH=/usr/local/Ascend/nnal/atb/latest/atb/cxx_abi_1/bin:/usr/local/Ascend/ascend-toolkit/latest/bin:/usr/local/Ascend/ascend-toolkit/latest/compiler/ccec_compiler/bin:/usr/local/Ascend/ascend-toolkit/latest/tools/ccec_compiler/bin:/usr/local/Ascend/cann-8.5.0/tools/show_kernel_debug_data:/usr/local/Ascend/cann-8.5.0/tools/msobjdump:/usr/local/Ascend/cann-8.5.0/bin:/usr/local/Ascend/cann-8.5.0/tools/ccec_compiler/bin:/usr/local/Ascend/cann-8.5.0/tools/profiler/bin:/usr/local/Ascend/cann-8.5.0//tools/ascend_system_advisor/asys:/usr/local/python3.11.14/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
  -e LD_LIBRARY_PATH=/usr/local/Ascend/nnal/atb/latest/atb/cxx_abi_1/lib:/usr/local/Ascend/nnal/atb/latest/atb/cxx_abi_1/examples:/usr/local/Ascend/nnal/atb/latest/atb/cxx_abi_1/tests/atbopstest:/usr/local/Ascend/ascend-toolkit/latest/tools/aml/lib64:/usr/local/Ascend/ascend-toolkit/latest/tools/aml/lib64/plugin:/usr/local/Ascend/ascend-toolkit/latest/lib64:/usr/local/Ascend/ascend-toolkit/latest/lib64/plugin/opskernel:/usr/local/Ascend/ascend-toolkit/latest/lib64/plugin/nnengine:/usr/local/Ascend/ascend-toolkit/latest/opp/built-in/op_impl/ai_core/tbe/op_tiling:/usr/local/Ascend/cann-8.5.0/tools/aml/lib64:/usr/local/Ascend/cann-8.5.0/tools/aml/lib64/plugin:/usr/local/Ascend/cann-8.5.0/lib64:/usr/local/Ascend/cann-8.5.0/lib64/plugin/opskernel:/usr/local/Ascend/cann-8.5.0/lib64/plugin/nnengine:/usr/local/Ascend/cann-8.5.0/opp/built-in/op_impl/ai_core/tbe/op_tiling:/usr/local/Ascend/driver/lib64:/usr/local/Ascend/driver/lib64/common/:/usr/local/Ascend/driver/lib64/driver/:/usr/local/python3.11.14/lib: \
  -e PYTHONDONTWRITEBYTECODE=1 \
  -e PYTHONUNBUFFERED=1 \
  -e SGLANG_PLATFORM=sglang_fl \
  -e GEMS_VENDOR=ascend \
  -e SGLANG_EXTERNAL_MODEL_PACKAGE=ocr_sglang_models \
  -e SGLANG_EXTERNAL_MM_PROCESSOR_PACKAGE=ocr_sglang_processors \
  -e BATCH_INVARIANT=0 \
  -e VLLM_BATCH_INVARIANT=0 \
  -e USE_FLAGGEMS=1 \
  -e SGLANG_FL_FLAGOS_BLACKLIST=arange,arange_start,conv1d,convolution,index_put_,_index_put_impl_,conv2d,_convolution_mode,true_divide,floor_divide,_foreach_copy_,fill_scalar_,argmax,linear,mm,addmm \
  -e OMP_NUM_THREADS=8 \
  -e HF_HUB_OFFLINE=1 \
  -e ASCEND_RT_VISIBLE_DEVICES=0 \
  -e TORCH_DEVICE_BACKEND_AUTOLOAD=0 \
  -e ASCEND_HOME_PATH=/usr/local/Ascend/cann-8.5.0 \
  -e ASCEND_AICPU_PATH=/usr/local/Ascend/cann-8.5.0 \
  -e ASCEND_OPP_PATH=/usr/local/Ascend/cann-8.5.0/opp \
  -e ASCEND_TOOLKIT_HOME=/usr/local/Ascend/cann-8.5.0 \
  -e ASCEND_TOOLKIT_LATEST_HOME=/usr/local/Ascend/ascend-toolkit/latest \
  -e ATB_HOME_PATH=/usr/local/Ascend/nnal/atb/latest/atb/cxx_abi_1 \
  -e SGLANG_FLAGGEMS_RECORD=1 \
  -e SGLANG_FLAGGEMS_LOG_PATH=/var/log/minicpm-ocr/flaggems.txt \
  -e SGLANG_FL_DISPATCH_DEBUG=1 \
  -e SGLANG_FL_DISPATCH_LOG=/var/log/minicpm-ocr/dispatch.log \
  -e TRITON_CACHE_DIR=/var/cache/minicpm-ocr/triton \
  -e TORCH_EXTENSIONS_DIR=/var/cache/minicpm-ocr/torch_extensions \
  -e XDG_CACHE_HOME=/var/cache/minicpm-ocr/xdg \
  -e HF_HOME=/var/cache/minicpm-ocr/huggingface \
  minicpm-ocr-flagos \
  /bin/sh \
  -c 'exec /usr/local/python3.11.14/bin/python -u -m sglang.launch_server --model-path /models/merge_rl_mergedp1_7140_hf5_4x --served-model-name minicpm-ocr-1.0 --host 0.0.0.0 --port 18509 --tp 1 --device npu --dtype bfloat16 --context-length 40960 --mem-fraction-static 0.80 --max-running-requests 2 --chunked-prefill-size 40960 --max-prefill-tokens 40960 --attention-backend ascend --trust-remote-code --json-model-override-args '"'"'{"architectures": ["Qwen3_5ForConditionalGeneration"]}'"'"' --skip-server-warmup --page-size 16 --disable-radix-cache --disable-piecewise-cuda-graph --cuda-graph-max-bs 2 > /var/log/minicpm-ocr/server.log 2>&1'
python3 - <<'PY_WAIT'
import json,time,urllib.request
op=urllib.request.build_opener(urllib.request.ProxyHandler({}))
deadline=time.monotonic()+1800
while time.monotonic()<deadline:
    try:
        with op.open('http://127.0.0.1:18509/server_info',timeout=5) as response:
            info=json.load(response)
        if info.get('status')=='ready':
            assert info['served_model_name']=='minicpm-ocr-1.0'
            print('READY: minicpm-v5, TP=1, port=18509')
            break
    except (OSError,ValueError):
        pass
    time.sleep(2)
else:
    raise SystemExit('Startup timed out after 1800 seconds; inspect docker logs and server.log. Do not auto-restart.')
PY_WAIT
```

## Service Invocation
### Invocation Script
```bash
curl --noproxy '*' --fail --silent --show-error --max-time 300 http://127.0.0.1:18509/v1/chat/completions -H 'Content-Type: application/json' --data-binary '{"max_tokens": 256, "mm_processor_kwargs": {"downsample_mode": "4x", "max_slice_nums": 9}, "chat_template_kwargs": {"enable_thinking": false}, "temperature": 0.01, "top_p": 0.001, "top_k": 1, "repetition_penalty": 1.0, "model": "minicpm-ocr-1.0", "messages": [{"role": "user", "content": [{"type": "image_url", "image_url": {"url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAA6CAIAAABXvmwkAAABiElEQVR4nO2Yv4rCQBDGd5ML/isEgySkEB/ANIKtRcCnEEufwEfIO9gFn0AQK6tUeYMIGkFEsAwkgWCRXW6vCHd4OSNr7s674+brdpmZ38wHW+xgxhh6lISHkQD2z2CEkMlkMh6PKaW8OayQfN83DCOtsN1uObPuhlFKLctqNBpv7a7Xa87cJ37f9vv9fD6fTqfH4zHjDWeFXNhqtYqiKAiC3W7ned5mszkcDvydXVfeyJqmZSIrlcpoNLJtu9lsXt67rvtZG3Vdb7VasiwritLpdHq9XrfbrVarCCGMcbHBbtlYrOIN/ZFHDTCAAQxgAAMYwAAGMIABDGAAu6LMj53/A383jDEWBMHlTeb4lbDlcplZ6SwWC85cnGdCupdACFFKkyQJw/B0OjmOM5vN4jjOBA+Hw8Fg0G63ZVkulUqSJCGEyuWyqqrv4vLWCKZpcvabp36/z7uaEEWxXq/XarW0U0mSRFEUBAFj/HE18fwqQgghJEmS8/mcznepXBu/Q7/+nQHsZ2EvWMCqbiaSSioAAAAASUVORK5CYII="}}, {"type": "text", "text": "Text Recognition:"}]}]}'
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
