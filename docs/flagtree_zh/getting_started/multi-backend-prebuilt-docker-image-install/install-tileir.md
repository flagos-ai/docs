[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-tileir.html">英文版</a>|中文版]

## 💫 NVIDIA TileIR [tileir](https://github.com/flagos-ai/FlagTree/tree/main/third_party/tileir/)3.6

- 基于 Triton 3.6，x64
- 适用于 Hopper/Blackwell

### 1. 快速开始

#### 1.1 使用镜像（Hopper/Blackwell）

```shell
# 方案 A：docker pull（24.9GB）
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-py312-torch2.13.0a0_8145d630e8.nv26.06-cuda13.3-ubuntu24.04:202607-3.6-base
docker pull ${IMAGE}
# 方案 B：docker load（10GB）
IMAGE=flagtree-py312-torch2.13.0a0_8145d630e8.nv26.06-cuda13.3-ubuntu24.04:202607-3.6-base
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-py312-torch2.13.0a0_8145d630e8.nv26.06-cuda13.3-ubuntu24.04.202607-3.6-base.tar.gz
docker load -i flagtree-py312-torch2.13.0a0_8145d630e8.nv26.06-cuda13.3-ubuntu24.04.202607-3.6-base.tar.gz
```

该镜像也可用于 `nvidia` 后端。

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --net=host --uts=host --ipc=host --privileged \
    --ulimit stack=67108864 --ulimit memlock=-1 \
    --security-opt seccomp=unconfined \
    --gpus=all \
    -v /etc/localtime:/etc/localtime:ro \
    -v /data:/data -v /home:/home \
    -w /root --name ${CONTAINER} ${IMAGE} bash
docker exec -it ${CONTAINER} /bin/bash
```

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install flagtree===0.6.1+tileir3.6 $RES
```

### 2. 从源码构建

#### 2.1 安装 FlagTree 依赖项

如果网络连接可用，则无需安装依赖项，构建过程中会自动获取。

```shell
# 适用于 Triton 3.6
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install mlir $RES
```

关于 cuda-tile 应检出哪个 commit，请参考 https://github.com/flagos-ai/FlagTree/blob/main/python/setup_tools/utils/__init__.py

```shell
cd ${YOUR_CODE_DIR}/FlagTree/third_party/tileir/third_party
git clone https://github.com/NVIDIA/cuda-tile.git
```

#### 2.2 手动下载 Triton 依赖项

Triton 依赖项已在镜像中下载并安装完毕。
如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# 适用于 Triton 3.6（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.6.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.6.x-linux-x64.tar.gz
```

执行上述脚本后，原有的 ~/.triton 目录将被重命名，并创建一个新的 ~/.triton 目录用于存放预下载的包。
请注意，脚本执行过程中会提示手动确认。

#### 2.3 构建命令

```shell
cd ${YOUR_CODE_DIR}/FlagTree
git checkout main
export FLAGTREE_BACKEND=tileir
export CMAKE_BUILD_PARALLEL_LEVEL=32
export TRITON_PTXAS_PATH="$PWD/third_party/nvidia/backend/bin/ptxas"
export TRITON_PTXAS_BLACKWELL_PATH="$PWD/third_party/nvidia/backend/bin/ptxas-blackwell"
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [tileir3.6 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/tileir3.6-build-and-test.yml)
