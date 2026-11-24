---
license: apache-2.0
language:
- zh
- en
---

# Introduction
Xing4.1-Preview is an MoE model from the Xingchen Semantic Large Model family designed for agent programming and long-horizon complex tasks. It has a total parameter count of 285B with approximately 17B parameters activated per token and natively supports a 1M context window. Adopting MLA for compressed KV representation and DSA sparse attention, the model uses a 45-layer Transformer backbone, 42 of which are MoE layers. For each token, it selects 8 experts out of 256 routed experts together with 1 shared expert. For practical applications, it supports thinking mode switching, tool calling and structured output, and can be applied to multi-step office workflows, in-depth research, code generation and document-intensive business scenarios. The Xing 4 series was trained on fully domestic computing platforms, and this FlagOS adaptation further broadens the inference deployment options for Xing4.1-Preview.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Iluvatar** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | Xing4.1-Preview-W8A8-Nvidia-Origin | Xing4.1-Preview-W8A8-Iluvatar-FlagOS |
|---|---|---|
| Math-500     | 95.20                              | 94.39                                |
| GPQA_Diamond | 89.8                               | Evaluating                           |
> FlagEval evaluation (GPQA-Diamond / MATH-500) was submitted through the Auto-Evaluation
> platform on 2026-11-20 (`eval_model=xing4.1-preview-tianshu-20261120-2355`,
> `request_id=3c7b33d8-6bbd-4dc4-9cde-fe97834408e1`, `batch_id=30680`, region `tianshu`).
> The batch ended with status `C` (cancelled) at `0/0` datasets — no samples were ever
> served, so there are no numbers yet. Re-submission is pending.

## Inference Performance (measured)
4k input / 1k output, `vllm bench serve` (2 warmup rounds + 1 measured, `--ignore-eos`,
fixed concurrency 64, `--max-model-len 66560`, `max-num-seqs 64`):

| Config | Output tok/s | Total tok/s | Mean TTFT | Mean TPOT |
|---|---|---|---|---|
| TP16 graph (PIECEWISE cap=8), 64 concurrent | 25.36 | 129.25 | 823.6 s | 1173.1 ms |

- 64/64 requests succeeded, 0 failed; peak output 82 tok/s.
- KV cache holds 172,736 tokens, so with 4k inputs only ~41 requests run at once and the
  rest queue — TTFT/E2EL therefore include queueing time.
- 16k / 32k points not measured yet.

# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | Iluvatar BI-V150 32GB ×16 (single node) |
| Operating System | Ubuntu 22.04 (kernel 5.4.0-148-generic) |
| Driver | CoreX **4.5.0** — must be the build with kmd `iluvatar.ko` sha256 `6fed4040…` and umd `libcuda.so.1` sha256 `492a8447…` |
| Host memory | ≥ 512 GB |
| Disk | ≥ 300 GB for weights (263 GB, 276 files) |

