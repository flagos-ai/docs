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
- Released **FlagOS-PPU** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.
- This release: text smoke tests (capital / sampling / concurrency / long-context DSA
  recall) plus 4k/16k/32k × 64-concurrent throughput on 8×PPU 810E.

# Evaluation Results
## Benchmark Result
| Metrics | Xing4.1-Preview-W8A8-Nvidia-Origin | Xing4.1-Preview-W8A8-Zhenwu-FlagOS |
|---|---|---|
| Math-500     | 95.20                              | 95.40                                |
| GPQA_Diamond | 89.8                               | 85.30                                |
# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (PPU) | T-Head Zhenwu **PPU-ZW810E 96GB ×8**（单机） |
| Host OS | Alibaba Cloud Linux 3 (Soaring Falcon) |
| Container OS | Ubuntu 24.04.2 LTS |
| Driver | `2.1.1-rbd225`（`ppu-smi 1.28`） |
| SDK | PPU SDK `202610070948` |
| PyTorch | `2.13.0` |
| Host memory | ≥ 2 TB |
| Disk | ≥ 300 GB for weights (263 GB, 276 files) |
| Weights storage | CPFS (`/mnt/cpfs/baai-ea/flagos/models`) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/285b-zhenwu810e-c147:xing4.1-285b-w8a8-ppu-20261120
```

Image content / component commits:

| Component | Version in image | Source branch / commit |
|---|---|---|
| vLLM | `0.24.0+empty` | — |
| vllm-plugin-FL | `0.3.0.dev0+gcd3cca8767e5.ppu285b` | `flagos-day0/vllm-plugin-FL` **`day0-xing4.1-285b-ppu`** @ **`cb7146c3`** |
| FlagGems | `5.5.0.dev0+ga4ca511d137d.ppu285b` | `tonyh168/FlagGems` `day0-xing4.1-285b-ppu` @ `4b24d213f` |
| FlagGems-vllm | `0.3.0.dev1+g1c2bea1e0136.ppu285b` | `tonyh168/FlagGems-vllm` `day0-xing4.1-285b-ppu` @ `ea835752` |
| FlagTree | `0.7.0+ppu3.6` | — |

The image bakes `/opt/day0/xing4.1-285b/{launch.sh,launch_graph.sh,test_inference.sh}`
with `WORKDIR=/`. No SSH keys or docker credentials are included.

> `cb7146c3` is 8 files, +342/−14. Only `models/deepseek_v32/runtime.py` is a new
> platform change (+69: DSA plan accepts INT8 W8A8, explicit sunrise INT8 routing on
> PPU 810E, restore native Triton INT8 GEMM); the other seven files are the wheel
> snapshot re-synced (`native head16 sparse MLA`, `compact indexer`, TP-sharded prefill,
> prefill up-silu). FlagGems / FlagGems-vllm are reused unchanged from the tele-285B
> branches.

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Xing4.1-Preview-W8A8-zhenwu-FlagOS
# ls /mnt/cpfs/baai-ea/flagos/models/Xing4.1-Preview-RL-1114-W8A8-FlagOS-20261119-172125 | wc -l

```
### Start the Container
```bash
sudo docker run -dit --name xing4.1-285b-ppu \
  --network=host --shm-size=32g --ulimit memlock=-1 \
  --device=/dev/alixpu --device=/dev/alixpu_ctl --device=/dev/alixpu_sep \
  --device=/dev/alixpu-caps/alixpu-cap1 --device=/dev/alixpu-caps/alixpu-cap2 \
  --device=/dev/alixpu-caps-imex-channels/channel0 \
  --device=/dev/alixpu_ppu0 --device=/dev/alixpu_ppu1 \
  --device=/dev/alixpu_ppu2 --device=/dev/alixpu_ppu3 \
  --device=/dev/alixpu_ppu4 --device=/dev/alixpu_ppu5 \
  --device=/dev/alixpu_ppu6 --device=/dev/alixpu_ppu7 \
  -v /mnt/cpfs/baai-ea/flagos/models/Xing4.1-Preview-RL-1114-W8A8-FlagOS-20261119-172125:/models/xing4.1:ro \
  harbor.baai.ac.cn/flagrelease-public/285b-zhenwu810e-c147:xing4.1-285b-w8a8-ppu-20261120

docker exec -it xing4.1-285b-ppu /bin/bash
```

> ⚠️ The container has no tmux; start the server with `docker exec -d ... > log 2>&1`
> so it survives session exit. Physical cards 0–7 map to container
> `CUDA_VISIBLE_DEVICES=0..7`. Weights are mounted read-only.

### Start the Inference Server
```bash
# eager (default, validated)
docker exec -d xing4.1-285b-ppu bash -lc \
  'bash /opt/day0/xing4.1-285b/launch.sh > /tmp/serve.log 2>&1'

# PIECEWISE graph (non-eager, used for the perf numbers below)
docker exec -d xing4.1-285b-ppu bash -lc \
  'TP=8 MAX_MODEL_LEN=33768 MAX_NUM_SEQS=64 bash /opt/day0/xing4.1-285b/launch_graph.sh > /tmp/serve.log 2>&1'
```

Key parameters:

