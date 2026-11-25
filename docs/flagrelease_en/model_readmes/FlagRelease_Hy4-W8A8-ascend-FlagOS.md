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

- This FlagOS image deploys Hy4 W8A8 across two Ascend 910C hosts, with 16 NPU dies per host. The hosts must share a superpod with HCCS connectivity.
- The OpenAI-compatible API supports text and image inputs. The served model name is `Hy4-preview`, with a configured context length of 139,264 tokens, including input and output.
- The runtime uses attention DP8 × TP4 and MoE EP32, eager prefill, and graph replay for decode. MTP and prefix caching are disabled.
- The default `HY4_PROFILE=safe` keeps iHC fusion enabled and disables the experimental sparse mapper. Keep this profile for general requests. `HY4_PROFILE=historical` remains available for controlled reproduction and has a known B>1 prefill correctness limitation.

### Consistency Validation

Packaging validation checks the pinned source files, dependency imports, SGLang CLI, and launch configurations without mounting the original development repositories. Full model evaluation and performance benchmarks were not rerun for this image publication.

# Evaluation Results
## Benchmark Result

| Metrics | Hy4-Nvidia-Origin | Hy4-Ascend-FlagOS |
|---|---|---|
| Math-500     | 96.2                           | 95.59                                |
| GPQA_Diamond | 93.65                          | 93.16                                |
| mmbench      | 91.2                           | Evaluating                           |
| mmstar       | 79.67                          | Evaluating                           |


# User Guide

## Environment Setup

### Host Environment

| Item | Version / Spec |
|---|---|
| Hardware (NPU) | Two hosts, each with 16 Ascend 910C NPU dies |
| Docker Version | 20.10.8 |
| Operating System | openEuler 22.03 LTS-SP4 (aarch64) |
| Driver | 25.5.0 |
| SDK | CANN 8.5.0 A3 |
| Container OS | Ubuntu 22.04.5 LTS |
| CPython / PyTorch / torch-npu | 3.11.14 / 2.8.0+cpu / 2.8.0.post2 |
| SGLang | 0.5.11, commit `600df8dd498955f5aef4417383ea9ae5d2c238f7` |
| sglang-plugin-FL | 0.1.0, commit `b123baa60be9ad2dedac6736de065017fc81ff41` |
| FlagGems / Triton-Ascend | 0.0.0 (`855774a3ed95e4a4a3460592bef02019ab5f54c9`) / 3.2.0 |
| Communication | HCCL and native expert parallelism over HCCS |

## Operation Steps

### Download FlagOS Image

Run on both hosts:

```bash
docker pull harbor.baai.ac.cn/flagrelease-public/hy4-preview-ascend001-gems0.0.0-treenone-cxnone-pluginnone-vllmnone-sglang0.5.11-sglangfl0.1.0-cp311-ptnpu28-cann85-a64-25.5.0:202611200946
```

### Download Open-source Model Weights

Prepare the same `Hy4-testing-W8A8` checkpoint on both hosts. Weights are mounted at runtime and are not included in the image. Use the checkpoint supplied through your authorized model distribution channel.

```bash
modelscope download --model FlagRelease/Hy4-W8A8-ascend-FlagOS
```

### Start the Container

On each host, set `NODE_RANK` to `0` for the API host or `1` for the worker host. Set `NODE0_ADDR` to the same API host business-network IP on both machines.

```bash
export NODE_RANK=0                  # Use 1 on the worker host.
export NODE0_ADDR='<node-0-business-ip>'
export HY4_PORT="${HY4_PORT:-31998}"
export CONTAINER="hy4-preview-flagos-node$NODE_RANK"
export STATE_DIR="${STATE_DIR:-$PWD/hy4-preview-state-node$NODE_RANK}"
export IMAGE='harbor.baai.ac.cn/flagrelease-public/hy4-preview-ascend001-gems0.0.0-treenone-cxnone-pluginnone-vllmnone-sglang0.5.11-sglangfl0.1.0-cp311-ptnpu28-cann85-a64-25.5.0:202611200946'
export MODEL_DIR="${MODEL_DIR:-/public-flash/models/Hy4-testing-W8A8}"
test -r "$MODEL_DIR/config.json"
test -r "$MODEL_DIR/chat_template.jinja"
```

Run the following on both hosts. The device mappings, privileged mode, host network, and host IPC follow the original two-host deployment.

