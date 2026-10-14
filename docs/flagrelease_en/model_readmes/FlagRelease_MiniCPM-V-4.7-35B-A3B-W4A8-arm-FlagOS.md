---
frameworks:
- ""
language:
- en
- zh
pipeline_tag: image-text-to-text
tags:
- minicpm
- flagos
- vllm
- arm64
- quantized
- vision-language
- w4a8
tasks: []
---

# Introduction
ModelBest, together with OpenBMB, has open-sourced the next-generation on-device multimodal large model MiniCPM-V4.7, releasing two variants at once: 1B and 35B-A3B (MoE). The Zhongzhi FlagOS community completed day-0 cross-chip adaptation covering 12 platforms — T-Head, NVIDIA, Huawei Ascend, Hygon, Kunlunxin, MetaX, Moore Threads, Tsingmicro, Iluvatar CoreX, Sunrise, Mac (M5 Pro), and CIX P1 — based on the FlagOS unified multi-chip software stack. Model images are now live on ModelScope and HuggingFace simultaneously. This adaptation extends both variants to ARM edge CPU platforms as well, enabling a viable deployment path for multimodal understanding on both data-center and end-user devices. The 35B-A3B model is the world’s first open-source MoE multimodal large model capable of lossless and smooth on-device operation, with 35B total parameters and approximately 3B activated parameters. Its core technology, Lookahead Expert Scheduling (LES), cuts on-device inference latency by preloading experts and performing computation and reading in parallel. According to official benchmarks, when paired with the on-device optimization scheme, the model achieves a generation speed of over 13 tokens per second on an iPhone 17 Pro Max. The model retains the early-compression-within-ViT technique and 4×/16× visual token compression, and supports DSpark speculative decoding to balance visual detail and inference efficiency. In official Instruct-mode evaluations, the 35B-A3B and 1B models attained higher overall scores than Qwen3.6-35B-A3B and Qwen3.5-0.8B respectively, with shorter inference time.

# MiniCPM-V-4.7-35B-A3B W4A8 G32 — FlagOS

This checkpoint adapts MiniCPM-V-4.7 35B-A3B for CPU inference with FlagOS
on Apple M5 Pro and CIX P1. The language backbone is a sparse Mixture-of-Experts model: 256 experts, with 8 routed experts selected per token.
It supports text and image understanding, including OCR. The documented
deployment accepts one image per request and disables video input.

## Model and quantization contract

| Item | Value |
|---|---|
| ModelScope repository | `FlagRelease/MiniCPM-V-4.7-35B-A3B-W4A8-arm-FlagOS` |
| Architecture | `MiniCPMV4_7ForConditionalGeneration` |
| Language backbone | `qwen3_5_moe_text`; 40 layers, hidden size 2048; hybrid linear/full attention |
| Language-body weights | Symmetric INT4, group size 32 along the input dimension; packed weights |
| Weight scales | BF16, one scale per output row and input group |
| Input activations | Checkpoint declares dynamic symmetric A8; the optimized KAI route executes dynamic asymmetric per-token A8 |
| Checkpoint format | `compressed-tensors`, `pack-quantized` |
| Quantized language-body linears | 31,030, including 30,720 expert linears |
| Embeddings | BF16 |
| Output head (`lm_head`) | Stored as BF16; prepared for W8A8 execution by the supplied profile |
| Vision encoder and visual merger | BF16; not quantized |
| Default documented serving context | 4096 tokens |
| Context declared in the checkpoint | 262144 tokens; not qualified at that length in this release |
| Speculative decoding | DSpark is not included in this published runtime; MTP is not enabled |

MoE router gates, embeddings, normalization parameters, and the visual
components are excluded from W4 quantization. The output head is not a W4
G32 tensor: the runtime prepares its BF16 checkpoint weight for W8A8.

Keep the complete repository: weight shards, `model.safetensors.index.json`,
configuration, tokenizer, chat template, processor files, and bundled Python
model/processor code. Do not mix files from different checkpoints. This
checkpoint uses the FlagOS plugin integration; installing upstream vLLM alone
does not reproduce the documented inference path.

