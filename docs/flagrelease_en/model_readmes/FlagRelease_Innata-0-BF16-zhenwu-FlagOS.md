---
license: other
license_name: apache-2.0-and-openmdw-1.1
language:
- en
- zh
---

# Introduction
BAAI (Beijing Academy of Artificial Intelligence) releases **Innata-0**, a native embodied world system. Built on a unified multi-chip software stack, the FlagOS open community provides **Day0 cross-chip adaptation support** focusing on embodied understanding, action-conditioned world prediction and robotic action generation. This adaptation targets six platforms: NVIDIA, MetaX, Hygon, Ascend, Moore Threads and T-Head. It verifies model outputs and inference efficiency across various tasks to support the deployment and evaluation of embodied models on diverse computing hardware.

Centered on three core capabilities — planning, recovery and evolution — Innata-0 is built with co-design of models and agents. **Innata-0-WAM** adopts a three-tower Mixture-of-Transformers architecture to jointly model world understanding, visual prediction, as well as action and tactile generation. **Innata-0-Agent** is responsible for task planning, execution validation, error recovery and accumulation of reusable experience. In the official RoboCasa365 simulation benchmark, equipping the base WAM with the complete agent stack raises the overall task success rate from **60.2% to 65.4%**. For unseen compositional tasks, the success rate increases from **32.4% to 43.6%**. These results illustrate the value of combining model execution with agent-enabled planning, validation and recovery.

## Integrated Deployment

Run Innata-0 on a T-Head PPU host using the FlagOS image in Harbor. The image
provides the Innata runtime. Place model weights, request media and output
directories under `/mnt` so the container can access them.

| Checkpoint | Workload | Inputs |
| --- | --- | --- |
| Innata-0-Understanding | Image and video question answering | Checkpoint, request JSON and media |
| Innata-0-ACWM | Action-conditioned video prediction | Checkpoint, Wan2.2 VAE, request JSON and media |
| Innata-0-WAM-RoboDojo | Joint14 action prediction | Checkpoint, Wan2.2 VAE, request JSON and observations |
| Innata-0-WAM-RoboCasa365 | Control12 action prediction | Checkpoint, Wan2.2 VAE, request JSON and observations |

