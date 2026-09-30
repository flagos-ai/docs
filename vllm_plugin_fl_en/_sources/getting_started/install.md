# Install software for running an inference task

## Install from docker image

vllm-plugin-FL is installed from a pre-built Docker image. The supported versions and hardware platforms are listed in [Requirements](requirements.md).

1. Select the image

Go to the [FlagOS main page](https://flagos.io/Home), click **Download** in the middle of the page, and select the Docker image for your hardware.

2. Install the components in the container

(version-compatibility)=
Pick the branch that matches your vLLM version; the branch and the vLLM version must stay paired:

| vllm-plugin-FL branch | Community vLLM version |
|-----------------------|------------------------|
| `release/0.2` | [v0.20.2](https://github.com/vllm-project/vllm/tree/v0.20.2) |
| `main` | [v0.24.0](https://github.com/vllm-project/vllm/tree/v0.24.0) |

2.1 Install vLLM

For **NVIDIA** GPUs, install vLLM from the official [v0.24.0](https://github.com/vllm-project/vllm/tree/v0.24.0) release (optional if the correct version is already installed):

```{code-block} shell
pip install vllm==0.24.0
```

For **non-NVIDIA** chips, install vLLM from source with the `empty` device target:

```{code-block} shell
git clone -b v0.24.0 https://github.com/vllm-project/vllm.git
cd vllm
VLLM_TARGET_DEVICE=empty pip install -v --no-build-isolation --no-deps .
```

For vLLM 0.20.2, use `v0.20.2` instead of `v0.24.0` in both commands above (see {ref}`Version compatibility <version-compatibility>`).

2.2 Install vllm-plugin-FL

Clone the repository, using the branch that matches your vLLM version (see {ref}`Version compatibility <version-compatibility>`):

```{code-block} shell
git clone -b main https://github.com/flagos-ai/vllm-plugin-FL
cd vllm-plugin-FL
# for vLLM 0.20.2, use: git clone -b release/0.2 https://github.com/flagos-ai/vllm-plugin-FL
```

Install it. By default vllm-plugin-FL installs as a Python-only package:

```{code-block} shell
pip install --no-build-isolation .
# or editable install
pip install --no-build-isolation -e .
```

For CUDA-like devices, including CUDA and HIP/ROCm environments that use PyTorch's CUDA dispatch key, build the plugin native extension by setting `VLLM_VENDOR=cuda` during installation:

```{code-block} shell
VLLM_VENDOR=cuda pip install --no-build-isolation .
# or editable install
VLLM_VENDOR=cuda pip install --no-build-isolation -e .
```

This builds and installs `vllm_fl._C`, which provides native C++ support required by some graph/custom-op paths, especially when vLLM is installed with `VLLM_TARGET_DEVICE=empty`. If `VLLM_VENDOR` is not set, vllm-plugin-FL is installed as a Python-only plugin and the native extension is skipped.

2.3 Install [FlagGems](https://flagos-ai.github.io/FlagGems/getting-started/install/)

Install build dependencies

```{code-block} shell
pip install -U scikit-build-core==0.11 pybind11 ninja cmake
```

Install FlagGems:

```{code-block} shell
git clone -b v5.3.4 https://github.com/flagos-ai/FlagGems
cd FlagGems
pip install --no-build-isolation .
# or editable install
pip install --no-build-isolation -e .
```

```{note}
On Sunrise platform, depends on FlagGems [PR #2949](https://github.com/flagos-ai/FlagGems/pull/2949).
On Hygon platform, depends on FlagGems [PR #3477](https://github.com/flagos-ai/FlagGems/pull/3477).
```

2.4 (Optional) Install [FlagCX](https://github.com/flagos-ai/FlagCX/blob/main/docs/getting_started.md#build-and-installation)

Clone the repository:

```{code-block} shell
git clone -b v0.13.0 https://github.com/flagos-ai/FlagCX.git
cd FlagCX
git submodule update --init --recursive
```

Build the library with different flags targeting to different platforms:

```{code-block} shell
make USE_NVIDIA=1
```

Set environment:

```{code-block} shell
export FLAGCX_PATH="$PWD"
```

Install FlagCX:

```{code-block} shell
cd plugin/torch/
FLAGCX_ADAPTOR=[xxx] pip install . --no-build-isolation
# or editable install
FLAGCX_ADAPTOR=[xxx] pip install -e . --no-build-isolation
```

```{note}
[xxx] should be selected according to the current platform, e.g., nvidia, ascend, etc.
```

If there are multiple plugins in the current environment, you can select vllm-plugin-fl with VLLM_PLUGINS='fl'.

(additional-setup-for-huawei-ascend)=
### Additional setup for Huawei Ascend

1. Install [FlagTree](https://resource.flagos.net)

    ```{code-block} shell
    RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple --trusted-host=https://resource.flagos.net"
    python3 -m pip install flagtree==0.7.0+ascend3.5 $RES
    ```

    For other chips, use the matching FlagTree build (e.g., `flagtree==0.7.0+iluvatar3.6`, `flagtree==0.7.0+metax3.6`).

2. Set required environment variable

    ```{code-block} shell
    export TRITON_ALL_BLOCKS_PARALLEL=1
    ```

3. Enable eager execution

    Ascend requires eager execution. Add `enforce_eager=True` to the `LLM` constructor or pass `--enforce-eager` on the command line.

### Additional setup for CUDA

This section illustrates how to run an inference task with CUDA through setting environment variables.

For operator dispatch environment variables, see {ref}`Environment variables <environment-variables>`.

#### Use CUDA communication library

```{code-block} shell
unset FLAGCX_PATH
```

#### Use native CUDA operators

If you want to use the original CUDA operators, you can set the following environment variables.

```{code-block} shell
export USE_FLAGGEMS=0
```

### Dispatch operators

If needed, you can also dispatch operators.

For concept related information, see [vllm-plugin-FL Overview](../overview/overview.md).
For configuration related information, see [Operator dispatch user guide](../dispatch_user_guide/dispatch-user-guide.md).

After installation and optional operator dispatch configuration, you can proceed to [Run an inference task](run-inference-task.md).