## User Guide

### Mac

Test environment: Apple M5 Pro CPU only, macOS arm64, 64 GiB memory.
Use the native MiniCPM-V4.7 runtime archive with vLLM `0.24.0+cpu`.
Docker Desktop and Metal GPU execution are not the qualified Mac path.

### Linux

Test environment: CIX P1, Linux aarch64, eight Cortex-A720 cores,
32 GiB memory. Use the corrected MiniCPM-V4.7 Docker image with vLLM
`0.24.0+cpu`.

The local checkpoint passed text, image/OCR, and operator validation on both
platforms. Text-chat, arithmetic, and image HTTP checks passed on both platforms
on 2026-10-12 using the serving flags below. The Linux runtime is published to Harbor under the
model-specific name below. Access to the model repository and native Mac
archive follows the release owner's distribution policy. Keep each checkpoint's
configuration, tokenizer, processor, model code, and weight shards together.

## Operation Steps

### Shared model download: Linux and Mac

Install the ModelScope CLI in a separate download environment:

```sh
python3 -m venv "$HOME/.venvs/modelscope"
"$HOME/.venvs/modelscope/bin/python" -m pip install modelscope

export MODEL_REPO="FlagRelease/MiniCPM-V-4.7-35B-A3B-W4A8-arm-FlagOS"
export MODEL_DIR="$HOME/Models/MiniCPM-V-4.7-35B-A3B-W4A8-G32-FlagOS-Packed"

"$HOME/.venvs/modelscope/bin/modelscope" download \
  --model "$MODEL_REPO" \
  --local_dir "$MODEL_DIR"
```

The same checkpoint files are used on both platforms. Keep all 48 weight
shards and `model.safetensors.index.json`, together with the supplied
configuration, tokenizer, processor, and model code.

Follow only the section for your host.

### Linux / CIX P1: Docker

#### 1. Prepare the host

Requires Linux aarch64, Docker, and access to the BAAI Harbor registry.
Verify the board topology before using the tested CPU affinity:

```sh
uname -m
lscpu -e=CPU,CORE,ONLINE,MAXMHZ
for cpu in /sys/devices/system/cpu/cpu[0-9]*; do
  printf '%s ' "${cpu##*/}"
  cat "$cpu/regs/identification/midr_el1" 2>/dev/null || echo unreadable
done

test -f "$MODEL_DIR/config.json" || exit 1
test -f "$MODEL_DIR/model.safetensors.index.json" || exit 1
```

`uname -m` must report `aarch64`. On the tested P1, Cortex-A720 CPUs are
`0,1,6,7,8,9,10,11`; Cortex-A520 CPUs `2,3,4,5` are excluded.
This numbering is board-specific.

#### 2. Pull and identify the Docker image

Pull the published runtime by immutable registry digest. The image does not
include model weights. Log in if the registry requires authentication:

```sh
sudo docker login harbor.baai.ac.cn
```

```sh
export CIX_IMAGE_REF='harbor.baai.ac.cn/flagrelease-public/flagrelease-minicpm-v-4.7-35b-a3b-w4a8-g32-arm-tree_3.7.2_g36133df-gems_ae1a81c71644-vllm_0.24.0_cpu-plugin_f0de70233590-cx_none-python_3.11.2-torch_2.11.0_cpu-pcp_none-gpu_cpu-arc_arm64-driver_none:202610121555'

sudo docker pull "$CIX_IMAGE_REF"

```

The repository digest must match `CIX_IMAGE_DIGEST`. The local image ID is a
separate configuration hash; both were checked after publication by pulling
each model's image from Harbor by digest on P1.

<details>
<summary>Optional offline installation</summary>

Skip the `docker pull` command when using this alternative. Define the image
variables above, obtain the matching archive from the release owner, and run:

