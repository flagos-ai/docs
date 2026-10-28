---
license: apache-2.0
language:
- zh
- en
---

# Introduction
ModelBest, together with OpenBMB, has open-sourced the MiniCPM-OCR series for document parsing and text recognition, comprising two models: MiniCPM-OCR 1.0 (1.3B) and MiniCPM-OCR Jev (2B). Built on a unified multi-chip software stack, the FlagOS community provides Day-0 cross-chip adaptation for both models, covering 12 platforms in total: T-Head, NVIDIA, Huawei Ascend, Hygon, KUNLUNXIN, MetaX, Moore Threads, Tsingmicro, Iluvatar CoreX, Xiwang, Mac (ARM), and CIX. In this round of evaluation, the FlagOS build of Jev reached 98.7% of NVIDIA native compute throughput, while on the same platform OCR 1.0 delivered up to 1.69× native P50 throughput per unit of peak compute. On ARM edge devices, Jev completes a page-block assessment in an average of 1.20 seconds using the M5 CPU alone. Backed by FlagOS support for both multi-chip servers and ARM terminals, industry users can pick a document parsing and quality-inspection deployment that matches their business requirements and existing compute resources.

MiniCPM-OCR 1.0 targets real-world document scenarios — scans, photos, curved pages, and re-photographed screens — with support for text, formula, and complex table parsing as well as key information extraction. In official evaluations, this lightweight 1.3B-parameter model scored 93.68 on Real5-OmniDocBench, and with DSpark decoding acceleration its end-to-end processing efficiency improved by 55%. To address the problem that parsed output still needs manual verification, the 2B-parameter MiniCPM-OCR Jev acts as an "AI quality inspector" for documents: it scores the reliability of parsing results and can be plugged into different OCR models to help flag content that requires human review. Its overall AUROC on JevOCRBench reaches 0.936, close to the 0.938 of Qwen3.5-397B-A17B.


# Jev Qwen3.5 2B BF16 Value Head — FlagOS Arm CPU

This package scores the consistency of an original image, its OCR candidate text, and a separately rendered image. It is a two-class value-head model, not an OCR text generator.

## Model and precision contract

| Item | Value |
|---|---|
| Architecture | Qwen3_5ForSequenceClassification |
| Checkpoint | qwen35_2b_l2_triple_value_checkpoint-3000 |
| Parameters | 2,213,245,760 tensor elements; approximately 2.21B including vision and score head |
| Text backbone | Qwen3.5 text, 24 layers, hidden size 2048 |
| Model/vision weights | Original BF16; unquantized |
| Value head | BF16 score.weight [2,2048], no bias; no LM head |
| Inference engine | vLLM 0.24.0+cpu + vLLM-Plugin-FL + FlagGems |
| Pooling/output | LAST non-padding token; two logits; FP32 softmax gives P(consistent) |
| Default threshold | 0.5606135129928589; label 1 means consistent |
| Qualified context | 1024 input tokens, two images, one sequence; no autoregressive decoding |

BF16 values may be widened to FP32 for accumulation or prepared compute storage. The package does not quantize the model or its head during loading. Keep each checkpoint’s complete configuration, tokenizer and processor files together. The two model directories and processors are not interchangeable.

## Runtime and validation status

Both model-specific guides have passed their marked deployment steps on M5 Pro and CIX P1 using these release assets.

The Mac path is native CPU inference on M5 Pro (Mac17,9), macOS 27.0 arm64, 64 GiB RAM. The Linux path is a Docker container on CIX P1 aarch64, 32 GiB RAM, restricted to eight Cortex-A720 cores. No GPU, Metal execution or privileged container is used. Reserve about 25 GiB free disk for an offline installation including archives and Docker import temporary space.

| Component | Mac | CIX P1 |
|---|---|---|
| Python | 3.11.9, bundled | 3.11.2, bundled |
| PyTorch | 2.11.0, CPU execution | 2.11.0+cpu |
| vLLM | 0.24.0+cpu | 0.24.0+cpu |
| FlagTree-CPU / Triton CPU | 3.7.2, binary locked | 3.7.2, binary locked |
| FlagGems release snapshot | `4c3eb98ad9b56030d901b2e42c61d7d32c7cfd1b` | Same source snapshot |
| vLLM-Plugin-FL release snapshot | `1668b09f0eb01caea6e1ebb653783bb22fa3b8c0` | Same source snapshot |
| OCR-only dependencies | Transformers fork 5.19.0.dev0, huggingface_hub 2.3.0, tokenizers 0.23.3, accelerate 1.15.0 | Same versions, Linux wheels |

