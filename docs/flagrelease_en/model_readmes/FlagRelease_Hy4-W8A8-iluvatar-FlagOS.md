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
- Released **FlagOS-Iluvatar** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public benchmarks.

# Evaluation Results
## Benchmark Result
| Metrics | Hy4-Nvidia-Origin | Hy4-Iluvatar-FlagOS |
|---|---|---|
| Math-500     | 96.2                           | Evaluating                           |
| GPQA_Diamond | 93.65                          | Evaluating                           |
| mmbench      | 91.2                           | Evaluating                           |
| mmstar       | 79.67                          | Evaluating                           |
Local checks on the same stack:


## Inference Performance (measured)
2 machines × 16 BI-V150 (32 cards), `max_model_len=8192`, `max_num_seqs=8`:

| Config | Concurrency | Aggregate decode tok/s | Single-request latency |
|---|---|---|---|
| **TP8×PP4 + PIECEWISE graph (capture 4)** | 4 | **5.56–5.82** | 19–26 s |
| TP8×PP4 eager (`--enforce-eager`) | 4 | 1.07 | 87–134 s |
| TP8×PP8 eager (4 machines) | 8 | 1.36 | — |

- Graph mode is **5.2–5.4×** eager at 4 concurrent, with byte-identical outputs (md5 equal
  for batch=1 and batch=4, three rounds).
- First request after a cold start can take up to **1040 s** (8 PP workers each compile the
  same kernels). With the pre-warmed `/root/.triton` cache in the image it drops to ~37 s.
  Do not clear `/root/.triton` between runs.

# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (GPU) | Iluvatar BI-V150 32GB ×16 卡/机 ×2 机（32 卡） |
| Driver | CoreX 4.5.0 (`ixsmi`) |
| SDK | CoreX 4.5.0（用户态库从宿主 bind-mount） |
| Operating System | Ubuntu（kernel 5.4 / 5.15，随宿主而异） |
| Interconnect | 100 Gb 以太网，`NCCL_IB_DISABLE=1` 走 TCP |
| Weights storage | 793 GB / 246 shards on shared storage (`/mnt/share/models`) |
| Python (image) | 3.12.11 |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/hy4-1022-iluvatar-bi-v150-gems5.3.4-pluginfl-3e6c2a82-vllm0.24.0-corex4.5.0:20261120-tp8pp4-mm
```

Image content: vLLM `0.24.0+empty`, flag_gems `5.3.4.post1.dev11+gbc6d9426c`,
flaggems_vllm `0.1.0`, FlagTree `0.7.0rc2+iluvatar3.6`, torch `2.10.0+corex.4.5.0`,
plugin-FL `3e6c2a82` (`day0-hy4-testing-3-iluvatar`) at `/opt/hy4-plugin`; the release
images also ship a pre-warmed `/root/.triton` cache (2400+ entries) — do not clear it.

Pin verification inside the container (4 nodes must agree):

```bash
for r in vllm flag_gems flaggems_vllm; do
  /repro/env/bin/python -c "import importlib.metadata as m; print('$r', m.version('$r'))"
done
git -C /opt/hy4-plugin rev-parse HEAD    # 3e6c2a82
```

### Download Open-source Model Weights
The INT8 W8A8 weights are distributed through FlagRelease shared storage
(ModelScope publication pending):

```bash
modelscope download --model FlagRelease/Hy4-W8A8-iluvatar-FlagOS
# ls /mnt/share/models/Hy4-testing-W8A8 | wc -l
```

Weights: `hy_v4_vl` / `HYV4VLForConditionalGeneration`, 246 shards / 122,940 tensors,
`total_size` 793,129,169,524 B. Per-expert layout
(`mlp.experts.<id>.{gate,up,down}_proj.{weight,weight_scale}`, 60,537 `weight_scale`).
No remote code (`auto_map` absent) — the implementation comes entirely from vllm-plugin-FL.

### Start the Container
Both machines run the same container (mount the host CoreX userland, not the image copy —
the image UMD must match the host KMD):

```bash
docker run -d --network host --privileged --ipc=host --shm-size 64g \
  -v /dev:/dev -v /lib/modules:/lib/modules -v /sys:/sys -v /usr/src:/usr/src \
  -v /mnt/share/models:/models -v /mnt/share/hy4-pp8:/work \
  -v /usr/local/corex/lib64/libcuda.so.1:/usr/local/corex/lib64/libcuda.so.1 \
  -v /usr/local/corex/lib64/libixml.so:/usr/local/corex/lib64/libixml.so \
  -v /usr/local/corex/bin/ixsmi:/usr/local/corex/bin/ixsmi \
  -w /repro --name hy4-pp8 \
  harbor.baai.ac.cn/flagrelease-public/hy4-1022-iluvatar-bi-v150-gems5.3.4-pluginfl-3e6c2a82-vllm0.24.0-corex4.5.0:20261120-tp8pp4-mm \
  sleep infinity