```sh
export ARTIFACT_DIR="$HOME/Downloads/FlagOS-MiniCPMV4.7"
(cd "$ARTIFACT_DIR" && printf '%s  %s\n' \
  '37a126ed09b2e77c5a226131f858f74da01a585b2fc831c8fef6c09300ca1a66' \
  'flagos-minicpmv47-cix-p1-0.3.1-20261011.docker.tar.gz' \
  | sha256sum -c -) || exit 1

gzip -dc "$ARTIFACT_DIR/flagos-minicpmv47-cix-p1-0.3.1-20261011.docker.tar.gz" \
  | sudo docker load
sudo docker tag "$CIX_IMAGE_ID" "$CIX_IMAGE"
test "$(sudo docker image inspect "$CIX_IMAGE" --format '{{.Id}}')" \
  = "$CIX_IMAGE_ID" || exit 1
# The archive predates registry publication; run its verified local image ID.
export CIX_IMAGE_REF="$CIX_IMAGE_ID"
```

</details>

The local image ID above is not a registry manifest digest. Use this exact
V4.7 0.3.1 image for the documented P1 deployment.

#### 3. Start vLLM

Continue in the shell where `MODEL_DIR` and the image variables were defined.
Remove inherited experimental overrides before starting this guide. The
launcher loads the selected model profile.
Leave `VLLM_CPU_KVCACHE_SPACE` unset on P1; it overrides the explicit byte
budget in the CPU backend.

```sh
export RUN_DIR="$HOME/flagos-runs/35b-$(date +%Y%m%d-%H%M%S)"
export CACHE_DIR="$HOME/.cache/flagos/MiniCPM-V-4.7-35B-A3B-W4A8-G32-FlagOS-Packed"
export CONTAINER_NAME='minicpmv47-35b-runtime'
export SERVED_MODEL_NAME='minicpmv47-35b'
export API_BASE='http://127.0.0.1:8000'
mkdir -p "$CACHE_DIR" "$RUN_DIR/artifacts"

sudo docker run --detach \
  --name "$CONTAINER_NAME" \
  --network host \
  --cpuset-cpus 0,1,6,7,8,9,10,11 \
  -e FLAGOS_PROFILE=35b \
  -e OMP_PROC_BIND=false \
  -v "$MODEL_DIR:/model:ro" \
  -v "$CACHE_DIR:/cache" \
  -v "$RUN_DIR/artifacts:/artifacts" \
  "$CIX_IMAGE_REF" \
  serve /model \
  --served-model-name "$SERVED_MODEL_NAME" \
  --trust-remote-code --dtype bfloat16 \
  --max-model-len 4096 --max-num-batched-tokens 512 --max-num-seqs 1 \
  --worker-cls vllm_fl.worker.cpu_phase_worker.CPUPhaseWorker \
  --distributed-executor-backend uni --enforce-eager --no-enable-prefix-caching \
  --kv-cache-memory-bytes 268435456 --mamba-ssm-cache-dtype float32 \
  --generation-config vllm --limit-mm-per-prompt '{"image":1,"video":0}' \
  --host 127.0.0.1 --port 8000

sudo docker inspect "$CONTAINER_NAME" \
  --format 'cpuset={{.HostConfig.CpusetCpus}} mounts={{json .Mounts}}'
sudo docker logs --follow "$CONTAINER_NAME" > "$RUN_DIR/artifacts/server.log" 2>&1 &
export LOG_PID=$!
```

No `--privileged` option or GPU device is required. Mount only the documented
model, writable cache, and results directories; do not hide packaged runtime
libraries or compiler files with host mounts. The first launch includes JIT
compilation and builds a persistent expert packing cache.
`CACHE_DIR` persists across runs; select a new directory when changing the
checkpoint files. Logs and responses remain separate for each run.

For HTTP serving, `OMP_PROC_BIND=false` prevents a spawned vLLM engine from
inheriting a single-core OpenMP affinity mask from the API process. Docker's
eight-core `--cpuset-cpus` restriction remains active. This serving setting
differs from the bound, single-process P1 benchmark policy in the performance
table below.