[Innata-0 project](https://baai-eai.github.io/innata-0/)

## 中文快速说明

在平头哥宿主机拉取镜像并启动 `innata` 容器。进入容器后选择已分配的
空闲 PPU，再运行对应模型。Understanding 和 ACWM 使用离线命令，
RoboDojo 和 RoboCasa365 由 V4 脚本启动本地服务并调用 `/generate`。

# User Guide

## Environment Setup

### Host Environment

| Item | Requirement |
| --- | --- |
| Accelerator | T-Head PPU with the host driver and `ppu-smi` available |
| Container engine | Docker and access to the Harbor repository |
| Device selection | One assigned PPU per inference process |
| Files under `/mnt` | Model weights, Wan2.2 VAE, request JSON and media, and a writable output directory |

## Operation Steps

### Download FlagOS Image

On the PPU host, log in to Harbor if required, then pull the image.

```bash
sudo docker pull harbor.baai.ac.cn/flagrelease-public/innata-ppu:20261127-rc3
```

### Download Open-source Model Weights

The existing shared checkpoint root is
`/mnt/cpfs/baai-ea/flagos/models/innata`. Use these commands on a download
host with the Hugging Face `hf` CLI when staging fresh snapshots. Keep the V4
request JSON and its relative media paths together.

```bash
set -e
: "${DOWNLOAD_ROOT:?Set DOWNLOAD_ROOT to a writable checkpoint directory}"

hf download BAAI/Innata-0-Understanding \
  --revision fcec27ecee6ab4577869b2446a04c0365e8eddb0 \
  --local-dir "$DOWNLOAD_ROOT/Innata-0-Understanding"
hf download BAAI/Innata-0-ACWM \
  --revision 3d3af9c349e540cac389999966b81dc4bd8602b7 \
  --local-dir "$DOWNLOAD_ROOT/Innata-0-ACWM"
hf download BAAI/Innata-0-WAM-RoboDojo \
  --revision 715659488c8a34ec519d966ad7f718082f948220 \
  --local-dir "$DOWNLOAD_ROOT/Innata-0-WAM-RoboDojo"
hf download BAAI/Innata-0-WAM-RoboCasa365 \
  --revision 2f2029175f87f4a90795ed46b526eab4966808d2 \
  --local-dir "$DOWNLOAD_ROOT/Innata-0-WAM-RoboCasa365"
hf download Wan-AI/Wan2.2-TI2V-5B Wan2.2_VAE.pth \
  --revision a6c3aa7fd09ab8990843d8c3fbb401cd9bce462c \
  --local-dir "$DOWNLOAD_ROOT/vae"

for model in Innata-0-{Understanding,ACWM,WAM-RoboDojo,WAM-RoboCasa365}; do
  (cd "$DOWNLOAD_ROOT/$model" && sha256sum -c SHA256SUMS)
done
printf '%s  %s\n' \
  20eb789667fa5e60e7516bf509512f6cb61f01b0aa0695eadaea930c13892b36 \
  "$DOWNLOAD_ROOT/vae/Wan2.2_VAE.pth" | sha256sum -c -
```

[Understanding checkpoint](https://huggingface.co/BAAI/Innata-0-Understanding/commit/fcec27ecee6ab4577869b2446a04c0365e8eddb0) ·
[Wan2.2 VAE file](https://huggingface.co/Wan-AI/Wan2.2-TI2V-5B/blob/a6c3aa7fd09ab8990843d8c3fbb401cd9bce462c/Wan2.2_VAE.pth)

### Start the Container

Run on the PPU host.

```bash
sudo docker run --privileged -dit \
-e HOST_HOSTNAME=$(hostname) \
--network=host \
--device=/dev/infiniband \
--ipc=host \
--device=/dev/alixpu_ctl \
--device=/dev/alixpu \
--ulimit memlock=-1 \
--ulimit stack=67108864 \
--init \
-v /mnt:/mnt \
-w /mnt/cpfs/baai-ea/flagos/jinghao \
--name innata \
harbor.baai.ac.cn/flagrelease-public/innata-ppu:20261127-rc3
```

Enter the container.

```bash
sudo docker exec -it innata /bin/bash
```

Run the remaining examples in this Bash session. Set `HF_ROOT` to the
checkpoint directory and `KIT` to the unpacked `chip-adaptation-v4` directory.
Keep each request JSON with its media files. The download commands above
produce the directory layout expected under `HF_ROOT`.

```bash
set -e
unset PYTHONPATH PYTHONHOME
export PY=/workspace/innata/venv/bin/python
export HF_ROOT=/mnt/cpfs/baai-ea/flagos/models/innata
export WAN_VAE="$HF_ROOT/vae/Wan2.2_VAE.pth"
export KIT=/mnt/cpfs/baai-ea/flagos/jinghao/innata/02-kit/chipv4/chip-adaptation-v4
export RUNS=/mnt/cpfs/baai-ea/flagos/jinghao/innata/04-runs
export COSMOS_DEVICE=cuda COSMOS_INTERNAL=0 COSMOS_TRAINING=0 HF_HUB_OFFLINE=1

read -r -p 'Assigned PPU index: ' GPU
[[ "$GPU" =~ ^[0-9]+$ ]]
export GPU CUDA_VISIBLE_DEVICES="$GPU"
ppu-smi -i "$GPU"
test -x "$PY"
test -d "$KIT/requests"
mkdir -p "$RUNS"
cd /opt/innata
```

Check that the selected physical card is available before running a request.
The selected card is visible to the inference process as `cuda:0`.

## Service Invocation

### Invocation Script (Offline Inference)

#### Understanding

Pass one or both request JSON files to the installed CLI. Each request writes
a `sample_outputs.json` containing the generated text.

```bash
OUT=$(mktemp -d "$RUNS/understanding.XXXXXXXX")
TORCH_DEVICE_BACKEND_AUTOLOAD=0 "$PY" -B -c \
  'import runpy; import torch_fl; runpy.run_module("cosmos_framework.scripts.inference", run_name="__main__", alter_sys=True)' \
  -i "$KIT/requests/understanding/blink-image.json" \
     "$KIT/requests/understanding/mmsi-ordered-frames.json" \
  -o "$OUT" --checkpoint-path "$HF_ROOT/Innata-0-Understanding"
```

#### ACWM

Run the fixed action-conditioned request with the Wan2.2 VAE. Open the
`vision.mp4` in the request output directory.

```bash
test -r "$WAN_VAE"
OUT=$(mktemp -d "$RUNS/acwm.XXXXXXXX")
TORCH_DEVICE_BACKEND_AUTOLOAD=1 "$PY" -B -m cosmos_framework.scripts.inference \
  --checkpoint-path "$HF_ROOT/Innata-0-ACWM" --vae-path "$WAN_VAE" \
  -i "$KIT/requests/acwm/old-request.json" -o "$OUT" \
  --use-torch-compile --compiled-region all --no-guardrails
```

### Invocation Script (WAM HTTP Replay)

The V4 script starts a local `serve_release_wam` service for each checkpoint,
sends its request to `/generate` and saves the response. Use the image's
`/opt/innata/compat` working directory for these two models to load the
FlashAttention 3 adapter. The NCCL settings below use loopback for the
single-card service.

```bash
(
  set -e
  test -r "$WAN_VAE"
  cd /opt/innata/compat
  export TORCH_DEVICE_BACKEND_AUTOLOAD=1 INNATA_WAM_COMPILE=0
  export NCCL_SOCKET_IFNAME=lo NCCL_IB_DISABLE=1
  OUT=$(mktemp -d "$RUNS/wam.XXXXXXXX")
  for task in robodojo robocasa; do
    "$PY" -B "$KIT/scripts/bench_http.py" "$task" --gpu "$GPU" \
      --checkpoint-root "$HF_ROOT" --vae-path "$WAN_VAE" --output "$OUT/$task"
  done
)
```

Open the response JSON in each task's output directory. RoboDojo returns
16 Joint14 actions and RoboCasa365 returns 16 Control12 actions.

[Request and output formats](https://github.com/baai-eai/innata-framework-inference/blob/4eaff7776f2b800aa2cb3d27787d66bf2cef56e7/docs/release-smoke.md)

# License

BAAI-original framework files marked Apache-2.0 use that license. Applicable
NVIDIA Cosmos material uses OpenMDW-1.1. Public checkpoints and runtime
dependencies retain their respective terms.

[Innata framework notices](https://github.com/baai-eai/innata-framework-inference/blob/4eaff7776f2b800aa2cb3d27787d66bf2cef56e7/NOTICE)
