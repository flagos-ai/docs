# Install FlagScale

Read [Requirements](requirements.md) before proceeding.

## Setup

### 1. Select the image

FlagScale is installed from a pre-built Docker image. The supported versions and hardware platforms are listed in [Requirements](requirements.md).

Go to the [FlagOS main page](https://flagos.io/Home), click **Download** in the middle of the page, and select the Docker image for your hardware and workload:

| Workload | Image |
|----------|-------|
| Inference / Serving | flagscale-inference |
| Training | flagscale-train |
| Reinforcement learning | flagscale-train |

Start the container, then install the components for your workload in it.

### 2. Install the components in the container

#### Inference / Serving backend

vLLM:

```{code-block} shell
pip install vllm==0.13.0
```

vLLM-plugin-FL:

```{code-block} shell
pip install vllm-plugin-fl==0.1.0+vllm0.13.0 --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
```

See more details in [vllm-plugin-FL](https://github.com/flagos-ai/vllm-plugin-FL).

FlagGems:

```{code-block} shell
pip install -U scikit-build-core==0.11 pybind11 ninja cmake
git clone https://github.com/flagos-ai/FlagGems
cd FlagGems
pip install --no-build-isolation .
```

See more details in [FlagGems](https://github.com/flagos-ai/FlagGems).

#### Training backend

Megatron-LM-FL:

```{code-block} shell
pip install megatron_core==0.1.0+megatron0.15.0rc7 --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
```

See more details in [Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL).

TransformerEngine-FL:

```{code-block} shell
pip install transformer_engine==0.1.0+te2.9.0 --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
```

See more details in [TransformerEngine-FL](https://github.com/flagos-ai/TransformerEngine-FL).

#### RL backend

verl-FL:

```{code-block} shell
pip install verl==0.1.0+verl0.7.0 --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
```

See more details in [veRL-FL](https://github.com/flagos-ai/verl-FL.git) to get full installation instructions.

### 3. Install FlagScale

**Option 1: Install via pip**

```{code-block} shell
pip install flagscale --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
```

**Option 2: Install from source**

```{code-block} shell
git clone https://github.com/flagos-ai/FlagScale.git
cd FlagScale
pip install .
```

### 4. Non-NVIDIA platforms

On MetaX, Hygon, Ascend, and T-Head PPU, select the platform image from the [FlagOS main page](https://flagos.io/Home), and install Megatron-LM-FL and TransformerEngine-FL from source at the matching released version.

| Platform | FlagTree backend | Visible-devices env |
|----------|------------------|---------------------|
| MetaX | `metax` | `MACA_VISIBLE_DEVICES` |
| Hygon | `hcu` | `HIP_VISIBLE_DEVICES` |
| Ascend | `ascend` | `ASCEND_RT_VISIBLE_DEVICES` |
| T-Head PPU | `ppu` | `CUDA_VISIBLE_DEVICES` |

```{code-block} shell
cd /workspace/Megatron-LM-FL && git checkout v0.3.0 && pip install . --no-build-isolation --root-user-action=ignore
cd /workspace/TransformerEngine-FL && git checkout v0.3.0
TE_FL_SKIP_CUDA=1 MAX_JOBS=64 pip install -v . --no-build-isolation --root-user-action=ignore
cd /workspace/FlagScale && git checkout v2.1.0 && pip install . --no-build-isolation
```

```{note}
`TE_FL_SKIP_CUDA=1` is mandatory on non-NVIDIA platforms — without it the build tries to compile the CUDA kernels and fails.
```

For the full procedure, including the FlagTree and FlagGems operator stack and the platform-specific issues, see [Multi-Platform Training and Testing](multi-platform-training.md).
