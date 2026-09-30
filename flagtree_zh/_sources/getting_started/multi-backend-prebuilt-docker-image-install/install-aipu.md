[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-aipu.html">英文版</a>|中文版]

## 💫 ARM China（安谋科技）[aipu](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/aipu/)3.3

- 基于 Triton 3.3，x64/arm64

### 1. 快速开始

#### 1.1 使用预装镜像（x64 CPU 模拟环境）

如果使用此预装镜像，则无需执行后续安装步骤。

```shell
# 方案 A：docker pull（36.9GB）
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-aipu-py310-torch2.6.0-clang16-lld16-ubuntu22.04:202603
docker pull ${IMAGE}
# 方案 B：docker load（17GB）
IMAGE=flagtree-aipu-py310-torch2.6.0-clang16-lld16-ubuntu22.04:202603
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-aipu-py310-torch2.6.0-clang16-lld16-ubuntu22.04.202603.tar.gz
docker load -i flagtree-aipu-py310-torch2.6.0-clang16-lld16-ubuntu22.04.202603.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --net=host --uts=host --ipc=host --privileged \
    --shm-size 100gb --ulimit memlock=-1 \
    --security-opt seccomp=unconfined --security-opt apparmor=unconfined \
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
python3.10 -m pip install flagtree===0.5.0+aipu3.3 $RES
```

预装镜像中已安装 `flagtree`。

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/aipu; cd ~/.flagtree/aipu
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/llvm-a66376b0-ubuntu-x64-clang16-lld16_v0.4.0.tar.gz
tar zxvf llvm-a66376b0-ubuntu-x64-clang16-lld16_v0.4.0.tar.gz
```

#### 2.2 手动下载 Triton 依赖项

Triton 依赖项已在预装镜像中下载并安装完毕。
如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# 适用于 Triton 3.3（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.3.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.3.x-linux-x64.tar.gz
```

执行上述脚本后，原有的 ~/.triton 目录将被重命名，并创建一个新的 ~/.triton 目录用于存放预下载的包。
请注意，脚本执行过程中会提示手动确认。

#### 2.3 构建命令

构建前需执行 `source ~/env_setup.sh`，该脚本内容如下：

```bash
SDK_PATH=~/AI610-SDK-dev-4.0.7
export PATH=${PATH}:${SDK_PATH}/AI610-SDK-1002/simulator/bin:${SDK_PATH}/AI100-SDK-0006/opencl-tool-chain/compiler/aipu_opencl_toolchain/bin
export LD_LIBRARY_PATH=${SDK_PATH}/AI610-SDK-1002/simulator/lib:${SDK_PATH}/AI610-SDK-1012/Linux-driver/bin/sim/release:${LD_LIBRARY_PATH}
export ZHOUYI_LINUX_DRIVER_HOME=${SDK_PATH}/AI610-SDK-1012/Linux-driver
export PYTHONPATH=~/.flagtree/aipu/llvm-a66376b0-ubuntu-x64-clang16-lld16/python_packages/mlir_core:${PYTHONPATH}
```

```shell
cd ${YOUR_CODE_DIR}/FlagTree/python
git checkout -b triton_v3.3.x origin/triton_v3.3.x
export FLAGTREE_BACKEND=aipu
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

测试前需执行 `source ~/env_setup.sh`，该脚本内容见上文。

参考 [aipu 后端测试](https://github.com/flagos-ai/FlagTree/blob/triton_v3.3.x/.github/workflows/aipu-build-and-test.yml)
