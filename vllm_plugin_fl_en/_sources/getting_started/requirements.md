# Requirements

## Software Requirements

The following table summarizes the required software and the version supported by each release of vllm-plugin-FL:

| Requirement | v0.1.0 (vLLM 0.13.0) | v0.2.2 (vLLM 0.20.2) | v0.3.0 (vLLM 0.24.0) | Notes |
|-------------|----------------------|----------------------|----------------------|-------|
| Python | 3.10 - 3.13 | 3.10 - 3.13 | 3.10 - 3.13 | Required |
| PyTorch | >= 2.7.1 | >= 2.7.1 | >= 2.7.1 | Required |
| vLLM | 0.13.0 | 0.20.2 | 0.24.0 | From official release (NVIDIA) or source with `VLLM_TARGET_DEVICE=empty` (non-NVIDIA) |
| FlagGems | >= v5.0.0 | >= v5.0.0 | v5.3.4; >= v5.0.0 supported | Required for operator dispatch. The [installation](install.md) step pins `v5.3.4` (the version the upstream README installs) |
| FlagCX | v0.13.0 | v0.13.0 | v0.13.0 | Optional, for multi-chip communication |
| FlagTree | 0.4.0 | 0.4.0 | 0.7.0 | Built from the `0.7.0` release branch with the matching vendor backend (see the [installation](install.md) step) |

## Supported hardware platforms

The following table summarizes supported hardware and their verification status:

| Chip Vendor | Chip Model | v0.1.0 (vLLM 0.13.0) | v0.2.2 (vLLM 0.20.2) | v0.3.0 (vLLM 0.24.0) | Notes |
|-------------|------------|----------------------|----------------------|----------------------|-------|
| NVIDIA | — | Supported | Supported | Supported | |
| ARM64 CPU | — | — | — | Supported | CPU-only inference on ARM64 hosts |
| Ascend | 910c | Supported | — | Supported | Requires FlagTree and {ref}`eager execution <additional-setup-for-huawei-ascend>` |
| MetaX | MACA C550 | Supported | — | Supported | MetaX C550 adapted for vLLM 0.24.0 |
| T-Head | PPU | Supported | — | Supported | |
| Iluvatar | BI-V150 | Supported | — | Supported | BI-V150 adapted for vLLM 0.24.0; CUDA graph enabled |
| Moore Threads | MTT S5000 | Supported | — | Supported | MTT S5000 adapted for vLLM 0.24.0 |
| Tsingmicro | TX8110 | Merging | — | Supported | In progress upstream |
| Hygon DCU | BW1000 | Supported | Supported | Supported | Requires DTK container (see the [installation guide](install.md)) |
| Sunrise | S2 | Supported | — | Supported | |
| Enflame | S60 | — | — | Supported | Enflame GCU backend (`gcu`); see the installation guide for the container setup |
| Alibaba PPU | PPU | — | — | Supported | Empty-mode support; source build of the FlagTree PPU backend is still in progress |

## Supported models

In theory, vllm-plugin-FL can support all models available in vLLM if no unsupported operators are involved. The following models have been end-to-end verified:

| Model | Status | Example |
|-------|--------|---------|
| Qwen3.5-397B-A17B | Supported | [qwen3_5_offline_inference.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/examples/qwen3_5_offline_inference.py) |
| Qwen3-Next-80B-A3B | Supported | [qwen3_next_offline_inference.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/examples/qwen3_next_offline_inference.py) |
| Qwen3-4B | Supported | [offline_inference.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/examples/offline_inference.py) |
| MiniCPM-o 4.5 | Supported | [examples/minicpm/](https://github.com/flagos-ai/vllm-plugin-FL/tree/main/examples/minicpm) |
| GLM-5 | Supported | [glm_5_offline_inference.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/examples/glm_5_offline_inference.py) |
| Qwen3.5-35B-A3B | Supported | [qwen3_5_offline_inference.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/examples/qwen3_5_offline_inference.py) |
| BAAI/bge-m3 | Supported | [bge_m3.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/vllm_fl/models/bge_m3.py) |
| MiniMax-M2.7 | Supported | [minimax_m27_offline_inference.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/examples/minimax_m27_offline_inference.py) |
| Qwen3.6-35B-A3B | Supported | {ref}`Text + image inference/serving <run-a-serving-inference-task>` |
| Qwen3.6-27B | Supported | {ref}`Text + image inference/serving <run-a-serving-inference-task>` |
| Qwen2.5-1.5B | Supported | [Run an inference task](run-inference-task.md) |

For the dispatch API used by these models, see the [Dispatch API Reference](../reference/dispatch-api-reference.md). For the version each plugin branch pairs with, see the version table in the [installation guide](install.md).