These are local release snapshot commits, not a claim that the changes are already merged or published upstream. The FlagGems base is `19368532818fee379290ffdfbe371f7edae94859`; the plugin base is `5ac7003ca4dfbfa062b298a55ecb93e0bfe599a6`. Full compiler/binary hashes and source identities are in `share/flagos-ocr-jev/runtime-manifest.json`. The image-name `tree_3.7.2_sha...` field identifies the compiler binary SHA256 prefix. The `gems_...` and `plugin_...` fields are actual Git snapshot commit prefixes.

The Mac profile uses 18 framework threads and 8 SME GEMM workers, with FlagGems BF16 SME/TLE Raw linears, Triton vision attention and the GDN CPU integration. P1 uses eight framework threads, native oneDNN/ACL unquantized linears and FlagGems vision/GDN routes. The small BF16 score head retains its unquantized execution route; a native backend may privately prepack it.

TLE Raw is a compiled Triton CPU entry calling the packaged native leaf; it does not mean the C++ arithmetic has disappeared. Users do not separately build FlagGems, FlagTree-CPU or an external operator library. First-use JIT/linking still occurs.

## Release files

The runtime and Docker image do not contain weights. Obtain the following local release files from the release owner and place them under `$HOME/Downloads/FlagOS-OCR-Jev-BF16`. No unverified public ModelScope URL is assumed.

- `Jev-Qwen3.5-2B-BF16-Score-20261026.tar.gz` and its `.sha256` sidecar: unchanged BF16 model files.
- Mac: `flagos-ocr-jev-bf16-macos-arm64-20261026.tar.gz` and its `.sha256` sidecar.
- P1: `flagos-ocr-jev-bf16-cix-p1-20261026.docker.tar.gz` and its `.sha256` sidecar.
- Optional audit material: `flagos-ocr-jev-bf16-source-20261026.tar.gz`. It contains the component source snapshots, app/build code and reference measurements. It does not claim to rebuild CPython, PyTorch or LLVM from scratch.

The Docker archive contains the two model-specific images and their qualified base for offline rebuilds. Run only the model image below: one container owns the inference engine and HTTP endpoint; there is no development container to enter. The Harbor-style tags are local names at this stage. Registry push has not been performed; use `docker load`, not `docker pull`, for these assets.

## Step 1 — Set up the shell

<!-- run:common -->
```sh
export ASSET_DIR="$HOME/Downloads/FlagOS-OCR-Jev-BF16"
export MODEL_ASSET='Jev-Qwen3.5-2B-BF16-Score-20261026.tar.gz'
export MODEL_DIR="$HOME/Models/Jev-Qwen3.5-2B-BF16-Score"
export RUN_DIR="$HOME/flagos-runs/jev-bf16-$(date +%Y%m%d-%H%M%S)"
export API_BASE='http://127.0.0.1:18551'
mkdir -p "$RUN_DIR/artifacts"
test -f "$ASSET_DIR/$MODEL_ASSET"
```

Follow only step 2 for your platform, then return to the common steps.

## Step 2A — Mac: install the native Runtime

Apple Command Line Tools are needed for JIT linking (`xcode-select --install` if absent). No host Python package installation or sudo is required.

<!-- run:mac -->
```sh
test "$(uname -m)" = arm64
test "$(sysctl -n hw.model)" = Mac17,9
xcrun --find clang
(cd "$ASSET_DIR" && shasum -a 256 -c flagos-ocr-jev-bf16-macos-arm64-20261026.tar.gz.sha256)
(cd "$ASSET_DIR" && shasum -a 256 -c "$MODEL_ASSET.sha256")
mkdir -p "$HOME/Library/FlagOS"
export RT="$HOME/Library/FlagOS/flagos-ocr-jev-bf16-macos-arm64-20261026"
if [ ! -d "$RT" ]; then
  tar -xzf "$ASSET_DIR/flagos-ocr-jev-bf16-macos-arm64-20261026.tar.gz" -C "$HOME/Library/FlagOS"
fi
(cd "$RT" && shasum -a 256 -c RUNTIME-SHA256SUMS > "$RUN_DIR/artifacts/runtime-checksums.log")
"$RT/bin/flagos-jev" info > "$RUN_DIR/artifacts/runtime-info.json"
```

## Step 2B — CIX P1: load and identify the image

