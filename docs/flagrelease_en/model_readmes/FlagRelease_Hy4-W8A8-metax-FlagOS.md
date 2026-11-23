---
license: apache-2.0
language:
- zh
- en
---

# Introduction
Tencent Hunyuan officially open-sources its multimodal model Hy4. The FlagOS community, building on FlagOS's unified multi-chip software stack, completed Day-0 cross-chip adaptation, covering platforms from 9 chip vendors—Hygon, Kunlunxin, T-Head (Pingtouge), NVIDIA, Huawei Ascend, MetaX, Moore Threads, Tsing Micro, and Iluvatar CoreX—and **provided** a W8A8 version of the model. Drawing on the FlagOS 2.2 software stack together with framework- and operator-level co-optimization tailored to Hy4, in a dual-node, 16-GPU, 64-concurrency test on NVIDIA platforms, the FlagOS version raised output throughput by up to 32.1% and reduced average per-token latency by up to 39.2% compared with NVIDIA's native solution. On domestic platforms such as T-Head, Huawei Ascend, Hygon, and Moore Threads, it also achieved per-unit-compute throughput approaching or exceeding that of NVIDIA's native version in some of the tested scenarios. Backed by the FlagOS technology stack, Hy4 demonstrates competitive inference efficiency across a range of chips, letting industry users flexibly choose deployment options for cutting-edge multimodal large models based on their existing compute and workloads.

Hy4 is a multimodal model released by Tencent Hunyuan for real-world productivity scenarios. Compared with **the Hy4 preview**, the official version scales up both pre-training and post-training, introduces visual understanding and computer operation capabilities for the first time, and further improves instruction following, long-text comprehension, long-horizon task execution, and deep research. The model combines image perception, reasoning, and tool use to handle complex charts, operate professional software, and serve front-end and game development, financial office work, and scientific research tasks. In the evaluations published by Tencent Hunyuan, Hy4's score on Terminal-Bench 4.0 rose from the preview's 26.3 to 44.4, and on AutomationBench v1.0.6 from 36.3 to 56.2.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-MetaX** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | Hy4-Nvidia-Origin | Hy4-MetaX-FlagOS |
|---|---|---|
| Math-500     | 96.2                           | 96                                   |
| GPQA_Diamond | 93.65                          | 92.55                                |
| mmbench      | 91.2                           | Evaluating                           |
| mmstar       | 79.67                          | Evaluating                           |


## Inference Performance (measured)
64 concurrent, 4K input / 1K output, `vllm bench serve` random dataset, TP8×PP4:

| Cudagraph mode | Mean TTFT | P99 TTFT | Output tok/s | Total tok/s | Mean TPOT |
|---|---|---|---|---|---|
| `NONE` (inductor only) | 220.5 s | 539.7 s | 52.31 | 261.56 | 931 ms |
| **`FULL_DECODE_ONLY` (recommended)** | **227.2 s** | **391.1 s** | **80.98** | **404.91** | **568 ms** |

- `FULL_DECODE_ONLY` vs `NONE`: output throughput **+55%**, Mean TPOT **−39%**, total time **−35%**.
- TTFT includes queueing (64 requests injected at once; prefill admits ~2×4K per step at ~900 tok/s).
- Pure decode segment: 158 vs 96 tok/s engine throughput (1.63×).

Long-CoT evaluation profile (`reasoning_effort=high`, 64K context, per-request CoT ≈ 16K tokens):

| Concurrency | Engine Running | Aggregate gen tok/s | Single-request rate |
|---|---|---|---|
| 8 | 8 | 26 tok/s | ~3.3 tok/s |
| 13 | 13 | 42–53 tok/s | ~3.2 tok/s |

# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | MetaX C550 64GB ×8 卡/机 ×4 机（32 卡） |
| Docker Version | 29.1.3 |
| Operating System | Ubuntu 22.04.5 LTS (kernel 5.15.0-119-generic) |
| Driver | 3.8.1 (mx-smi 2.3.1) |
| SDK | MACA 3.8.1.3 |
| Weights storage | 739 GiB / 246 shards on shared NFS (`/public-flash/models`) |
| Interconnect | inbond1 50 GbE (control) + `bnxt_re4` 400 GbE RoCE (data, same fabric) |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/vllm0.24.0-metax-maca3.8.1.3:2.2.0-gems-main
```

Image content: vLLM `0.24.0+flagos`, torch `2.10.0+metax3.8.1.0`, FlagTree/Triton `3.6.0`,
transformers `5.17.0`, ray `2.59.0`; python at `/flagos/bin`, sources editable under `/workspace`.

This deployment pins the three FlagOS components to:

| Component | Branch / commit |
|---|---|
| vllm-plugin-FL | `day0-hy4-1022-metax-full-decode-graph` @ `530e41a` (tree `068114a`) — includes all Hy4-VL/MetaX platform fixes + FULL_DECODE_ONLY selection |
| FlagGems | `master` @ `83f84f7` (tree `413fbd8`) — **one line unchanged** for this model |
| FlagGems-vllm | @ `ffd0029` (tree `40d0d02`) |

> The delivery container is a snapshot of this image (`hy4-1022-rdma:20261028`, rebuilt as
> `hy4-1022-rdma-57:20261110` on node 57) with host RDMA userspace injected — the image itself
> ships no `libibverbs`/`bnxt_re` provider. For the RoCE path, inject `libibverbs.so.1`,
> `libnl-3/route-3`, `libbnxt_re-rdmav34.so` and `/etc/libibverbs.d/bnxt_re.driver` from the
> host (see `RDMA-ENABLEMENT.md`); otherwise set `MCCL_IB_DISABLE=1` to fall back to
> socket over inbond1 (50 GbE, slower).

### Download Open-source Model Weights
The INT8 W8A8 weights are distributed through FlagRelease shared storage
(ModelScope publication pending):

```bash
modelscope download --model FlagRelease/Hy4-W8A8-metax-FlagOS
# ls /public-flash/models/Hy4-testing-W8A8 | wc -l
```

Weights: `hy_v4_vl` / `HYV4VLForConditionalGeneration`, 246 shards / 122,940 tensors,
`total_size` 793,129,169,524 B. Per-expert layout
(`mlp.experts.<id>.{gate,up,down}_proj.{weight,weight_scale}`, 60,537 `weight_scale`).
No remote code (`auto_map` absent) — the implementation comes entirely from vllm-plugin-FL.

> A newer checkpoint `Hy4-testing-3-W8A8-no-MTP` (no MTP, `model.dfly_layers.*` draft tensors,
> nested `text_config`) is also deployed. It needs two loader-side patches —
> skip `model.dfly_layers.*` and filter multimodal keys out of the nested `text_config` —
> which are recorded in `log.md` 轮次 7. With those patches and `max_model_len=65536`,
> GPQA 92.55% / math_500 96.00% were measured; KV cache 851,840 tokens, cold start ~13 min.

### Start the Container
```bash
sudo docker run -dit --privileged \
  --name hy4-1022 \
  --network host --ipc private \
  --shm-size 64g \
  --cap-add CAP_IPC_LOCK --cap-add CAP_SYS_NICE \
  --ulimit memlock=-1 --ulimit stack=67108864 \
  --device /dev/dri --device /dev/mxcd \
  --device /dev/infiniband/uverbs0 --device /dev/infiniband/uverbs1 \
  --device /dev/infiniband/uverbs2 --device /dev/infiniband/uverbs3 \
  --device /dev/infiniband/uverbs4 \
  --device /dev/infiniband/umad0 --device /dev/infiniband/umad1 \
  --device /dev/infiniband/umad2 --device /dev/infiniband/umad3 \
  --device /dev/infiniband/umad4 \
  --device /dev/infiniband/rdma_cm \
  -v /public-flash/models:/models \
  -w /workspace \
  harbor.baai.ac.cn/flagrelease-public/vllm0.24.0-metax-maca3.8.1.3:2.2.0-gems-main \
  sleep infinity
docker exec -it hy4-1022 /bin/bash
```

> ⚠️ Keep the working directory outside `/workspace` for ad-hoc python/vLLM use (`-w /`).
> With editable installs, a cwd of `/workspace` makes `vllm` resolve to a namespace package
> and `from vllm import LLM` fails.

### Start the Inference Server
Deployment is a 4-machine Ray cluster; the helper scripts in this directory
(`ray_start_head.sh`, `ray_start_worker.sh`, `vllm_serve.sh`, `ray_env.sh`) must be present
on the shared NFS path under `/models/day0/hy4-1022`.

```bash
# ---- 4 台：清场 ----
for h in metax-57 metax-58 metax-59 metax-60; do
  ssh $h "sudo -n docker exec hy4-1022 bash -lc '
    tmux kill-session -t vllm-hy4-1022 2>/dev/null
    pkill -9 -f \"vllm serve\"; pkill -9 -f \"VLLM::\"
    /flagos/bin/ray stop --force'"
done

# ---- HEAD（57）：ray head，必须 EAGER=0 + 层切分 ----
ssh metax-57 "sudo -n docker exec hy4-1022 bash -lc '
  cd /models/day0/hy4-1022
  EAGER=0 VLLM_PP_LAYER_PARTITION=17,20,20,21 AUTO_SERVE=0 bash ray_start_head.sh'"

# ---- WORKERS（58/59/60）：三台并发 ----
for h in metax-58 metax-59 metax-60; do
  ssh $h "sudo -n docker exec hy4-1022 bash -lc '
    cd /models/day0/hy4-1022
    EAGER=0 VLLM_PP_LAYER_PARTITION=17,20,20,21 bash ray_start_worker.sh'"
done
# 校验：ray status 应为 4 nodes / 32.0 GPU

