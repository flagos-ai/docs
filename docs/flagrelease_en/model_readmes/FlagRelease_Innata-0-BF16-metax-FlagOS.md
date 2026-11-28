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

Innata-0 on MetaX C550 uses Torch-FL and the native Innata offline inference
CLI. Each model was evaluated on one C550. The container-local runtime was
prepared for packaging under `/opt/innata`.

| Checkpoint | Workload | External inputs |
| --- | --- | --- |
| Innata-0-Understanding | Image and video question answering | Checkpoint, request JSON and media |
| Innata-0-ACWM | Action-conditioned video prediction | Checkpoint, Wan2.2 VAE, request JSON and media |
| Innata-0-WAM-RoboDojo | RoboDojo action prediction | Checkpoint, Wan2.2 VAE, request JSON and observations |
| Innata-0-WAM-RoboCasa365 | RoboCasa365 action prediction | Checkpoint, Wan2.2 VAE, request JSON and observations |

[Innata-0 project](https://baai-eai.github.io/innata-0/) ·
[BAAI on ModelScope](https://www.modelscope.cn/organization/BAAI)

## Consistency Validation

The staged `/opt/innata` runtime passed isolated import, CLI help and
configuration checks for all four checkpoints. The registry tag is listed
below. Its digest, fresh-image GPU validation and a persistent HTTP service
remain pending.

## 中文快速说明

Innata-0 四个 checkpoint 已在单张沐曦 C550 上完成相应适配验证。容器内离线推理入口为
`/opt/innata/bin/innata-infer`，权重、Wan2.2 VAE 和请求素材通过宿主机挂载提供。
Understanding 已通过两条固定请求的严格校验。ACWM 和两个 WAM 的数据为原采样调度的短步结果。

# Evaluation Results

## Validation Results

| V4 workload | Correctness check | Result |
| --- | --- | --- |
| Understanding BLINK, single image | Strict answer verification | Passed, answer B |
| Understanding MMSI, nine frames | Strict answer verification | Passed, answer B |
| ACWM | Intermediate latent comparison | Passed the configured error check |
| RoboDojo | Intermediate latent comparison | Passed the configured error check |
| RoboCasa365 | Intermediate latent finiteness | Passed for the tested baseline |

On November 27, 2026, the generation checks ran the first three steps of the
original 30-step schedule. Final video and action validation for those
configurations remains pending.

# User Guide

## Environment Setup

### Host Environment

| Item | Recorded configuration |
| --- | --- |
| Accelerator | MetaX C550, one device per workload |
| Driver and SDK | MetaX KMD 3.8.1, MACA 3.8.1.3 |
| Python and PyTorch | Python 3.12.3, PyTorch 2.10.0+cpu front end with the Torch-FL device runtime |
| Torch-FL and Transformers | Torch-FL `2.10.0+maca3.8.1.3`, Transformers 5.14.1 |
| Operator and compiler stack | FlagGems 5.4.0, FlagGems-vllm `0.3.0.dev1`, FlagTree `0.7.0.post2+metax3.6` |

The staged runtime installs Innata and its adapters under `/opt/innata`.
It uses the existing Torch-FL, FlagGems and FlagTree installations under
`/opt/torch-fl/venv` and contains one local installation of the adapted
FlagGems-vllm. Both `/opt` paths are required when packaging this runtime.

## Operation Steps

### Download FlagOS Image

Pull the Innata-0 MetaX image from Harbor on the MetaX host.

```bash
docker pull harbor.baai.ac.cn/flagrelease-public/innata-metax001-gems5.4.0-tree0.7.0-cxnone-pluginnone-vllmnone-sglangnone-sglangflnone-cp312-pt210-maca38-x64-3.8.1:202611270919
```

### Download Open-source Model Weights

Install the ModelScope CLI on a download host. Set `DOWNLOAD_ROOT` to a
directory for the checkpoint snapshots and VAE. Check the downloaded model
files against each repository's `SHA256SUMS` and the VAE against the expected
checksum.

```bash
set -e
: "${DOWNLOAD_ROOT:?Set DOWNLOAD_ROOT to a writable checkpoint directory}"

python3 -m pip install modelscope

modelscope download --model BAAI/Innata-0-Understanding \
  --local_dir "$DOWNLOAD_ROOT/Innata-0-Understanding"
modelscope download --model BAAI/Innata-0-ACWM \
  --local_dir "$DOWNLOAD_ROOT/Innata-0-ACWM"
modelscope download --model BAAI/Innata-0-WAM-RoboDojo \
  --local_dir "$DOWNLOAD_ROOT/Innata-0-WAM-RoboDojo"
modelscope download --model BAAI/Innata-0-WAM-RoboCasa365 \
  --local_dir "$DOWNLOAD_ROOT/Innata-0-WAM-RoboCasa365"
modelscope download --model Wan-AI/Wan2.2-TI2V-5B Wan2.2_VAE.pth \
  --local_dir "$DOWNLOAD_ROOT/vae"

for model in Innata-0-{Understanding,ACWM,WAM-RoboDojo,WAM-RoboCasa365}; do
  (cd "$DOWNLOAD_ROOT/$model" && sha256sum -c SHA256SUMS)
done
printf '%s  %s\n' \
  20eb789667fa5e60e7516bf509512f6cb61f01b0aa0695eadaea930c13892b36 \
  "$DOWNLOAD_ROOT/vae/Wan2.2_VAE.pth" | sha256sum -c -
```

[ModelScope CLI](https://github.com/modelscope/modelscope/blob/master/docs/source/command.md#download) ·
[Wan2.2-TI2V-5B on ModelScope](https://www.modelscope.cn/models/Wan-AI/Wan2.2-TI2V-5B)

### Start the Container

On the MetaX host, start the container with the device nodes and host
directories shown below. Keep each request JSON with its media and choose a
writable output directory.

```bash
docker run -itd \
    --name innata \
    --privileged \
    --ipc=host \
    --network=host \
    --shm-size 64g \
    --device /dev/dri:/dev/dri:rwm \
    --device /dev/mxcd:/dev/mxcd:rwm \
    -v /public-flash:/public-flash \
    -v /data:/data \
    -w /public-flash \
    harbor.baai.ac.cn/flagrelease-public/innata-metax001-gems5.4.0-tree0.7.0-cxnone-pluginnone-vllmnone-sglangnone-sglangflnone-cp312-pt210-maca38-x64-3.8.1:202611270919

docker exec -it innata /bin/bash
```

Check that the inference entry point is available inside the container.

```bash
cd /
env -u PYTHONPATH -u PYTHONHOME -u COSMOS_DEVICE \
  /opt/innata/bin/innata-infer --help
```

## Service Invocation

### Invocation Script (Offline Inference)

Use the Bash examples in the prepared container. Set `CHECKPOINT_DIR`,
`REQUEST_JSON` and `OUTPUT_DIR` to absolute paths for the model, request and a
fresh writable output directory. Set `COSMOS_DEVICE` to the logical index of
the assigned device. Use `flagos:0` when the runtime sees a single device.
The upstream examples document each checkpoint's request format. For the
bundled synthetic smoke fixtures, follow the upstream `--no-guardrails`
setting.
[Upstream request examples](https://github.com/baai-eai/innata-framework-inference/blob/main/docs/release-smoke.md#use-your-own-request)

For Understanding, supply the matching image or video question.

```bash
: "${COSMOS_DEVICE:?Set COSMOS_DEVICE to the assigned logical FlagOS device}"
export COSMOS_DEVICE
export TORCH_DEVICE_BACKEND_AUTOLOAD=0 HF_HUB_OFFLINE=1

/opt/innata/bin/innata-infer \
  --input-files "$REQUEST_JSON" \
  --output-dir "$OUTPUT_DIR" \
  --checkpoint-path "$CHECKPOINT_DIR"
```

For ACWM, RoboDojo or RoboCasa365, also set `WAN_VAE` to the local
`Wan2.2_VAE.pth` file. This example uses the sampling schedule in the normal
inference configuration.

```bash
: "${COSMOS_DEVICE:?Set COSMOS_DEVICE to the assigned logical FlagOS device}"
export COSMOS_DEVICE
export TORCH_DEVICE_BACKEND_AUTOLOAD=0 HF_HUB_OFFLINE=1

/opt/innata/bin/innata-infer \
  --input-files "$REQUEST_JSON" \
  --output-dir "$OUTPUT_DIR" \
  --checkpoint-path "$CHECKPOINT_DIR" \
  --vae-path "$WAN_VAE"
```

GPU execution of these commands from the staged runtime is pending fresh-image
validation. The current verification covers CLI availability, imports and
configuration parsing.

The native CLI writes `sample_outputs.json` in the request output directory.
For complete upstream smoke requests, the expected outputs are generated text
for Understanding, `vision.mp4` for ACWM, 16 Joint14 actions for RoboDojo and
16 Control12 actions for RoboCasa365.
[Output contracts](https://github.com/baai-eai/innata-framework-inference/blob/main/docs/release-smoke.md)

# Technical Overview

## Torch-FL and FlagGems

Torch-FL exposes the `flagos` device to PyTorch on MetaX. The Innata adapter
uses the FlagGems-vllm variable-length FlashAttention interface for compatible
BF16 shapes and layouts. Other inputs can use device attention or fall back to
CPU operators.

## FlagTree and Local Compilation

The local `torch.compile` path uses the FlagOS backend. ACWM's scoped
GEN hidden/Q RMSNorm optimization preserves the intermediate BF16 rounding.
The `compiled_region=all` experiment built the vision and action encoder
graphs and stopped in Dynamo on the first decoder's attention path. Full
decoder graph coverage is pending.

# Contributing

For a runtime issue, include the checkpoint, request type, device, component
versions and a minimal reproducible trace.
[Innata Framework Inference](https://github.com/baai-eai/innata-framework-inference/issues) ·
[Torch-FL](https://github.com/flagos-ai/Torch-FL/issues)

# License

BAAI-original framework files marked Apache-2.0 use that license. Retained and
adapted NVIDIA Cosmos material uses OpenMDW-1.1 where indicated. The public
checkpoint artifacts and runtime dependencies retain their respective terms.
[Innata framework notices](https://github.com/baai-eai/innata-framework-inference/blob/main/NOTICE) ·
[BAAI model cards on ModelScope](https://www.modelscope.cn/organization/BAAI)