Requires Docker and host Python 3 for the standard-library HTTP client example. Verify core numbering before using the tested affinity: A720 CPUs `0,1,6,7,8,9,10,11`; A520 CPUs `2,3,4,5` are excluded. These IDs are board-specific.

<!-- run:linux -->
```sh
test "$(uname -m)" = aarch64
lscpu -e=CPU,CORE,ONLINE,MAXMHZ
(cd "$ASSET_DIR" && sha256sum -c flagos-ocr-jev-bf16-cix-p1-20261026.docker.tar.gz.sha256)
(cd "$ASSET_DIR" && sha256sum -c "$MODEL_ASSET.sha256")
sudo docker load --input "$ASSET_DIR/flagos-ocr-jev-bf16-cix-p1-20261026.docker.tar.gz"
export CIX_IMAGE='harbor.baai.ac.cn/flagrelease-public/flagrelease-jev-2b-bf16-arm-tree_3.7.2_sha53f8b4608d70-gems_4c3eb98ad9b5-vllm_0.24.0_cpu-plugin_1668b09f0eb0-cx_none-python_3.11.2-torch_2.11.0_cpu-pcp_none-gpu_cpu-arc_arm64-driver_none:202610262324'

```

The local image ID is an image configuration hash, not a registry manifest digest.

## Step 3 — Unpack the complete BF16 checkpoint

Use the same files on either platform. An existing directory is reused only if its checksums pass. No shard index is required: these assets each contain `model.safetensors`.

<!-- run:common -->
```sh
mkdir -p "$HOME/Models"
if [ ! -d "$MODEL_DIR" ]; then
  tar -xzf "$ASSET_DIR/$MODEL_ASSET" -C "$HOME/Models"
fi
test -f "$MODEL_DIR/config.json"
test -f "$MODEL_DIR/model.safetensors"
if command -v sha256sum >/dev/null 2>&1; then
  (cd "$MODEL_DIR" && sha256sum -c SHA256SUMS)
else
  (cd "$MODEL_DIR" && shasum -a 256 -c SHA256SUMS)
fi
```

## Step 4A — Mac: start the service

<!-- run:mac -->
```sh
export FLAGOS_CACHE_DIR="$HOME/Library/Caches/FlagOS/jev-bf16-20261026"
export EXAMPLE_DIR="$RT/share/flagos-ocr-jev/examples"
"$RT/bin/flagos-jev" serve --model "$MODEL_DIR" --host 127.0.0.1 --port 18551 > "$RUN_DIR/artifacts/server.log" 2>&1 &
export SERVER_PID=$!
```

## Step 4B — P1: start the inference container

Use an unused container name. Keep the model mount read-only and caches writable. Do not mount a host directory over the packaged runtime or compiler.

<!-- run:linux -->
```sh
export CONTAINER_NAME='flagos-jev-bf16'
export CACHE_DIR="$HOME/.cache/flagos/jev-bf16-20261026"
mkdir -p "$CACHE_DIR"
sudo docker run --detach --name "$CONTAINER_NAME" --network host \
  --cpuset-cpus 0,1,6,7,8,9,10,11 \
  -e FLAGOS_CACHE_DIR=/cache \
  -v "$MODEL_DIR:/model:ro" -v "$CACHE_DIR:/cache" \
  "$CIX_IMAGE" serve --model /model --host 127.0.0.1 --port 18551
sudo docker inspect "$CONTAINER_NAME" --format 'cpuset={{.HostConfig.CpusetCpus}} mounts={{json .Mounts}}' > "$RUN_DIR/artifacts/container-identity.txt"
sudo docker cp "$CONTAINER_NAME:/opt/flagos-runtime/share/flagos-ocr-jev/examples" "$RUN_DIR/examples"
export EXAMPLE_DIR="$RUN_DIR/examples"
sudo docker logs --follow "$CONTAINER_NAME" > "$RUN_DIR/artifacts/server.log" 2>&1 &
export LOG_PID=$!
```

## Step 5 — Wait for readiness

First startup and the first image request can take several minutes for imports, packing and JIT. Readiness means the model is loaded; an image shape can still require first-use compilation.

<!-- run:common -->
```sh
ready=0
attempt=0
while [ "$attempt" -lt 180 ]; do
  if curl --noproxy '*' --max-time 5 -fsS "$API_BASE/health" > "$RUN_DIR/artifacts/health.json"; then
    ready=1
    break
  fi
  attempt=$((attempt + 1))
  sleep 5
done
if [ "$ready" -ne 1 ]; then
  tail -n 100 "$RUN_DIR/artifacts/server.log"
  exit 1
fi
cat "$RUN_DIR/artifacts/health.json"
```

