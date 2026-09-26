# Install Megatron-LM-FL

You can install Megatron-LM-FL through one of the following methods:

## Docker (Recommended)

Megatron-LM-FL runs in a pre-built Docker image. Go to the [FlagOS main page](https://flagos.io/Home), pick the image for your hardware from the download list in the middle of the page, and follow the on-page instructions to pull the image, enter the container, and start it.

### CUDA

After entering the container, activate the environment and install FlashAttention:

```bash
conda activate flagscale-train
pip install flash-attn==2.8.3 --no-build-isolation
```

## Install from source

```bash
git clone https://github.com/flagos-ai/Megatron-LM-FL.git
cd Megatron-LM-FL
git checkout <tag number>
pip install . --no-build-isolation --root-user-action=ignore
```

## Non-NVIDIA platforms

Megatron-LM-FL v0.3.0 has been validated on MetaX, Hygon, Ascend, and T-Head PPU. Install the image for your platform from the [FlagOS main page](https://flagos.io/Home) download list, then install from source at the matching tag:

| Platform | Device check | Visible-devices env | FlagTree backend |
|----------|--------------|---------------------|------------------|
| MetaX | `mx-smi` | `MACA_VISIBLE_DEVICES` | `metax` |
| Hygon | `hy-smi` | `HIP_VISIBLE_DEVICES` | `hcu` |
| Ascend | `npu-smi info` | `ASCEND_RT_VISIBLE_DEVICES` | `ascend` |
| T-Head PPU | `ppu-smi` | `CUDA_VISIBLE_DEVICES` | `ppu` |

```bash
cd /workspace/Megatron-LM-FL
git checkout v0.3.0
pip install . --no-build-isolation --root-user-action=ignore

pip list | grep megatron
megatron-core                            0.18.2+c8fa61f2e
```

```{note}
Hygon requires `source /opt/dtk/env.sh` before installing or running.
```

For an end-to-end training workflow using Megatron-LM-FL, TransformerEngine-FL, and FlagScale, see [End-to-End Use Case](https://docs.flagos.io/projects/TransformerEngine-FL/en/latest/user_guide/e2e-use-case.html) and [Multi-Platform Training and Testing](../user_guide/multi-platform-training.md).