> ⚠️ The version string `4.5.0` alone is **not** a usable identifier: several different
> builds share it. The `4.5.0.20260509` build does **not** support CUDA Graph capture
> (`torch.cuda.CUDAGraph().capture_begin` → `ixErrorNotSupported`) and can only run eager.
> Verify with `sha256sum /lib/modules/$(uname -r)/updates/dkms/iluvatar.ko` and
> `sha256sum /usr/local/corex/lib64/libcuda.so.1`. See `CUDA_GRAPH_NOT_SUPPORTED.md`
> for the minimal reproduction and the kmd+umd rollback procedure.

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/hy4-flash-iluvatar-bi-v150-gems5.3.4-pluginfl-27cc489-vllm0.32.0-corex4.5.0:xing4.1-285b-iluvatar-20261120-graph
```

Image content: vLLM `0.32.0+empty`, vllm-plugin-FL `xing4.1-285b-iluvatar` (`2e2b160`,
base `27cc489`), FlagGems `bc6d942`, FlagGems-vllm `011ea56`; sources are pre-installed
editable under `/workspace`, and the Triton kernel cache from eager + graph validation is
baked in (200 MB). No SSH keys or docker credentials are baked in.

### Download Open-source Model Weights
The INT8 W8A8 weights are distributed through FlagRelease shared storage:

```bash
modelscope download --model FlagRelease/Xing4.1-Preview-W8A8-iluvatar-FlagOS
#ls /mnt/share/models/Xing4.1-Preview-RL-1114-W8A8-FlagOS-20261119-172125 | wc -l
```

Weights: 45 layers / hidden 4096 / 256 experts top-8 / vocab 131072 / MLA
(`kv_lora_rank=512`) / DSA (`index_topk=2048`) / no-MTP, `model_type=deepseek_v32`.

### Start the Container
```bash
docker run -dit --privileged \
  --name xing4.1-285b \
  --network host \
  --ipc host \
  --shm-size 64g \
  -v /dev:/dev -v /sys:/sys -v /lib/modules:/lib/modules -v /usr/src:/usr/src \
  -v /mnt/share/models:/models \
  -v /mnt/share/xing4.1-285b:/work \
  -v /usr/local/corex-4.5.0/lib64/libcuda.so.1:/usr/local/corex/lib64/libcuda.so.1 \
  -v /usr/local/corex-4.5.0/lib64/libixml.so:/usr/local/corex/lib64/libixml.so \
  -v /usr/local/corex-4.5.0/bin/ixsmi:/usr/local/corex/bin/ixsmi \
  -w / \
  harbor.baai.ac.cn/flagrelease-public/hy4-flash-iluvatar-bi-v150-gems5.3.4-pluginfl-27cc489-vllm0.32.0-corex4.5.0:xing4.1-285b-iluvatar-20261120-graph \
  sleep infinity
docker exec -it xing4.1-285b /bin/bash
```

> ⚠️ Keep the working directory outside `/workspace` (`-w /`). With editable installs,
> a cwd of `/workspace` makes `vllm` resolve to a namespace package.
> The host CoreX userspace must be bind-mounted (this driver build ships only
> `libcuda.so.1` + `libixml.so`, no `libixthunk.so`); otherwise
> `torch.cuda.is_available()` is False and the `fl` platform plugin fails to load.

### Start the Inference Server
Graph mode (recommended, validated):
```bash
ENFORCE_EAGER=0 CAPTURE_SIZES=8 CUDAGRAPH_MODE=PIECEWISE \
EXTRA_ARGS="--kernel_config.enable_jit_warmup=False" \
  bash /work/vllm_serve.sh
```

Eager mode (conservative fallback):
```bash
bash /work/vllm_serve.sh
```

Equivalent manual command (inside the container, `cd /` first):
```bash
cd /

export PYTHONPATH=/workspace/vllm-plugin-FL   # 覆盖镜像自带的 /repro/fp8-plugin-source 旧树
export GEMS_VENDOR=iluvatar
export VLLM_PLUGINS=fl
export VLLM_WORKER_MULTIPROC_METHOD=spawn
export VLLM_FL_FLAGOS_BLACKLIST=sort,sort_stable
export VLLM_ENGINE_ITERATION_TIMEOUT_S=72000
export VLLM_RPC_TIMEOUT=72000000
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=7200
export VLLM_NO_USAGE_STATS=1
export TRITON_CACHE_DIR=/tmp/triton-cache
export TORCHINDUCTOR_CACHE_DIR=/tmp/inductor-cache

/repro/env/bin/vllm serve /models/Xing4.1-Preview-RL-1114-W8A8-FlagOS-20261119-172125 \
    --served-model-name xing4.1 \
    --host 0.0.0.0 --port 8077 \
    --tensor-parallel-size 16 --pipeline-parallel-size 1 \
    --distributed-executor-backend mp --dtype bfloat16 \
    --gpu-memory-utilization 0.90 --max-model-len 32768 \
    --block-size 64 --kv-cache-dtype auto \
    --max-num-seqs 8 --max-num-batched-tokens 4096 \
    --enable-expert-parallel --no-enable-prefix-caching --trust-remote-code \
    --chat-template /models/Xing4.1-Preview-RL-1114-W8A8-FlagOS-20261119-172125/chat_template.jinja \
    --no-async-scheduling --enforce-eager \
    --kernel_config.enable_jit_warmup=False