## Step 6 — Send and verify a request

The original image is first and the separately rendered image second. Supply the exact OCR candidate text; a renderer is not included in the scorer. The packaged example is expected to return label 1. This is a task-specific `/v1/score` API, not a chat-completions endpoint.

<!-- run:common -->
```sh
python3 - <<'PY'
import base64, json, os
from pathlib import Path
examples = Path(os.environ['EXAMPLE_DIR'])
body = {'ocr_text': (examples / 'jev-text.txt').read_text().rstrip('\r\n')}
for key, name in [('orig_image', 'jev-original.png'), ('render_image', 'jev-rendered.png')]:
    body[key] = 'data:image/png;base64,' + base64.b64encode((examples / name).read_bytes()).decode('ascii')
(Path(os.environ['RUN_DIR']) / 'artifacts/request.json').write_text(json.dumps(body, ensure_ascii=False))
PY

curl --noproxy '*' --fail-with-body --max-time 1800 \
  "$API_BASE/v1/score" -H 'Content-Type: application/json' \
  --data-binary "@$RUN_DIR/artifacts/request.json" \
  --output "$RUN_DIR/artifacts/response.json"

python3 - <<'PY'
import json, os
from pathlib import Path
result = json.loads((Path(os.environ['RUN_DIR']) / 'artifacts/response.json').read_text())
assert result['device'] == 'cpu'
assert result['precision'] == 'BF16; no quantization'
import math
assert len(result['logits']) == 2 and all(math.isfinite(x) for x in result['logits'])
assert abs(result['prob_0'] + result['prob_1'] - 1.0) < 1e-5
assert result['pred_label'] == 1
assert result['input_tokens'] == 237
assert result['head'] == 'BF16 score[2,2048]; no LM head'
print('P(consistent)=', result['prob_1'], 'label=', result['pred_label'])
PY
```

## Step 7 — Stop the service

Mac:

<!-- run:mac -->
```sh
kill -TERM "$SERVER_PID"
wait "$SERVER_PID" || true
```

P1:

<!-- run:linux -->
```sh
sudo docker stop -t 30 "$CONTAINER_NAME"
sudo docker rm "$CONTAINER_NAME"
wait "$LOG_PID" || true
```

Responses, identity records and logs remain under `$RUN_DIR/artifacts`. Runtime/images and model files remain installed.

## Validation and reference performance

The packaged example matched the previously recorded backend-specific logits on each platform: Mac `[-3.078125, 2.265625]`, P1 `[-3.078125, 2.25]`, with identical 237-token inputs. These backend differences do not change the example decision. Mac recorded 194 SME calls; P1 uses its non-SME route.

Reference measurements before packaging: original 12 supplied examples, bs=1, one excluded warmup/example, 5 formal forwards/example, 60 measurements. Time is the sum of vision, embedding, text and pooling/value-head model calls; loading, image preprocessing/tokenization, JIT/warmup and scheduling are excluded. These are not HTTP request latencies.

| Platform | Mean | Median | P90 |
|---|---:|---:|---:|
| M5 Pro CPU, FlagOS | 1201.97 ms | 895.91 ms | 2352.61 ms |
| CIX P1, 8 A720 cores, FlagOS | 4627.84 ms | 3493.26 ms | 8866.60 ms |

The 12 examples are curated contract/performance samples, not an independent accuracy benchmark. A first HTTP request includes processing and first-use compilation and must not be substituted for these warmed forward-only statistics.

The optional source asset contains the corresponding reference reports and raw identities. No cross-platform universal regression bound, all-operator Triton coverage, or native NVIDIA speed ratio is claimed.

## Reproduction boundaries

- Use the complete matching BF16 model asset; neither checkpoint uses a shard index in this release.
- The launchers select isolated OCR/Jev dependencies, clear inherited experimental overrides and choose the platform profile.
- Keep caches separate between these two profiles. A fresh cache increases first-use time.
- A reused installation must pass its checksums. A reused container name must be changed or the old deployment stopped deliberately.
- If host CPU numbering differs, verify the A720 IDs before changing the cpuset.
- The source asset is a frozen implementation/provenance snapshot. Public model repositories, registry publication and a complete compiler rebuild are separate release steps.

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
The model weights are derived from OpenBMB/MiniCPM-OCR-Jev and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
