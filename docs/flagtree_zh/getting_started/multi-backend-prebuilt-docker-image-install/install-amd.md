[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-amd.html">英文版</a>|中文版]

## 💫 AMD [amd](https://github.com/flagos-ai/FlagTree/tree/main/third_party/amd/)

- 基于 Triton 3.1/3.2/3.3/3.4/3.5/3.6/3.7/3.8，x64

### 1. 快速开始

#### 1.1 使用镜像（Triton 3.6）

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-amd-py312-torch2.11-rocm7.2.3-gfx1100-ubuntu22.04:202608-3.6-base
# 方案 A：docker pull（35.9GB）
docker pull ${IMAGE}
# 方案 B：docker load（12GB）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-amd-py312-torch2.11-rocm7.2.3-gfx1100-ubuntu22.04.202608-3.6-base.tar.gz
docker load -i flagtree-amd-py312-torch2.11-rocm7.2.3-gfx1100-ubuntu22.04.202608-3.6-base.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --net=host --uts=host --ipc=host --privileged \
    --ulimit stack=67108864 --ulimit memlock=-1 \
    --security-opt seccomp=unconfined \
    --device=/dev/kfd --device=/dev/dri \
    --cap-add=SYS_PTRACE -e YOLO_AUTOINSTALL=false \
    -v /etc/localtime:/etc/localtime:ro \
    -v /data:/data -v /home:/home \
    -w /root --name ${CONTAINER} ${IMAGE} bash
docker exec -it ${CONTAINER} /bin/bash
```

#### 1.2 免源码安装（Triton 3.6）

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install flagtree===0.7.0rc1+amd3.6 $RES
```

### 2. 从源码构建

#### 2.1 手动下载 LLVM

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
cd ${YOUR_LLVM_DOWNLOAD_DIR}
# 适用于 Triton 3.6（方案 A）
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-f6ded0be-ubuntu-x64.tar.gz
tar zxvf llvm-f6ded0be-ubuntu-x64.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-f6ded0be-ubuntu-x64
# 适用于所有版本
export LLVM_INCLUDE_DIRS=$LLVM_SYSPATH/include
export LLVM_LIBRARY_DIR=$LLVM_SYSPATH/lib
```

```shell
# 适用于 Triton 3.6（方案 B，推荐）
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install mlir $RES
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
export FLAGTREE_BACKEND=amd
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [amd3.6 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/amd3.6-build-and-test.yml)