The 35B profile builds approximately 8.6 GiB of persistent expert cache.
Reserve at least 12 GiB of writable cache space in addition to model and
runtime storage, and reuse the cache for subsequent starts of this checkpoint.


#### 4. Wait for readiness and send requests

Use the shared readiness, text, and image examples below in the same shell.
They save responses in `$RUN_DIR/artifacts`.

### Mac / M5 Pro: native runtime

#### 1. Check the host

```sh
uname -m
sysctl -n hw.model
xcrun --find clang

test -f "$MODEL_DIR/config.json" || exit 1
test -f "$MODEL_DIR/model.safetensors.index.json" || exit 1
```

The tested host reports `arm64` and `Mac17,9`. Apple Command Line Tools provide
`clang` for JIT linking; install them with `xcode-select --install` if absent.

#### 2. Install the matching native runtime archive

The V4.7 runtime is installed by extracting its archive to a new directory.
It includes CPython, PyTorch, vLLM `0.24.0+cpu`, FlagGems, FlagTree-CPU/Triton
CPU, vLLM-Plugin-FL, libtriton_jit, and OpenMP. No host `pip install vllm`
or `sudo` is required for runtime installation.

```sh
export ARTIFACT_DIR="$HOME/Downloads/FlagOS-MiniCPMV4.7"
(cd "$ARTIFACT_DIR" && printf '%s  %s\n' \
  'cb533142f671722b2048f4912ee2eff68ba6eecc5184eb909c8da990606bf43a' \
  'flagos-minicpmv47-macos-arm64-20261011.tar.gz' \
  | shasum -a 256 -c -) || exit 1

export RT="$HOME/Library/FlagOS/minicpmv47-20261011"
if [ ! -e "$RT" ]; then
  mkdir -p "$RT"
  tar -xzf "$ARTIFACT_DIR/flagos-minicpmv47-macos-arm64-20261011.tar.gz" -C "$RT"
fi
printf '%s  %s\n' '0648b55a1b3b61435f2491e56ed532d63d365b2bab30d3fd0d30d3a36e65698b' \
  "$RT/share/flagos-minicpmv47/sources.lock.json" | shasum -a 256 -c - || exit 1
"$RT/bin/flagos-vllm" --profile 35b --version
```

The version must be `0.24.0+cpu`. Mac runtime snapshot version is
`0.3.0-minicpmv47.1`; the P1 correction did not replace this archive.
Use the archive identified above for this V4.7 deployment.
Install it once for both models. The source-lock check also applies when
reusing an existing installation; run only one serving example at a time.

#### 3. Start vLLM

Continue in the shell where `MODEL_DIR` and `RT` were defined. Run:

```sh
export RUN_DIR="$HOME/flagos-runs/35b-$(date +%Y%m%d-%H%M%S)"
export FLAGOS_CACHE_DIR="$RUN_DIR/cache"
export SERVED_MODEL_NAME='minicpmv47-35b'
export API_BASE='http://127.0.0.1:8000'
mkdir -p "$RUN_DIR/artifacts"

"$RT/bin/flagos-vllm" --profile 35b serve "$MODEL_DIR" \
  --served-model-name "$SERVED_MODEL_NAME" \
  --trust-remote-code --dtype bfloat16 \
  --max-model-len 4096 --max-num-batched-tokens 512 --max-num-seqs 1 \
  --worker-cls vllm_fl.worker.cpu_phase_worker.CPUPhaseWorker \
  --distributed-executor-backend uni --enforce-eager --no-enable-prefix-caching \
  --mamba-ssm-cache-dtype float32 --generation-config vllm \
  --limit-mm-per-prompt '{"image":1,"video":0}' \
  --host 127.0.0.1 --port 8000 \
  > "$RUN_DIR/artifacts/server.log" 2>&1 &
export SERVER_PID=$!
```

The Mac profile sets a 2 GiB CPU KV-cache budget. No GPU-memory option is
needed. First startup may take several minutes for imports, JIT compilation,
and weight preparation. The Mac profile prepares expert weights in memory;
keep enough RAM available. P1 additionally uses a disk-backed expert cache. Keep writable cache space available.

