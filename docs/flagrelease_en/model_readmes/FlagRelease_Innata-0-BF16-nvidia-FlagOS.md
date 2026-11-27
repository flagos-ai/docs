---
license: other
license_name: apache-2.0-and-openmdw-1.1
language:
- zh
- en
---

# Introduction
BAAI (Beijing Academy of Artificial Intelligence) releases **Innata-0**, a native embodied world system. Built on a unified multi-chip software stack, the FlagOS open community provides **Day0 cross-chip adaptation support** focusing on embodied understanding, action-conditioned world prediction and robotic action generation. This adaptation targets six platforms: NVIDIA, MetaX, Hygon, Ascend, Moore Threads and T-Head. It verifies model outputs and inference efficiency across various tasks to support the deployment and evaluation of embodied models on diverse computing hardware.

Centered on three core capabilities — planning, recovery and evolution — Innata-0 is built with co-design of models and agents. **Innata-0-WAM** adopts a three-tower Mixture-of-Transformers architecture to jointly model world understanding, visual prediction, as well as action and tactile generation. **Innata-0-Agent** is responsible for task planning, execution validation, error recovery and accumulation of reusable experience. In the official RoboCasa365 simulation benchmark, equipping the base WAM with the complete agent stack raises the overall task success rate from **60.2% to 65.4%**. For unseen compositional tasks, the success rate increases from **32.4% to 43.6%**. These results illustrate the value of combining model execution with agent-enabled planning, validation and recovery.

## Integrated Deployment

This image runs InNata-0 on NVIDIA H100 using Torch-FL and the source release's
`torch.accelerator` entry points. The image includes the inference application
and its runtime dependencies. Mount the model checkpoints, Wan2.2 VAE, and
request files from the host.

| Task | Interface | Inference backend |
|---|---|---|
| Understanding | `POST /v1/chat/completions` | Transformers 4.57.6, Qwen3-VL BF16 SDPA |
| ACWM | `cosmos_framework.scripts.inference` | Torch-FL, `torch.compile` |
| RoboDojo and RoboCasa365 | `POST /generate` | InNata WAM server with NVIDIA FlashAttention 3 |

## Consistency Validation

The image passed all five V4 requests on NVIDIA H100 using its default
Torch-FL configuration with CPU operator fallback disabled. The V4 verifier
reported exact Understanding BLINK and nine-frame MMSI responses, exact ACWM
decoded RGB frames, and exact RoboDojo and RoboCasa365 actions and timestamps.

The published image passed a privacy check across its 15 layers and 59,915 regular files. Harbor's manifest points to the same image configuration used for the H100 validation.

## 中文快速说明

在 Linux x86_64 H100 主机加载镜像，按下文挂载四份 HF 权重、Wan2.2 VAE
和 V4 请求目录。Understanding、RoboDojo 和 RoboCasa 使用 V4 报告第 4 节的
`--server-url` 方式。ACWM 使用同一节的原生推理 CLI。每个服务使用一张 H100，
FlagOS 默认禁用 CPU 算子回退。镜像自带 ACWM 复测所用的 TorchInductor 调优记录。

# User Guide

## Environment Setup

### Host Environment

| Item | Validated configuration |
|---|---|
| GPU | NVIDIA H100 80 GB HBM3, one GPU per inference container |
| Host OS | Ubuntu 22.04.4 LTS, x86_64 |
| Container | Linux amd64, Debian trixie, CPython 3.12.16 |
| Docker Engine | 24.0.0, with NVIDIA device access as shown below |
| NVIDIA Driver | 580.126.20 |
| CUDA, PyTorch | CUDA 13.0, PyTorch 2.10.0+cu130 |
| Torch-FL | 2.10.0+cuda13.3, native host enabled |



## Operation Steps
### Download FlagOS Image
```bash
export IMAGE=harbor.baai.ac.cn/flagrelease-public/innata-0-nvidia003-gems5.4.0-tree0.7.0-cxnone-pluginnone-vllmnone-sglangnone-sglangflnone-cp312-pt210-cu130-x64-580.126.20:202611271149
export IMAGE_DIGEST=sha256:6024633d89c72af33869e6373d1056f19799d4ff1afc8e839852745857249c7e
docker pull harbor.baai.ac.cn/flagrelease-public/innata-0-nvidia003-gems5.4.0-tree0.7.0-cxnone-pluginnone-vllmnone-sglangnone-sglangflnone-cp312-pt210-cu130-x64-580.126.20:202611271149

```
- Registry digest `sha256:6024633d89c72af33869e6373d1056f19799d4ff1afc8e839852745857249c7e`
- Image configuration ID `sha256:b2f505bad3fc744d4fae0a09aa43917b683b09554ab92a98b48db3b0e64d60c1`
- InNata source revision `84de20a8424babf60f5bd1fbd9385749fda46b1b`
- Torch-FL source revision `a77e2758235cacc03d6a73d74f81f47ebaa62139`
- Input wheel SHA-256 `2d3a368f7bec2892abaa616583cfe17d16b6d5d1bccecff445efdf31155adca7`