```

For graph mode drop `--enforce-eager` and add
`--cudagraph-capture-sizes 8 -cc.cudagraph_mode=PIECEWISE`.
For benchmarking add `--max-model-len 66560 --max-num-seqs 64`.

Expected startup (16×BI-V150, weights on NFS, page cache warm):

```
eager:  GPU KV cache size: 175,680 tokens   (32K → 5.36x)   startup ≈ 9m47s
graph:  GPU KV cache size: 175,040 tokens   (32K → 5.34x)   startup ≈ 5m58s
        Capturing CUDA graphs (PIECEWISE): 1/1 [1.81s]
INFO:     Application startup complete.
```

Weights are 18.02 GiB/rank and load in 60–72 s once the 263 GB checkpoint is in page cache;
steady memory is ~29.8 GB/32 GB. **The first request is slow** — FlagGems autotunes per
shape (≈7900 configurations); the image ships a pre-warmed Triton cache to avoid most of it.

> ⚠️ Known limitations (2026-11-20):
> - Graph mode requires the CoreX driver build described above. With the
>   `20260509` build, capture fails outright; eager remains the only option.
> - `--kernel_config.enable_jit_warmup=False` is mandatory in graph mode: the mock-tensor
>   warmup path fails with `cannot cast int32[64,64] to fp8e4nv` on Iluvatar Triton.
> - 8×32 GB = 256 GB < 263 GB, so **16 cards are required**; there is no TP8 layout.
> - `--block-size 64` is a hard DSA contract; PP=1 only; no speculative decoding.
> - Chunked prefill routes `gather_and_maybe_dequant_cache` through a pure-PyTorch
>   fallback, which is correct but slow. Keep `max_num_batched_tokens` above the longest
>   prompt to avoid it in latency-sensitive deployments.

## Service Invocation
### Invocation Script (Text)
```bash
curl http://localhost:8077/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "xing4.1",
    "messages": [{"role": "user", "content": "中国的首都是哪个城市？"}],
    "max_tokens": 64,
    "temperature": 0
  }'
```

Expected: an answer containing `北京` (validated on both eager and graph).

### Invocation Script (Long Context)
```bash
# > index_topk (2048) triggers DSA sparse selection
python /work/long_context_test.py 8077        # needle 7391, ~2400 prompt tokens
python /work/long_context_test.py 8077 6000   # ~4200 prompt tokens, also exercises chunked prefill
```

Expected: the model answers `7391` (validated, both cases `finish_reason=stop`).

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
FlagGems is a high-performance, generic operator library implemented in [Triton](https://github.com/openai/triton) language. It is built on a collection of backend-neutral kernels that aims to accelerate LLM (Large-Language Models) training and inference across diverse hardware platforms.
## FlagTree
FlagTree is an open source, unified compiler for multiple AI chips project dedicated to developing a diverse ecosystem of AI chip compilers and related tooling platforms, thereby fostering and strengthening the upstream and downstream Triton ecosystem. Currently in its initial phase, the project aims to maintain compatibility with existing adaptation solutions while unifying the codebase to rapidly implement single-repository multi-backend support. For upstream model users, it provides unified compilation capabilities across multiple backends; for downstream chip manufacturers, it offers examples of Triton ecosystem integration.
## FlagScale and vllm-plugin-fl
Flagscale is a comprehensive toolkit designed to support the entire lifecycle of large models. It builds on the strengths of several prominent open-source projects, including [Megatron-LM](https://github.com/NVIDIA/Megatron-LM) and [vLLM](https://github.com/vllm-project/vllm), to provide a robust, end-to-end solution for managing and scaling large models.
vllm-plugin-fl is a vLLM plugin built on the FlagOS unified multi-chip backend, to help flagscale support multi-chip on vllm framework.
## **FlagCX**
FlagCX is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.

## **FlagEval Evaluation Framework**
 FlagEval is a comprehensive evaluation system and open platform for large models launched in 2023. It aims to establish scientific, fair, and open benchmarks, methodologies, and tools to help researchers assess model and training algorithm performance. It features:
 - **Multi-dimensional Evaluation**: Supports 800+ model evaluations across NLP, CV, Audio, and Multimodal fields, covering 20+ downstream tasks including language understanding and image-text generation.
 - **Industry-Grade Use Cases**: Has completed horizontal evaluations of mainstream large models, providing authoritative benchmarks for chip-model performance validation.

# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support

# License
The model weights are derived from Xing4.1-Preview and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
