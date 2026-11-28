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

This image runs InNata-0 on Hygon DCU (HCU) using Torch-FL and the source
release's `torch.accelerator` entry points (`flagos` device). The image includes
the inference application, the Wan2.2 VAE, and the runtime dependencies. Mount
the four model checkpoints and the `chip-adaptation-v4` request package from the
host. One image covers all four checkpoints; only the checkpoint path and the
task argument change.

| Task | Interface | Inference backend |
|---|---|---|
| Understanding | `cosmos_framework.scripts.inference` CLI | Transformers 4.57.6, Qwen3-VL BF16, SDPA |
| ACWM | `cosmos_framework.scripts.inference` CLI | Torch-FL `flagos`, eager |
| RoboDojo and RoboCasa365 | `cosmos_framework.scripts.inference` CLI | Torch-FL `flagos`, dense joint attention |

The image is self-contained: `/opt/innata` holds the patched and editable-installed
source, the VAE, `run.sh`, and `verify_smoke.py`. A new container with no `/work`
mount passed the `understanding` and `acwm` smoke checks.

## Consistency Validation

The image passed all five chip-adaptation-v4 requests on hygon-19 using its
default Torch-FL `flagos` configuration with the SDPA attention backend and
`--no-use-torch-compile`. The V4 verifier reported the expected Understanding
answers, a 736×544 16 fps ACWM video, and finite 16×14 and 16×12 actions for
RoboDojo and RoboCasa365. The outputs are functionally identical to the H100
reference, not bit-identical: the remaining delta is FA3-versus-SDPA and bf16
kernel rounding.

## 中文快速说明

在 Linux x86_64 海光 DCU 主机加载镜像，挂载四份 InNata 权重和
`chip-adaptation-v4` 请求目录。四个任务都走
`cosmos_framework.scripts.inference` 原生 CLI，`COSMOS_DEVICE=flagos`、
`I4_ATTN_BACKENDS=sdpa`，并显式加 `--no-use-torch-compile`。每个任务使用一张
HCU，不要在同一张卡上并行多个推理进程。镜像内已带 Wan2.2 VAE 与全部源码补丁，
不需要另行准备 `/work`。运行进程绝对不能设置 `PYTHONPATH`。

# Evaluation Results

## Benchmark Result

The Hygon delivery uses the eager path, while the H100 reference used
`use_torch_compile=True`. The two are therefore not directly comparable on
latency. The tables below report the functional agreement against the H100 V4
reference and the measured single-card eager wall clock.

| V4 request | Hygon result | Agreement with H100 reference |
|---|---|---|
| Understanding BLINK | PASS, answer `B` | Same answer `B` |
| Understanding MMSI, nine frames | PASS, answer `B` | Same answer `B`; reason "one full loop, 32 s" |
| ACWM | PASS, 736×544, 73 frames, 16 fps | Mean RGB difference 0.446/255; 0.056% of pixels differ by more than 8; max 74 |
| RoboDojo | PASS, 16×14 | Metadata identical; native max 0.0090, mean 9.4e-4; normalized max 0.0093, mean 1.6e-3 |
| RoboCasa365 | PASS, 16×12 | Metadata identical; max 0.0544, mean 4.0e-3 |

Measured single-card eager wall clock, including checkpoint load and VAE encode:

| V4 request | Wall clock | Sampling detail |
|---|---:|---|
| Understanding BLINK | ~2 m 22 s | Model load dominates |
| Understanding MMSI, nine frames | +31 s over BLINK | Same resident model |
| ACWM | ~6 m 15 s | VAE encode ~3 m 33 s; 30 steps 1 m 57 s at 3.72 it/s |
| RoboDojo | ~5 m 45 s | 30 steps 28 s at 1.24 it/s |
| RoboCasa365 | ~5 m 56 s | 30 steps 41 s at 1.21 it/s |

The V4 package's §2.5 RoboCasa CFG single-card/dual-card comparison was not run:
`bench_robocasa_cfg.py` requires an NCCL process group, and this Torch-FL runtime
reports `torch.distributed.is_nccl_available() == False`. That item is a
performance comparison, not one of the five fixed requests.

# User Guide

## Environment Setup

### Host Environment