### Shared HTTP examples

Run these while your platform's server is running, in the same shell as its
startup block so that `API_BASE`, `SERVED_MODEL_NAME`, and `RUN_DIR` are defined.

#### Wait for the server

```sh
ready=0
for attempt in $(seq 1 120); do
  if curl --noproxy '*' --max-time 5 -fsS "$API_BASE/v1/models" \
    > "$RUN_DIR/artifacts/models.json"; then
    ready=1
    break
  fi
  sleep 5
done
if [ "$ready" -ne 1 ]; then
  tail -n 100 "$RUN_DIR/artifacts/server.log"
  exit 1
fi
```

#### Text request

```sh
curl --noproxy '*' --fail-with-body --max-time 600 \
  "$API_BASE/v1/chat/completions" \
  -H 'Content-Type: application/json' \
  --data '{
    "model": "minicpmv47-35b",
    "messages": [{"role":"user","content":"Introduce FlagOS in one sentence."}],
    "chat_template_kwargs": {"enable_thinking": false},
    "max_tokens": 128,
    "temperature": 0
  }' \
  --output "$RUN_DIR/artifacts/chat-response.json"

python3 - <<'PY'
import json, os
from pathlib import Path
response = json.loads((Path(os.environ['RUN_DIR']) / 'artifacts/chat-response.json').read_text())
assert response['choices'][0]['message']['content'].strip()
assert response['usage']['completion_tokens'] > 0
print(response['choices'][0]['message']['content'])
print(response['usage'])
PY
```

Thinking behavior is controlled explicitly with `chat_template_kwargs`:
set `enable_thinking` to `true` when reasoning output is desired, and give
the request a suitable token budget. The examples use `false` for a short
functional check. No reasoning-parser option is needed for these examples.

#### Image request

Set `IMAGE_PATH` to a local JPEG or PNG. The client embeds it as a data URL;
the container does not need an additional image-file mount.

```sh
export IMAGE_PATH="$HOME/Pictures/example.png"
python3 - <<'PY'
import base64, json, mimetypes, os
from pathlib import Path
image = Path(os.environ['IMAGE_PATH'])
mime = mimetypes.guess_type(image.name)[0]
assert mime in ('image/jpeg', 'image/png'), 'Use a JPEG or PNG image.'
data_url = 'data:' + mime + ';base64,' + base64.b64encode(image.read_bytes()).decode('ascii')
body = {
    'model': os.environ['SERVED_MODEL_NAME'],
    'messages': [{'role': 'user', 'content': [
        {'type': 'image_url', 'image_url': {'url': data_url}},
        {'type': 'text', 'text': 'Describe this image briefly.'},
    ]}],
    'chat_template_kwargs': {'enable_thinking': False},
    'temperature': 0, 'max_tokens': 128,
}
(Path(os.environ['RUN_DIR']) / 'artifacts/image-request.json').write_text(json.dumps(body))
PY

curl --noproxy '*' --fail-with-body --max-time 600 \
  "$API_BASE/v1/chat/completions" \
  -H 'Content-Type: application/json' \
  --data-binary "@$RUN_DIR/artifacts/image-request.json" \
  --output "$RUN_DIR/artifacts/image-response.json"
```

### Stop the service after the HTTP examples

On P1:

```sh
sudo docker stop -t 30 "$CONTAINER_NAME"
sudo docker rm "$CONTAINER_NAME"
wait "$LOG_PID" || true
```

On Mac:

```sh
kill -TERM "$SERVER_PID"
wait "$SERVER_PID" || true
```

## DSpark packaging status

The image and Mac archive documented above contain the target-model runtime.
They do not contain the experimental DSpark adapter or draft checkpoint.
Uploading a draft checkpoint alone does not enable DSpark in these packages.

DSpark experiments load a separate BF16 draft checkpoint and prepare selected
weights for W8A8 execution at startup. The output-head arrangement in the
current 35B M5 text-only, greedy-decoding experiment is:

