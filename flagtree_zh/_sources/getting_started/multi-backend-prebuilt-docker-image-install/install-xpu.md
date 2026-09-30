[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-xpu.html">英文版</a>|中文版]

## 💫 KLX [xpu](https://github.com/flagos-ai/FlagTree/tree/main/third_party/xpu/)3.6

- 基于 Triton 3.6，x64
- 适用于 P800

### 1. 快速开始

#### 1.1 使用镜像（P800）

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-xpu3.6-py310-torch2.9.0-ubuntu22.04:202608-base
# 方案 A：docker pull（59.9GB）
docker pull ${IMAGE}
# 方案 B：docker load（32GB）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-xpu3.6-py310-torch2.9.0-ubuntu22.04.202608-base.tar.gz
docker load -i flagtree-xpu3.6-py310-torch2.9.0-ubuntu22.04.202608-base.tar.gz
```

```shell
# 宿主机
xpu-smi  # Driver Version: 5.0.21.47

CONTAINER=flagtree-dev-xxx
docker run -dit \
    --net=host --privileged \
    --ulimit stack=67108864 --ulimit memlock=-1 \
    --ulimit nofile=120000 --shm-size=256g \
    --group-add video --cap-add=SYS_PTRACE --cap-add=SYS_ADMIN \
    --security-opt seccomp=unconfined \
    --device=/dev/xpu0:/dev/xpu0 --device=/dev/xpu1:/dev/xpu1 \
    --device=/dev/xpu2:/dev/xpu2 --device=/dev/xpu3:/dev/xpu3 \
    --device=/dev/xpu4:/dev/xpu4 --device=/dev/xpu5:/dev/xpu5 \
    --device=/dev/xpu6:/dev/xpu6 --device=/dev/xpu7:/dev/xpu7 \
    --device=/dev/xpuctrl:/dev/xpuctrl --device /dev/fuse \
    -v /etc/localtime:/etc/localtime:ro \
    -v /data:/data -v /home:/home \
    -w /root --name ${CONTAINER} ${IMAGE} bash
docker exec -it ${CONTAINER} /bin/bash

# 容器
xpu-smi  # Driver Version: 515.58
python3 -m pip show pybind11  # Should be 3.0.1
```

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.10 -m pip install flagtree===0.7.0rc3+xpu3.6 $RES
```

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/xpu; cd ~/.flagtree/xpu
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/xre-Linux-x86_64_v0.3.0.tar.gz
tar zxvf xre-Linux-x86_64_v0.3.0.tar.gz
wget https://klx-sdk-release-public.su.bcebos.com/XTriton/xpu-device-libs-ubuntu-x64_v0.3.6.1.1.tar.gz
tar zxvf xpu-device-libs-ubuntu-x64_v0.3.6.1.1.tar.gz
wget https://klx-sdk-release-public.su.bcebos.com/XTriton/xpu-sdnn-objects_v0.3.6.8.1.tar.gz
tar zxvf xpu-sdnn-objects_v0.3.6.8.1.tar.gz
wget https://klx-sdk-release-public.su.bcebos.com/XTriton/xpu-runtime-so_v0.3.6.2.0.tar.gz
tar zxvf xpu-runtime-so_v0.3.6.2.0.tar.gz
mkdir llvm_trust
wget https://klx-sdk-release-public.su.bcebos.com/XTriton/llvm22/20260615/xtdk-llvm22-ubuntu2004_x86_64.tar.gz
tar zxvf xtdk-llvm22-ubuntu2004_x86_64.tar.gz -C llvm_trust --strip-components=1
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
export FLAGTREE_BACKEND=xpu
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

测试前需执行 `export XPU_EVENT_KL3_ENABLE=1`

参考 [xpu3.6 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/xpu3.6-build-and-test.yml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 KLX [xpu](https://github.com/flagos-ai/FlagTree/tree/triton_v3.1.x/third_party/xpu/)3.0

- 基于 Triton 3.0，x64
- 适用于 P800

### 1. 快速开始

#### 1.1 使用镜像（P800）

```shell
# 方案 A：docker pull（44.9GB）
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-xpu-py310-torch2.5.1-ubuntu20.04:202604-base
docker pull ${IMAGE}
# 方案 B：docker load（21GB）
IMAGE=flagtree-xpu-py310-torch2.5.1-ubuntu20.04:202604-base
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-xpu-py310-torch2.5.1-ubuntu20.04.202604-base.tar.gz
docker load -i flagtree-xpu-py310-torch2.5.1-ubuntu20.04.202604-base.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --net=host --privileged \
    --ulimit stack=67108864 --ulimit memlock=-1 \
    --ulimit nofile=120000 --shm-size=256g \
    --group-add video --cap-add=SYS_PTRACE --cap-add=SYS_ADMIN \
    --security-opt seccomp=unconfined \
    --device=/dev/xpu0:/dev/xpu0 --device=/dev/xpu1:/dev/xpu1 \
    --device=/dev/xpu2:/dev/xpu2 --device=/dev/xpu3:/dev/xpu3 \
    --device=/dev/xpu4:/dev/xpu4 --device=/dev/xpu5:/dev/xpu5 \
    --device=/dev/xpu6:/dev/xpu6 --device=/dev/xpu7:/dev/xpu7 \
    --device=/dev/xpuctrl:/dev/xpuctrl --device /dev/fuse \
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
python3.10 -m pip install flagtree===0.5.1+xpu3.0 $RES
```

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/xpu; cd ~/.flagtree/xpu
wget https://klx-sdk-release-public.su.bcebos.com/v1/triton/flaggems/2025_4_season/llvm/20260304/XTDK-llvm19-ubuntu2004_x86_64.tar.gz
tar zxvf XTDK-llvm19-ubuntu2004_x86_64.tar.gz
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/xre-Linux-x86_64_v0.3.0.tar.gz
tar zxvf xre-Linux-x86_64_v0.3.0.tar.gz
wget https://klx-sdk-release-public.su.bcebos.com/XTriton/xpu-device-libs-ubuntu-x64_v0.3.6.1.1.tar.gz
tar zxvf xpu-device-libs-ubuntu-x64_v0.3.6.1.1.tar.gz
```

#### 2.2 手动下载 Triton 依赖项

Triton 依赖项已在镜像中下载并安装完毕。
如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# 适用于 Triton 3.1（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.1.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.1.x-linux-x64.tar.gz
```

执行上述脚本后，原有的 ~/.triton 目录将被重命名，并创建一个新的 ~/.triton 目录用于存放预下载的包。
请注意，脚本执行过程中会提示手动确认。

#### 2.3 构建命令

```shell
cd ${YOUR_CODE_DIR}/FlagTree/python
git checkout -b triton_v3.1.x origin/triton_v3.1.x
export FLAGTREE_BACKEND=xpu
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

测试前需执行 `export XPU_EVENT_KL3_ENABLE=1`

参考 [xpu3.0 后端测试](https://github.com/flagos-ai/FlagTree/blob/triton_v3.1.x/.github/workflows/xpu3.0-build-and-test.yml)