docker exec hy4-pp8 python3 -c "import torch; print(torch.cuda.is_available(), torch.cuda.device_count())"
# expected: True 16
```

Container group:

| Role | Host | IP | NIC | PP stage | Cards |
|---|---|---|---|---|---|
| node0 (master) | iluvatar-69 | 10.31.28.69 | `ens1f0` | PP0, PP1 | 16 |
| node1 (headless) | iluvatar-147 | 10.31.28.147 | `ens1f0` | PP2, PP3 | 16 |

### Start the Inference Server
Environment (identical on both nodes; NIC/IP differ per rank):

```bash
export VLLM_USE_V1=1
export PYTHONPATH=/opt/hy4-plugin
export GEMS_VENDOR=iluvatar DNN_VENDOR=iluvatar VLLM_FL_PLATFORM=iluvatar VLLM_PLUGINS=fl
export FLAGTREE_AABS=0
export FLAGGEMS_FLASHMLA_SPARSE_TLE=0
export FLAGGEMS_FLASHMLA_DECODE_TLE=0
export FLAGGEMS_FP8_FP4_MQA_LOGITS_TLE=0
export FLAGGEMS_CHUNK_GATED_DELTA_RULE_TLE=0
export VLLM_WORKER_MULTIPROC_METHOD=spawn
export VLLM_FL_FLAGOS_BLACKLIST=int_mm
export USE_FLAGTUNE=0 VLLM_DISABLE_PYNCCL=1
export NCCL_IB_DISABLE=1
export HF_HUB_OFFLINE=1 TOKENIZERS_PARALLELISM=false OMP_NUM_THREADS=2
export VLLM_ENGINE_READY_TIMEOUT_S=7200
export VLLM_ENGINE_ITERATION_TIMEOUT_S=7200
export VLLM_EXECUTE_MODEL_TIMEOUT_SECONDS=7200

# graph mode: breakable graph + PIECEWISE, capture batch 4
export VLLM_USE_BREAKABLE_CUDAGRAPH=1
export CAP=4
export GRAPH_CFG="{\"mode\":0,\"cudagraph_mode\":\"PIECEWISE\",\"cudagraph_capture_sizes\":[${CAP}],\"cudagraph_num_of_warmups\":1}"
```

Start the headless node first, then the master (nodes must rendezvous within the timeout):

```bash
# node1 (headless)
export NCCL_SOCKET_IFNAME=ens1f0 GLOO_SOCKET_IFNAME=ens1f0 VLLM_HOST_IP=10.31.28.147
vllm serve /models/Hy4-testing-W8A8 --served-model-name hy4 \
  --tensor-parallel-size 8 --pipeline-parallel-size 4 \
  --nnodes 2 --node-rank 1 --headless \
  --master-addr 10.31.28.69 --master-port 29512 \
  --distributed-executor-backend mp \
  --max-model-len 8192 --gpu-memory-utilization 0.90 \
  --max-num-seqs 8 --max-num-batched-tokens 2048 \
  --compilation-config "$GRAPH_CFG" \
  --no-async-scheduling --trust-remote-code \
  --distributed-timeout-seconds 7200 --cpu-distributed-timeout-seconds 7200 \
  --port 8400