# ---- HEAD：起 serve ----
ssh metax-57 "sudo -n docker exec -d hy4-1022 bash -lc '
  cd /models/day0/hy4-1022
  TP_SIZE=8 PP_SIZE=4 VLLM_PP_LAYER_PARTITION=17,20,20,21 \
  EAGER=0 CG_MODE=FULL_DECODE_ONLY VLLM_FL_METAX_ALLOW_FULL_GRAPH=1 \
  REASONING_PARSER=hy_v4 MAX_MODEL_LEN=65536 \
  MAX_NUM_SEQS=64 MAX_NUM_BATCHED_TOKENS=8192 GPU_UTIL=0.85 \
  bash vllm_serve.sh'"
```

Key parameters (`vllm serve` flags assembled by `vllm_serve.sh`):

| Flag | Value | Note |
|---|---|---|
| `--tensor-parallel-size` | 8 | TP must stay intra-machine |
| `--pipeline-parallel-size` | 4 | |
| `--distributed-executor-backend` | ray | 4 nodes |
| `--block-size` | 64 | hy_v4 BF16 paged indexer hard check |
| `--load-format` | hy4_safetensors | plugin-FL expert-sliced loader |
| `--enable-expert-parallel --enable-ep-weight-filter` | on | per-expert checkpoint; avoids reading all 256 experts per rank |
| `--mm-encoder-tp-mode` | data | ViT has 16 heads, TP=32 would fail weight sharding |
| `--disable-custom-all-reduce` | on | PP4 crosses machines |
| `--no-async-scheduling` | on | async + PP decodes every `pp_size` steps (throughput −50%) |
| `--reasoning-parser` | hy_v4 | |
| `--compilation-config` | `{"mode":0,"cudagraph_mode":"FULL_DECODE_ONLY",...}` | **never PIECEWISE** |

Expected startup (4×8 C550, weights on NFS):

```
Capturing CUDA graphs (decode): 100%
GPU KV cache size: 851,840 tokens
Maximum concurrency for 65,536 tokens per request: 13.00x
INFO:     Application startup complete.
```

First start takes **~13 minutes** (739 GiB NFS read ≈ 7 min + inductor compile + graph capture ~1 min);
steady memory is ~46.7 GB/card with `GPU_UTIL=0.85`. Graph capture is 11/11.

> ⚠️ Known limitations (2026-11-20):
> - **`cudagraph_mode` must be `FULL_DECODE_ONLY`.** `PIECEWISE` splits attention/KV-update/
>   collectives out of the graph and re-reads stale buffers — first token is right, the rest of
>   decode is garbage, run-to-run. `VLLM_FL_METAX_ALLOW_FULL_GRAPH=1` is mandatory, otherwise
>   the plugin downgrades FULL to PIECEWISE.
> - `MAX_NUM_SEQS=64` is required (default 32 throttles 64 concurrent to Running 13 / Waiting 51).
> - `GPU_UTIL=0.90` + `MAX_NUM_BATCHED_TOKENS=16384` OOMs at MoE INT8 quantize (needs 1024 MiB);
>   use `0.85` + `8192`.
> - `ASYNC=1` and `TP16×PP2` are measured regressions (TTFT 3.3× / 2.0× slower).
> - Do not set `cudagraph_copy_inputs` (AOT serialization crashes `profile_run`) and do not
>   override `SPLIT_OPS` (attention/kv-update splitting would be lost).
> - In graph mode `temperature=0` completions are not byte-identical across runs; the chat path
>   is 5/5 identical. Use eager mode when strict reproducibility is required.

Eager fallback: `EAGER=1 MAX_MODEL_LEN=32768 bash vllm_serve.sh` (slower decode, byte-identical
outputs, recommended for precision evaluation).

Verification after any config change:

```bash
bash test_inference.sh 8000                                    # 首都测试, all [判定] PASS
/flagos/bin/python ctx_rep_check.py http://127.0.0.1:8000 5 64 # 5/5 identical
# cold-restart ≥3 times and compare one greedy request byte-for-byte
```

## Service Invocation
### Invocation Script (Text)
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "hy4-1022",
    "messages": [{"role": "user", "content": "中国的首都是哪个城市？"}],
    "max_tokens": 64,
    "temperature": 0,
    "chat_template_kwargs": {"reasoning_effort": "no_think"}
  }'
```

Expected: an answer containing `北京`. With `--reasoning-parser hy_v4`, thinking is returned in
`message.reasoning_content` (and streamed as reasoning deltas); `reasoning_effort=no_think`
suppresses it.

### Invocation Script (Image)
```bash
IMAGE_BASE64=$(base64 -w 0 "/public-flash/example.jpg")

curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  --data-binary @- <<EOF
{
  "model": "hy4-1022",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "请描述这张图片中的内容。"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,${IMAGE_BASE64}"
          }
        }
      ]
    }
  ],
  "max_tokens": 256
}
EOF
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
The model weights are derived from HY/HY4-1022 and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