### Download Open-source Model Weights
```bash
modelscope download --model FlagRelease/Innata-0-BF16-nvidia-FlagOS
```
Point `HF_ROOT` at the directory containing these four InNata Hugging Face
checkpoint snapshots. Point `KIT` at the unpacked `chip-adaptation-v4` package.
Use the request files and media from that release package.

```text
$HF_ROOT/
  Innata-0-Understanding/
  Innata-0-ACWM/
  Innata-0-WAM-RoboDojo/
  Innata-0-WAM-RoboCasa365/
```

Use the `Wan2.2_VAE.pth` file from the published Wan2.2 TI2V checkpoint.
Its SHA-256 is `20eb789667fa5e60e7516bf509512f6cb61f01b0aa0695eadaea930c13892b36`.
[Published Wan2.2 VAE](https://huggingface.co/Wan-AI/Wan2.2-TI2V-5B/blob/main/Wan2.2_VAE.pth)

```bash
export HF_ROOT=/path/to/innata-checkpoints
export WAN_VAE=/path/to/Wan2.2_VAE.pth
export KIT=/path/to/chip-adaptation-v4
export RUN_ROOT="$(mktemp -d)"
export GPU=0
(cd "$KIT" && sha256sum -c SHA256SUMS)
printf '%s  %s\n' \
  20eb789667fa5e60e7516bf509512f6cb61f01b0aa0695eadaea930c13892b36 \
  "$WAN_VAE" | sha256sum -c -
```

### Start the Container

Run the examples with Bash on the H100 host. The container user maps to the
host user so the output directory is writable. The checkpoint, VAE and V4
request files must be readable by that user.

With the standard NVIDIA Container Toolkit, select the GPU using its host index.

```bash
gpu_args=(--gpus "device=$GPU" -e CUDA_VISIBLE_DEVICES=0)
```

On a host where Docker does not inject devices, use this Linux configuration
to bind the selected GPU and the host's NVIDIA driver libraries. This
configuration was used to qualify the image.

```bash
uuid=$(nvidia-smi -i "$GPU" --query-gpu=uuid --format=csv,noheader)
minor=$(awk -v target="$uuid" '
  /^GPU UUID:/ { current=$NF }
  /^Device Minor:/ && current == target { print $NF }
' /proc/driver/nvidia/gpus/*/information)
test -c "/dev/nvidia$minor"
runtime_paths=/opt/runtime/torch/lib:/opt/runtime/nvidia/cu13/lib:/opt/runtime/nvidia/cudnn/lib:/opt/runtime/nvidia/cusparselt/lib:/opt/runtime/nvidia/nccl/lib:/opt/runtime/nvidia/nvshmem/lib
gpu_args=(
  --device "/dev/nvidia$minor" --device /dev/nvidiactl
  --device /dev/nvidia-uvm --device /dev/nvidia-uvm-tools
  -e "CUDA_VISIBLE_DEVICES=$uuid" -e NVIDIA_VISIBLE_DEVICES=void
  -e "LD_LIBRARY_PATH=/usr/local/nvidia/lib64:$runtime_paths"
)
while read -r library location; do
  gpu_args+=(--mount "type=bind,source=$(readlink -f "$location"),target=/usr/local/nvidia/lib64/$library,readonly")
done < <(/sbin/ldconfig -p | awk '$1 ~ /^(libcuda\.so(\.1)?|libnvidia-(ml|ptxjitcompiler|allocator)\.so\.1|libnvidia-nvvm\.so\.[0-9]+)$/ && /x86-64/ && !seen[$1]++ { print $1, $NF }')
```

The same arguments apply to all four tasks.

```bash
common=(
  "${gpu_args[@]}" --ipc=host
  --user "$(id -u):$(id -g)" -e HOME=/tmp
  -e CUBLAS_WORKSPACE_CONFIG=:4096:8
  -e MASTER_ADDR=127.0.0.1 -e MASTER_PORT=29500
  --mount "type=bind,source=$HF_ROOT,target=/models,readonly"
  --mount "type=bind,source=$WAN_VAE,target=/vae/Wan2.2_VAE.pth,readonly"
  --mount "type=bind,source=$KIT,target=/v4,readonly"
  --mount "type=bind,source=$RUN_ROOT,target=/results"
)
docker run --rm --network none "${common[@]}" "$IMAGE" --help
```

### Start the Understanding Inference Server

The server loads the checkpoint once and accepts the image URLs used by V4.
The configured media root is the read-only request mount.

```bash
server=$(docker run --rm -d --network none "${common[@]}" \
  --entrypoint python "$IMAGE" -m serve_understanding \
  --checkpoint-path /models/Innata-0-Understanding \
  --media-root /v4/requests --host 127.0.0.1 --port 8000)

until docker exec "$server" curl -fsS http://127.0.0.1:8000/healthz; do
  docker inspect "$server" >/dev/null || break
  sleep 1
done

docker exec "$server" python /v4/scripts/bench_http.py understanding \
  --server-url http://127.0.0.1:8000 --output /results/understanding
docker exec "$server" python /v4/scripts/verify_outputs.py \
  understanding /results/understanding --strict
docker stop "$server"
```

### Run ACWM

This is the direct single-request CLI from §4 of the V4 report. The default
TorchInductor cache already contains the H100 tuning records used for strict
ACWM verification.

```bash
docker run --rm --network none "${common[@]}" "$IMAGE" \
  --checkpoint-path /models/Innata-0-ACWM \
  --vae-path /vae/Wan2.2_VAE.pth \
  -i /v4/requests/acwm/old-request.json -o /results/acwm-once \
  --use-torch-compile --compiled-region all --no-guardrails

docker run --rm --network none "${common[@]}" --entrypoint python "$IMAGE" \
  /v4/scripts/verify_outputs.py acwm /results/acwm-once/episode576__c000/vision.mp4 --strict
```

### Start the WAM Inference Server

Select the checkpoint and V4 task as a pair. Use `robodojo` with
`Innata-0-WAM-RoboDojo` or `robocasa` with `Innata-0-WAM-RoboCasa365`.

```bash
task=robodojo
checkpoint=Innata-0-WAM-RoboDojo
# task=robocasa
# checkpoint=Innata-0-WAM-RoboCasa365

server=$(docker run --rm -d --network none "${common[@]}" \
  --entrypoint python "$IMAGE" -m cosmos_framework.scripts.serve_release_wam \
  --checkpoint-path "/models/$checkpoint" --vae-path /vae/Wan2.2_VAE.pth \
  --output-dir "/results/outputs/$task" --host 127.0.0.1 --port 8000)

until docker exec "$server" curl -fsS http://127.0.0.1:8000/healthz; do
  docker inspect "$server" >/dev/null || break
  sleep 1
done

docker exec "$server" python /v4/scripts/bench_http.py "$task" \
  --server-url http://127.0.0.1:8000 --output "/results/$task"
docker exec "$server" python /v4/scripts/verify_outputs.py \
  "$task" "/results/$task" --strict
docker stop "$server"
```

## Service Invocation

While the Understanding server is running, send a text completion with the
same request schema used by the V4 client.

```bash
docker exec "$server" curl -fsS http://127.0.0.1:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"Innata-0-Understanding","messages":[{"role":"user","content":"Describe what you can help with in one sentence."}],"max_tokens":64,"temperature":0,"top_p":1,"seed":1}'
```

For the V4 visual questions, the client sends the images in their recorded
order alongside the prompt. WAM clients send the original request document
to `/generate`.

# Technical Overview

Torch-FL exposes `flagos` through PyTorch's accelerator APIs. This image uses
precompiled FlagGems hosts and NVIDIA kernels where the measured operator routes
select them. The active NVIDIA Triton launcher uses Triton 3.6.0. The image
includes FlagTree 0.7.0 as the pinned Torch-FL dependency. Packaging normalizes
Torch-FL build paths and refreshes the corresponding artifact checksums.

Understanding uses the public Transformers generation APIs. The small HTTP
service translates the V4 message format and returns token usage. ACWM and both
WAM variants use the InNata application's existing entry points.

# Contributing

Submit runtime issues or patches to the relevant upstream project.
[Torch-FL](https://github.com/flagos-ai/Torch-FL) · [InNata framework](https://github.com/baai-eai/innata-framework-inference)

# License

BAAI-original files marked Apache-2.0 are covered by Apache License 2.0.
Applicable NVIDIA Cosmos Framework material is covered by OpenMDW-1.1.
The image preserves the application's license files and notices under
`/opt/innata`. External checkpoints and runtime dependencies retain their
respective license terms.