| Item | Validated configuration |
|---|---|
| GPU | Hygon DCU (HCU), 65 GiB per card, one card per inference process |
| Host | hygon-19, 8× HCU, cards 2–5 used |
| Host OS | Linux x86_64 |
| Container | Linux amd64, CPython 3.10.20 |
| DTK | DTK 6.3 (dtk2604), HIP 6.3 |
| PyTorch | 2.10.0 (`torch 2.10.0+cpu` with the image's `lib_dcu` 2.10.0+das) |
| Torch-FL | 0.1.0+dtk, prebuilt in the base image |
| FlagTree | 0.6.0 |
| FlagGems | 5.4.0rc2 |
| Attention | SDPA backend; Hygon has no FA3 binary |

## Operation Steps
### Download FlagOS Image
```bash
export IMAGE=harbor.baai.ac.cn/flagrelease-public/innata-0:flagos-hygon-20261126
export IMAGE_DIGEST=sha256:91f2ec015e95eac7a34c541fdf899523b6f44eda0fcef9b481054602724a90f5
docker pull harbor.baai.ac.cn/flagrelease-public/innata-0:flagos-hygon-20261126
```
- Registry digest `sha256:91f2ec015e95eac7a34c541fdf899523b6f44eda0fcef9b481054602724a90f5`
- Size 51.4 GB; the base layers are reused from
  `harbor.baai.ac.cn/flagrelease-public/qwen-image-2.1-hygon001-gems5.4.0-tree0.6.0-cxnone-pluginnone-vllmnone-sglangnone-sglangflnone-cp310-pt210-dtk2604-x64-6.3.30-v1.4.1a:jev-ocr-rm-2b`
- Only ~11.7 GB is a new layer
- InNata source 0.3.3 (`innata-flagos-h100-source.tar.gz`)
- The image contains the patched source at
  `/opt/innata/innata-framework-inference`, plus `/opt/innata/run.sh` and
  `/opt/innata/verify_smoke.py`


### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/Innata-0-BF16-hygon-FlagOS
```

Point `MODELS_ROOT` at the directory containing the four InNata checkpoint
snapshots under `innata/`. Point `KIT` at the unpacked `chip-adaptation-v4`
package. The image already contains `Wan2.2_VAE.pth`; the checksum below matches
the copy at `/opt/innata/weights/Wan2.2_VAE.pth`.

```text
$MODELS_ROOT/
  innata/
    Innata-0-Understanding/
    Innata-0-ACWM/
    Innata-0-WAM-RoboDojo/
    Innata-0-WAM-RoboCasa365/
```

The Wan2.2 VAE SHA-256 is
`20eb789667fa5e60e7516bf509512f6cb61f01b0aa0695eadaea930c13892b36`.
[Published Wan2.2 VAE](https://huggingface.co/Wan-AI/Wan2.2-TI2V-5B/blob/main/Wan2.2_VAE.pth)

```bash
export MODELS_ROOT=/public-flash/models
export KIT=/path/to/chip-adaptation-v4
export RUN_ROOT="$(mktemp -d)"
export HCU=2
(cd "$KIT" && sha256sum -c SHA256SUMS)
docker run --rm --entrypoint sha256sum "$IMAGE" \
  /opt/innata/weights/Wan2.2_VAE.pth
# Expect 20eb789667fa5e60e7516bf509512f6cb61f01b0aa0695eadaea930c13892b36
```

### Start the Container

The container needs the Hygon device nodes, the HAL mount, and the host user's
UID so the output directory is writable. The checkpoint and V4 request files must
be readable by that user.

```bash
common=(
  --device=/dev/kfd --device=/dev/dri
  --group-add video --cap-add=SYS_PTRACE --security-opt seccomp=unconfined
  --ipc host
  -e "HIP_VISIBLE_DEVICES=$HCU"
  -v /opt/hyhal:/opt/hyhal:ro
  --mount "type=bind,source=$MODELS_ROOT,target=/models,readonly"
  --mount "type=bind,source=$KIT,target=/v4,readonly"
  --mount "type=bind,source=$RUN_ROOT,target=/outputs"
)

container=$(docker run -d --network none --name innata-0 "${common[@]}" \
  "$IMAGE" sleep infinity)
```

The image's `run.sh` performs the same per-task setup. The remaining examples
invoke the CLI directly so that the V4 request files can be used unchanged.

### Run the Smoke Checks

```bash
for spec in "understanding Innata-0-Understanding" \
            "acwm Innata-0-ACWM" \
            "robodojo Innata-0-WAM-RoboDojo" \
            "robocasa Innata-0-WAM-RoboCasa365"; do
  set -- $spec
  docker exec "$container" /opt/innata/run.sh "$1" "$2"
  docker exec "$container" python /opt/innata/verify_smoke.py \
    "$1" "/outputs/$1/$1"
done
```

### Run the chip-adaptation-v4 Requests

Every fresh shell needs the DTK library path and the Torch-FL device variables.
`PYTHONPATH` must not be set: with a `PYTHONPATH` present, `flagos`
initialization fails with `Cannot initialize CUDA without ATen_cuda library`.

```bash
docker exec "$container" bash -lc '
  LIB=$(dirname "$(find /opt -name libgalaxyhip.so.5 2>/dev/null | head -1)")
  export LD_LIBRARY_PATH="$LIB:/opt/dtk/.hyhal/rocm_smi/lib:${LD_LIBRARY_PATH:-}"
  unset PYTHONPATH
  export COSMOS_DEVICE=flagos I4_ATTN_BACKENDS=sdpa

  run() {  # case request checkpoint [vae]
    python -m cosmos_framework.scripts.inference \
      -i "/v4/$2" -o "/outputs/v4-$1" \
      --checkpoint-path "/models/innata/$3" \
      --no-guardrails --no-use-torch-compile ${4:+--vae-path "$4"}
  }
  run understanding-blink requests/understanding/blink-image.json Innata-0-Understanding
  run understanding-mmsi  requests/understanding/mmsi-ordered-frames.json Innata-0-Understanding
  run acwm      requests/acwm/old-request.json Innata-0-ACWM \
                /opt/innata/weights/Wan2.2_VAE.pth
  run robodojo  requests/robodojo/request.json Innata-0-WAM-RoboDojo \
                /opt/innata/weights/Wan2.2_VAE.pth
  run robocasa  requests/robocasa/request.json Innata-0-WAM-RoboCasa365 \
                /opt/innata/weights/Wan2.2_VAE.pth
'
```

Verify the outputs with the package's own verifier. The Understanding answers are
compared against `reference/understanding.json`.

```bash
docker exec "$container" bash -lc \
  'python /v4/scripts/verify_outputs.py acwm /outputs/v4-acwm/*/vision.mp4'
docker exec "$container" bash -lc \
  'python /v4/scripts/verify_outputs.py robodojo /outputs/v4-robodojo/*'
docker exec "$container" bash -lc \
  'python /v4/scripts/verify_outputs.py robocasa /outputs/v4-robocasa/*'
```

The verifier runs without `--strict` because the reference was produced with
FA3 on a different device; shape, metadata and finiteness are the acceptance
criteria, and pixel/action deltas are reported rather than required to be zero.

## Service Invocation

This image does not ship vLLM and does not start an HTTP server. The
Understanding checkpoint runs in-process through the same CLI and consumes the
same request JSON as the V4 client. To serve it, run the CLI behind the caller's
process supervisor; the conversation input is the request document:

```bash
docker exec "$container" bash -lc '
  LIB=$(dirname "$(find /opt -name libgalaxyhip.so.5 2>/dev/null | head -1)")
  export LD_LIBRARY_PATH="$LIB:/opt/dtk/.hyhal/rocm_smi/lib:${LD_LIBRARY_PATH:-}"
  unset PYTHONPATH
  export COSMOS_DEVICE=flagos I4_ATTN_BACKENDS=sdpa
  python -m cosmos_framework.scripts.inference \
    -i /v4/requests/understanding/blink-image.json \
    -o /outputs/understanding-once \
    --checkpoint-path /models/innata/Innata-0-Understanding \
    --no-guardrails --no-use-torch-compile
'
```

# Technical Overview

Torch-FL exposes `flagos` through PyTorch's accelerator APIs. The image pins
torch_fl 0.1.0+dtk, FlagTree 0.6.0 and FlagGems 5.4.0rc2. Because Hygon has no
FA3 binary and no flagos FA2 kernel, the image adds an SDPA attention backend
with per-segment varlen attention and explicit GQA head expansion, selected via
`I4_ATTN_BACKENDS=sdpa`. `get_arch_tag()` maps the HIP platform to CUDA arch tag
90 so the attention frontend has a non-empty backend list. FlexAttention is
disabled on the `flagos` device and the WAM path falls back to dense joint
attention; the action tower switches to SDPA with a dense mask. `torch_fl` is
imported before `torch`; otherwise the DCU runtime does not activate. Device
moves that the upstream code expressed as `.cuda()` are redirected to
`flagos`, and tensor construction at the pack/sampler boundaries is wrapped so
mixed Python lists and zero-dimensional tensors do not fail on `flagos`.

Two artifacts capture the adaptation:

| Artifact | Scope |
|---|---|
| `patches/0002-innata-flagos-torchfl.patch` | Torch-FL `flagos` route, 21 files |
| `patches/0003-site-packages-fixups.py` | transformers Qwen3-VL rope index and FlagGems empty `mean_dim` |

Understanding uses the public Transformers generation
APIs; ACWM and both WAM variants use the InNata application's existing entry
points with `--no-use-torch-compile`, because the upstream default is `True` and
the varlen attention path is not dynamo/fake-tensor safe.

# Contributing

Submit runtime issues or patches to the relevant upstream project.
[Torch-FL](https://github.com/flagos-ai/Torch-FL) · [InNata framework](https://github.com/baai-eai/innata-framework-inference)

# License

BAAI-original files marked Apache-2.0 are covered by Apache License 2.0.
Applicable NVIDIA Cosmos Framework material is covered by OpenMDW-1.1.
The image preserves the application's license files and notices under
`/opt/innata`. External checkpoints and runtime dependencies retain their
respective license terms.