```bash
set -euo pipefail
mkdir -p "$STATE_DIR/cache"
state=$(cd -- "$STATE_DIR" && pwd)
model=$(cd -- "$MODEL_DIR" && pwd)
npu_smi=$(readlink -f "$(command -v npu-smi)")
devices=(--device /dev/davinci_manager --device /dev/hisi_hdc)
for ((i=0; i<16; i++)); do
  devices+=(--device "/dev/davinci$i")
done

docker run --detach --name "$CONTAINER" \
  --privileged --network host --ipc host --security-opt label=disable \
  "${devices[@]}" \
  --mount type=bind,src=/usr/local/Ascend/driver,dst=/usr/local/Ascend/driver,readonly \
  --mount type=bind,src=/etc/ascend_install.info,dst=/etc/ascend_install.info,readonly \
  --mount "type=bind,src=$npu_smi,dst=/usr/local/bin/npu-smi,readonly" \
  --mount "type=bind,src=$model,dst=/models/Hy4-testing-W8A8,readonly" \
  --mount "type=bind,src=$state/cache,dst=/workspace/hy4/cache" \
  -e "HY4_NODE_RANK=$NODE_RANK" \
  -e "HY4_DIST_INIT_ADDR=$NODE0_ADDR:29690" \
  -e "HY4_PORT=$HY4_PORT" \
  -e HY4_PROFILE=safe \
  -e HCCL_SOCKET_IFNAME=business -e GLOO_SOCKET_IFNAME=business \
  "$IMAGE"
```

Replace `business` with the actual business-network interface if needed. Both hosts must reach the bootstrap port 29690, HCCL ports 62000–62063, and the API port. No development repository mounts are required.

### Start the Inference Server

The image entrypoint starts SGLang automatically. Wait for weight loading and decode graph capture to finish on both hosts.

```bash
docker logs --tail 100 -f "$CONTAINER"
```

On the API host, check readiness:

```bash
curl --noproxy '*' --fail --silent --show-error \
  "http://127.0.0.1:$HY4_PORT/v1/models"
```

The response should contain model ID `Hy4-preview` and `max_model_len: 139264`.

## Service Invocation
### Invocation Script (Text)

Use `http://<node-0-business-ip>:31998/v1` as the client base URL and `Hy4-preview` as the model name. Run this example on the API host:

```bash
curl --noproxy '*' --fail-with-body --silent --show-error --max-time 600 \
  "http://127.0.0.1:$HY4_PORT/v1/chat/completions" \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "model": "Hy4-preview",
    "messages": [{"role": "user", "content": "Briefly introduce yourself."}],
    "temperature": 0.9,
    "top_p": 1,
    "top_k": -1,
    "reasoning_effort": "high",
    "chat_template_kwargs": {"reasoning_effort": "high"},
    "max_tokens": 512,
    "stream": false
  }'
```

### AnythingLLM Integration Guide

#### 1. Download & Install

Visit https://anythingllm.com/ and install the application for your operating system.

#### 2. Configuration

Select an OpenAI-compatible LLM provider, set the base URL to `http://<node-0-business-ip>:31998/v1`, enter model name `Hy4-preview`, and save the configuration.

#### 3. Model Interaction

Create a new conversation and send a short text request. Image input and reasoning display depend on the selected client provider. This performance branch can return reasoning markers inside `message.content`.

# Technical Overview

**FlagOS** is an open-source system software stack for deploying models across different accelerators. This image combines SGLang with sglang-plugin-FL, FlagGems, Triton-Ascend, and HCCL.

## FlagGems

FlagGems supplies the enabled generic operators. This frozen configuration enables the plugin and FlagGems with the validated `ones` whitelist and the `TopK` OOT blacklist.

## FlagTree

FlagTree is the FlagOS compiler project for multiple accelerators. This image uses Triton-Ascend 3.2.0; a separate FlagTree package is not installed.

## FlagScale and vllm-plugin-fl

FlagScale and vllm-plugin-fl are components of the broader FlagOS ecosystem. This image uses SGLang and sglang-plugin-FL rather than a vLLM runtime.

## **FlagCX**

FlagCX is the FlagOS cross-chip communication project. This image uses HCCL and native expert-parallel communication; FlagCX is not installed.

## **FlagEval Evaluation Framework**

FlagEval provides model evaluation tools and services. No new FlagEval evaluation results are included in this image card.

# Contributing

Contributions to the relevant FlagOS repositories are welcome:

1. Report issues with the image reference, checkpoint identifier, launch profile, and sanitized logs.
2. Submit pull requests for code improvements.
3. Improve deployment documentation and examples.

# License

The sglang-plugin-FL adaptation code follows Apache License 2.0. Other software components retain their respective licenses. Model weights are not included; obtain and use them under the checkpoint publisher's terms.
