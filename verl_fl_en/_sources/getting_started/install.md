# Quick Setup

## Docker Images (Recommended)

Pre-built Docker images are available for each platform:

| Platform | Image | Contents |
|----------|-------|----------|
| NVIDIA (international GPU) | `harbor.baai.ac.cn/flagos21-release/verl-fl:v0.2.0-rc2-nvidia` | verl 0.7.0, torch 2.9.0+cu128, triton 3.5.0 |
| MetaX (C500/C550) | `harbor.baai.ac.cn/flagos21-release/verl-fl:v0.2.0-rc2-metax` | verl 0.7.0, torch 2.8.0+metax3.3.0.2, triton 3.0.0 |

### NVIDIA

```bash
docker pull harbor.baai.ac.cn/flagos21-release/verl-fl:v0.2.0-rc2-nvidia

docker_image=harbor.baai.ac.cn/flagos21-release/verl-fl:v0.2.0-rc2-nvidia
docker_name=verl_test
sudo docker run -itd \
    --name ${docker_name} \
    --privileged \
    --network=host \
    --ipc=host \
    --device=/dev/infiniband \
    --pid=host \
    --cap-add=ALL \
    --shm-size 512G \
    --ulimit memlock=-1 \
    --gpus all \
    -v /dev/:/dev/ \
    -v /usr/src/:/usr/src/ \
    -v /lib/modules/:/lib/modules/ \
    -w /workspace \
    ${docker_image} \
    /bin/bash

docker exec -it verl_test bash
```

### MetaX

```bash
docker pull harbor.baai.ac.cn/flagos21-release/verl-fl:v0.2.0-rc2-metax

docker_image=harbor.baai.ac.cn/flagos21-release/verl-fl:v0.2.0-rc2-metax
docker run -d -t --net=host --uts=host --ipc=host --privileged=true \
  --group-add video --shm-size 100gb --ulimit memlock=-1 \
  --security-opt seccomp=unconfined --security-opt apparmor=unconfined \
  --device=/dev/dri --device=/dev/mxcd --device=/dev/infiniband \
  -v /nfs/dh:/nfs/dh --name verl_fl_test \
  ${docker_image} bash

docker exec -it verl_fl_test bash
```

## Install from Source

### Prerequisites

Ensure you have the required software dependencies installed. See [Requirements](requirements.md) for details.

### 1. Install FlagCX (Required)

```bash
git clone https://github.com/flagos-ai/FlagCX.git
cd FlagCX
git submodule update --init --recursive
pip install . -v --no-build-isolation

# For MetaX:
# make USE_METAX=1
# cd plugin/torch/ && FLAGCX_ADAPTOR=metax pip install . --no-build-isolation

export FLAGCX_PATH=/workspace/FlagCX/
```

### 2. Install FlagGems (Optional)

```bash
pip install -U scikit-build-core>=0.11 pybind11 ninja cmake
git clone https://github.com/flagos-ai/FlagGems.git
cd FlagGems
pip install --no-build-isolation -v .
```

### 3. Install vllm-plugin-FL (Optional)

```bash
# Option A: Install from PyPI
pip install vllm-plugin-fl==0.1.0+vllm0.13.0 \
    --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple

# Option B: Install from source
git clone --branch v0.1.0+vllm0.13.0 https://github.com/flagos-ai/vllm-plugin-FL.git
cd vllm-plugin-fl
pip install --no-build-isolation -v .
```

### 4. Install TransformerEngine-FL / Megatron-LM-FL (Optional)

```bash
# TransformerEngine-FL
pip install transformer_engine==0.1.0+te2.9.0 \
    --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
# Or from source:
git clone --branch v0.1.0+te2.9.0 https://github.com/flagos-ai/TransformerEngine-FL.git
cd TransformerEngine-FL
pip install --no-build-isolation -v .

# Megatron-LM-FL
pip install megatron_core==0.1.0+megatron0.15.0rc7 \
    --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
# Or from source:
git clone --branch v0.1.0+megatron0.15.0rc7 https://github.com/flagos-ai/Megatron-LM-FL.git
cd Megatron-LM-FL
pip install --no-build-isolation -v .
```

### 5. Install verl-FL

```bash
git clone --branch v0.2.0 https://github.com/flagos-ai/verl-FL.git
cd verl-FL
pip install --no-build-isolation -v -e .
```

For end-to-end GRPO training workflows across NVIDIA, MetaX, and heterogeneous MUSA platforms, see [Platform Abstraction and Multi-Chip Training](../user_guide/platform-abstraction.md).