# node0 (master), ~20 s later
export NCCL_SOCKET_IFNAME=ens1f0 GLOO_SOCKET_IFNAME=ens1f0 VLLM_HOST_IP=10.31.28.69
vllm serve /models/Hy4-testing-W8A8 --served-model-name hy4 \
  --tensor-parallel-size 8 --pipeline-parallel-size 4 \
  --nnodes 2 --node-rank 0 \
  --master-addr 10.31.28.69 --master-port 29512 \
  --distributed-executor-backend mp \
  --max-model-len 8192 --gpu-memory-utilization 0.90 \
  --max-num-seqs 8 --max-num-batched-tokens 2048 \
  --compilation-config "$GRAPH_CFG" \
  --no-async-scheduling --trust-remote-code \
  --distributed-timeout-seconds 7200 --cpu-distributed-timeout-seconds 7200 \
  --port 8400
```

Helper launchers are in `scripts/` (`launch_tp8pp4_69_147_cap4.sh <0|1>`,
`launch_tp16pp4_69_17_82_135.sh <0..3>` for 4-machine TP16×PP4 32K, plus
`launch_tp8pp8_graph4*.sh` for 4-machine PP8).

Expected startup (~8.5 min):

```
Breakable CUDA graph enabled
GPU KV cache size: 84,992 tokens
Capturing CUDA graphs (mixed prefill-decode, PIECEWISE): 100%|1/1 [00:07]
INFO:     Application startup complete.
```

Verification:

```bash
docker exec hy4-pp8 python3 /work/capital_case.py 8400        # 3/3
docker exec hy4-pp8 python3 /work/capital4md5.py 8400 64 r1   # 4/4, ~5.6 tok/s, md5 stable
```

> ⚠️ Known limitations (2026-11-20):
> - **Only `PIECEWISE` is safe.** `FULL_DECODE_ONLY` freezes `max_ctx` and the grid inside the
>   captured MLA/sparse-indexer region; first token is right, then output degrades into garbage.
> - **Capture batch must be 4, not 8.** With `cudagraph_capture_sizes=[8]`, a single request is
>   padded to batch 8 and receives the batch-8 answer (different md5 from eager batch=1).
> - **Disable FlagGems TLE** (the 4 `FLAGGEMS_*_TLE=0` switches). TLE allocates NVIDIA
>   `nv_mma_shared_layout` shared memory which CoreX does not support; the failure only appears
>   on a real inference request, not at warmup/health-check.
> - vLLM 0.24 spawn workers do not forward most env vars; the switches must be set inside the
>   worker (the release image / plugin branch `day0-hy4-testing-3-iluvatar` handles this).
> - **Keep concurrency low.** Peak memory above ~27 GB triggers GPU faults
>   (XID 22 illegal instruction / XID 24 mmu page fault); 4-concurrent is stable for short
>   prompts, ERQA multi-image workloads needed 2 and `max-model-len=32768`.
> - Autotune is slow and shape-dependent (`fp8_fp4_mqa_logits` grid follows runtime `max_ctx`);
>   the image ships the `FLAGGEMS_MAX_TUNE_CONFIGS=6` truncated candidate list. Tuning DBs differ
>   per host, so near-tie argmax can flip across machines.

## Service Invocation
### Invocation Script (Text)
```bash
curl http://localhost:8400/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "hy4",
    "messages": [{"role": "user", "content": "中国的首都是哪个城市？"}],
    "max_tokens": 64,
    "temperature": 0,
    "chat_template_kwargs": {"reasoning_effort": "no_think"}
  }'
```

Expected: an answer containing `北京`.

### Invocation Script (Image)
```bash
IMAGE_BASE64=$(base64 -w 0 "/mnt/share/example.jpg")

curl http://localhost:8400/v1/chat/completions \
  -H "Content-Type: application/json" \
  --data-binary @- <<EOF
{
  "model": "hy4",
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
The model weights are derived from Hy4 and are open-sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