| Component | Checkpoint storage | Runtime execution |
|---|---|---|
| Target `lm_head`, shared with DSpark | BF16 in the target checkpoint | W8A8 |
| DSpark Markov lookup `markov_w1` | BF16 in the draft checkpoint | BF16 lookup |
| DSpark Markov output projection `markov_w2` | BF16 in the draft checkpoint | W8A8 |
| DSpark confidence projection | BF16 in the draft checkpoint | FP32 |
| 20 draft Attention/MLP linear modules | BF16 in the draft checkpoint | W8A8 for inputs with at most 32 rows; BF16 for larger inputs |
| Draft context-KV projection | BF16 in the draft checkpoint | BF16 |

The draft W8 fast path is shape-dependent; this is not a fully INT8-stored
draft model. The runtime-prepared W8 weights are not a separately saved INT8
checkpoint.
For a future DSpark release, publish the complete matching draft checkpoint,
including its Markov and confidence heads, as a companion model asset. Its
runtime integration must be included in a new validated plugin/image release.
The shared target output head does not need a second independent upload.

## Validation and performance

Single-instance text inference, PP512 followed by TG128, unit: tokens/s.
Warmup requests are excluded; medians are taken over the stated measured
requests. These are engine timing measurements, not HTTP throughput or
image-inclusive latency.

| Platform / policy | Measured requests | Prefill / decode threads | PP512 | TG128 | Total |
|---|---:|---|---:|---:|---:|
| M5 Pro native, archive qualification | 3 | 18 / 8 | 452.30 | 47.00 | 165.81 |
| M5 Pro native, 2026-10-12 repeat | 6 | 18 / 8 | 472.66 | 51.14 | 180.52 |
| CIX P1 corrected Docker, schedutil | 12 | 8 / 6 | 110.84 | 8.647 | 33.176 |

Definitions for each combined request:

- PP512 = `512 / (first-token timestamp - scheduled timestamp)`.
- TG128 = `127 / (last-token timestamp - first-token timestamp)`.
- Total = `640 / (last-token timestamp - scheduled timestamp)`.

The first generated token is included in prefill timing. Total is calculated
per request before taking its median; independent PP/TG best scores are never
combined. Mac's original packaged harness releases unused heap pages before
each benchmark request; the corrected P1 harness retains warmed heap pages.
Do not attribute their difference solely to arithmetic kernels.

P1 observed ranges: PP512 95.90–113.16, TG128 8.510–8.681,
Total 31.59–33.28; peak process RSS was 21.61 GiB including load and image
cases. The slower first measured request is retained. Keep normal host
frequency policy for this model: the 1B frequency-floor control did not
improve 35B decode.

The 2026-10-12 Mac repeat used the same packaged target-model runtime with
DSpark disabled; TG128 ranged from 49.07 to 52.90. These small samples do
not establish a statistical regression bound. No universal ≤0.5% regression
claim is made.

For reproducible validation, stop the serving process first so that only one
model instance is loaded. The runtime includes an operator validator and a
model validator. On Mac:

```sh
export CHECK_ID="$(date +%Y%m%d-%H%M%S)"
"$RT/bin/flagos-python" --profile 35b \
  "$RT/share/flagos-minicpmv47/validation/package_ops.py" \
  --prefix "$RT/python/lib/python3.11/site-packages" \
  --output "$RUN_DIR/artifacts/operators-$CHECK_ID.json"
"$RT/bin/flagos-python" --profile 35b \
  "$RT/share/flagos-minicpmv47/validation/model_smoke.py" \
  --model "$MODEL_DIR" --worker phase --vision --repeats 3 \
  --package-site "$RT/python/lib/python3.11/site-packages" \
  --output "$RUN_DIR/artifacts/model-$CHECK_ID.json"
```

On P1, after stopping/removing the serving container:

```sh
export CHECK_ID="$(date +%Y%m%d-%H%M%S)"
sudo docker run --rm --network host --cpuset-cpus 0,1,6,7,8,9,10,11 \
  --entrypoint /opt/flagos-runtime/bin/flagos-python \
  -e FLAGOS_PROFILE=35b \
  -v "$CACHE_DIR:/cache" -v "$RUN_DIR/artifacts:/artifacts" \
  "$CIX_IMAGE_REF" \
  /opt/flagos-runtime/share/flagos-minicpmv47/validation/package_ops.py \
  --prefix /opt/flagos-runtime/venv/lib/python3.11/site-packages \
  --output "/artifacts/operators-$CHECK_ID.json"
sudo docker run --rm --network host --cpuset-cpus 0,1,6,7,8,9,10,11 \
  --entrypoint /opt/flagos-runtime/bin/flagos-python \
  -e FLAGOS_PROFILE=35b \
  -v "$MODEL_DIR:/model:ro" -v "$CACHE_DIR:/cache" \
  -v "$RUN_DIR/artifacts:/artifacts" \
  "$CIX_IMAGE_REF" \
  /opt/flagos-runtime/share/flagos-minicpmv47/validation/model_smoke.py \
  --model /model --worker phase --vision --repeats 12 \
  --package-site /opt/flagos-runtime/venv/lib/python3.11/site-packages \
  --output "/artifacts/model-$CHECK_ID.json"
```

Validators save results atomically after each completed request and refuse to
overwrite an existing report. Preserve completed reports if interrupted; use
a new output filename on restart. Retain configuration, server log,
HTTP responses, environment settings, and validation JSON for release review.
The operator validator checks native, CPU TLE Raw, and ordinary Triton
implementations. A non-empty HTTP response alone does not prove quantized
kernel coverage or BF16 quality parity. Review the validation reports and
model-specific routes; this package does not supply the separate MiniCPM5
`coverage.json` interface.

## Runtime integration and source provenance

The launcher selects platform/model defaults. `CPUPhaseWorker` switches
thread counts at prefill/decode boundaries. Model, processor, and quantized
Linear integration live in vLLM-Plugin-FL; operators live in FlagGems; CPU
Triton/TLE support lives in FlagTree-CPU. The vLLM 0.24 core is unchanged
by this V4.7 adaptation.

Execution uses ordinary CPU Triton for supported operations and native fused
Arm operators for other operations. Apple M5 Pro has SME2/Neon paths;
CIX P1 uses its supported Arm/Neon paths. Supported CPU TLE Raw entry points
retain the C++ arithmetic implementation. The qualified default is the
packaged native profile; this guide does not claim that every operation is
an ordinary Triton kernel or that whole-model TLE performance is equivalent.

| Component | Locked version / source commit |
|---|---|
| vLLM | `0.24.0+cpu` |
| PyTorch | `2.11.0` |
| Transformers | `5.15.1` |
| FlagGems | Commit `ae1a81c716445ff71d0a8b2a979fa9ded6f3d2c7` |
| FlagTree-CPU / Triton | `3.7.2+g36133df`; commit `36133df9540cdd9eb5b09209ee41ce1697b27126` |
| vLLM-Plugin-FL | Commit `f0de702335902facfffe625c0690f7a3df7f617d` |

Sources are tracked in the corresponding `kevinzs2048` component repositories
on branch `minicpm-v47-arm-triton-tle-20261011`. Runtime packaging is tracked
in `kevinzs2048/flagos-macos-runtime`, branch
`minicpm-v47-arm-distribution-20261011`; the corrected delivery record is
commit `5582f208df7b204b9637d0f8b10c4320609cd0b0`.
The Mac artifact retains its original source snapshot; the corrected P1 image
recipe is `0f3a6a35705ed26a22e8e92815f654cf64c8dbd1`.

Use the `minicpmv47/` source lock and packaging instructions for this release.
These are verified runtime snapshots, not claims
that Python, PyTorch, vLLM, and LLVM were all rebuilt from source. Runtime
assets exclude model weights, DSpark, quantization-generation scripts, and
evaluation datasets.

