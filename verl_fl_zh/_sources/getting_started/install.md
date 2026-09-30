# 快速安装

## Docker 镜像（推荐）

各平台提供预构建的 Docker 镜像：

| 平台 | 镜像 | 内容 |
|----------|-------|----------|
| NVIDIA（国际通用 GPU） | `harbor.baai.ac.cn/flagos21-release/verl-fl:v0.2.0-rc2-nvidia` | verl 0.7.0, torch 2.9.0+cu128, triton 3.5.0 |
| MetaX（C500/C550） | `harbor.baai.ac.cn/flagos21-release/verl-fl:v0.2.0-rc2-metax` | verl 0.7.0, torch 2.8.0+metax3.3.0.2, triton 3.0.0 |

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

## 源码安装

### 前置条件

请确保已安装所需的软件依赖。详见[环境要求](requirements.md)。

### 1. 安装 FlagCX（必需）

```bash
git clone https://github.com/flagos-ai/FlagCX.git
cd FlagCX
git submodule update --init --recursive
pip install . -v --no-build-isolation

# MetaX 平台：
# make USE_METAX=1
# cd plugin/torch/ && FLAGCX_ADAPTOR=metax pip install . --no-build-isolation

export FLAGCX_PATH=/workspace/FlagCX/
```

### 2. 安装 FlagGems（可选）

```bash
pip install -U scikit-build-core>=0.11 pybind11 ninja cmake
git clone https://github.com/flagos-ai/FlagGems.git
cd FlagGems
pip install --no-build-isolation -v .
```

### 3. 安装 vllm-plugin-FL（可选）

```bash
# 方式 A：从 PyPI 安装
pip install vllm-plugin-fl==0.1.0+vllm0.13.0 \
    --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple

# 方式 B：从源码安装
git clone --branch v0.1.0+vllm0.13.0 https://github.com/flagos-ai/vllm-plugin-FL.git
cd vllm-plugin-fl
pip install --no-build-isolation -v .
```

### 4. 安装 TransformerEngine-FL / Megatron-LM-FL（可选）

```bash
# TransformerEngine-FL
pip install transformer_engine==0.1.0+te2.9.0 \
    --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
# 或从源码安装：
git clone --branch v0.1.0+te2.9.0 https://github.com/flagos-ai/TransformerEngine-FL.git
cd TransformerEngine-FL
pip install --no-build-isolation -v .

# Megatron-LM-FL
pip install megatron_core==0.1.0+megatron0.15.0rc7 \
    --extra-index-url https://resource.flagos.net/repository/flagos-pypi-hosted/simple
# 或从源码安装：
git clone --branch v0.1.0+megatron0.15.0rc7 https://github.com/flagos-ai/Megatron-LM-FL.git
cd Megatron-LM-FL
pip install --no-build-isolation -v .
```

### 5. 安装 verl-FL

```bash
git clone --branch v0.2.0 https://github.com/flagos-ai/verl-FL.git
cd verl-FL
pip install --no-build-isolation -v -e .
```

NVIDIA、沐曦 MetaX 与 MUSA 异构平台的端到端 GRPO 训练流程请参见[平台抽象与多芯片训练](../user_guide/platform-abstraction.md)。