| Flag / env | Value | Note |
|---|---|---|
| `--tensor-parallel-size` | 8 | TP4 also deployable |
| `--pipeline-parallel-size` | 1 | |
| `--block-size` | 64 | DSA contract hard requirement |
| `--max-model-len` | 32768 (eager) / 33768 (perf) | `= 最大输入 + 1000` per benchmark SOP |
| `--gpu-memory-utilization` | 0.92 | ~92–93 GB/card steady |
| `--max-num-seqs` | 8 (eager) / 64 (graph) | DSA plan caps eager ≤32, PIECEWISE ≤48 unless 64 is captured |
| `--no-enable-prefix-caching` | on | |
| `--disable-custom-all-reduce` | on | |
| `VLLM_FL_DEEPSEEK_V32_PPU_BF16=1` | on | activates the PPU DSA plan |
| `VLLM_FL_PPU_BF16_PIECEWISE_GRAPH` | `0` eager / `1` graph | |
| `VLLM_FL_FLAGOS_BLACKLIST_APPEND` | `…,w8a8_dynamic_per_token_linear` | INT8 GEMM uses vLLM's Triton kernel |

Expected startup (8×PPU-ZW810E, weights on CPFS, 261 shards):

```
INFO:     Application startup complete.
GPU KV cache size: 893,376 tokens
Maximum concurrency for 32,768 tokens per request: 27.26x
```

Weight loading takes ~20 s with a warm page cache; startup to ready ~4 minutes
(4 m 05 s measured). Graph mode with `max_model_len=33768` gives 887,369 KV tokens /
26.28x and captures 9 sizes (1/2/4/8/16/24/32/48/64).

> ⚠️ Known platform deltas (all patched in the image, see `patches/`):
> - The PPU DSA activation plan originally accepted unquantized checkpoints only; it
>   now accepts compressed-tensors INT8 W8A8 (the indexer itself stays BF16).
> - The plugin's sunrise INT8 routing is gated on `device_type == "ptpu"`, but PPU 810E
>   reports `cuda` (vendor `thead`), so the routing is installed from the DSA plan
>   instead. Without it `_C::dynamic_scaled_int8_quant` has no CUDA kernel and
>   `process_weights_after_loading` crashes while dequantizing `kv_b_proj`.
> - PPU FlagGems `scaled_mm` only implements FP8: `FLW8A8DynamicLinearKernel` fails with
>   `mat1 and mat2 must be Float8 matrices`, and leaving the sunrise override in place
>   makes every INT8 GEMM throw-and-fallback (26,280 warnings measured). Fix:
>   blacklist `w8a8_dynamic_per_token_linear` and restore vLLM's native
>   `triton_scaled_mm`.
> - `launch_graph.sh` builds `--compilation-config` with an explicit `if [ -z ... ]`
>   assignment; writing `${GRAPH_CONFIG:-{...}}` makes bash truncate the JSON at the
>   first `}` inside `pass_config`.
> - Only `pkill -f "vllm serve"` leaves `VLLM::EngineCore` / `VLLM::Worker` holding the
>   cards; use `stop_server.sh`, which cleans all of them.

## TP 选择（2026-11-20 实测）

| TP | 每卡权重 | 占 96 GB | 状态 |
|---|---|---|---|
| 8 | 37.2 GB | 38.7% | ✅ 推荐；KV 893,376 tokens @32K（27.26x） |
| 4 | 72.1 GB | 75.1% | ✅ 可部署；KV 324,928 tokens @8K（39.66x）；显存 ~92 GB/卡 |
| 2 | 141.9 GB | 147.8% | ❌ 单卡放不下 |

- TP4 同时验证了 **eager** 与 **PIECEWISE（非 eager）** 两种模式，首都测试均 3/3 PASS。
- TP4 下 PPU DSA 的 TP-sharded prefill 优化不生效（硬编码 `world_size==8`），
  会退回普通 top-k，正确性不受影响。
- TP4 跑 64 并发长上下文会受显存限制：8K 下 `64×8192=524k > 325k`，
  需要按输入长度下调 `max_model_len`。

## Service Invocation
### Invocation Script (Text)
```bash
curl http://localhost:18285/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "xing4.1",
    "chat_template_kwargs": {"enable_thinking": false},
    "messages": [{"role": "user", "content": "中国的首都是哪个城市？只回答城市名。"}],
    "max_tokens": 64,
    "temperature": 0
  }'
```

Expected: an answer containing `北京`.

> The checkpoint defaults to thinking mode. Without
> `chat_template_kwargs.enable_thinking=false`, a 64-token request only emits reasoning
> (`finish_reason=length`); this is model behavior, not a server fault.

### Smoke Test Script
```bash
bash /opt/day0/xing4.1-285b/test_inference.sh 18285
# ---- 首都-中文 ---- '北京'    PASS
# ---- 首都-英文 ---- 'Beijing' PASS
# ---- 算术 ----      '391'     PASS
# ==== overall: PASS ====
```

### AnythingLLM Integration Guide

#### 1. Download & Install

- Visit the official site: https://anythingllm.com/
- Choose the appropriate version for your OS (Windows/macOS/Linux)
- Follow the installation wizard to complete the setup

#### 2. Configuration

- Launch AnythingLLM
- Open settings (bottom left, fourth tab)
- Configure core LLM parameters: base URL `http://<host>:18285/v1`, model `xing4.1`
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
