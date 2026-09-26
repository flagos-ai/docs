[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-tsingmicro.html">英文版</a>|中文版]

## 💫 Tsingmicro（清微智能）[tsingmicro](https://github.com/flagos-ai/FlagTree/tree/main/third_party/tsingmicro/)3.6

- 基于 Triton 3.6，x64
- 适用于 TX81

### 1. 快速开始

#### 1.1 使用镜像（TX81）

```shell
tsm_smi  # SMI V0.28791.2.01
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-tsingmicro-py310-torch2.11.0-ubuntu22.04:202608-3.6-V0.28791.2.01-base
# 方案 A：docker pull（13.3GB）
docker pull ${IMAGE}
# 方案 B：docker load（5.5GB）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-tsingmicro-py310-torch2.11.0-ubuntu22.04.202608-3.6-V0.28791.2.01-base.tar.gz
docker load -i flagtree-tsingmicro-py310-torch2.11.0-ubuntu22.04.202608-3.6-V0.28791.2.01-base.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --network=host --ipc=host --privileged \
    --security-opt seccomp=unconfined \
    -v /dev:/dev -v /lib/modules:/lib/modules -v /sys:/sys \
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
python3.10 -m pip install flagtree===0.7.0+tsingmicro3.6 $RES
```

⚠️ tsingmicro3.6 版本需要按步骤 `2.1` 安装 FlagTree 依赖项。

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/tsingmicro; cd ~/.flagtree/tsingmicro
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/tsingmicro-llvm22-x64_v0.6.1.tar.gz
tar zxvf tsingmicro-llvm22-x64_v0.6.1.tar.gz
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/tx8_depends_v0.6.1.tar.gz
tar zxvf tx8_depends_v0.6.1.tar.gz
```

关于 flir 应检出哪个 commit，请参考 https://github.com/flagos-ai/FlagTree/blob/main/python/setup_tools/utils/__init__.py

```shell
cd ${YOUR_CODE_DIR}/FlagTree/third_party
git clone https://github.com/flagos-ai/flir.git
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

构建与测试前需设置以下环境变量：

```bash
export TX8_DEPS_ROOT=~/.flagtree/tsingmicro/tx8_deps
export LLVM_SYSPATH=~/.flagtree/tsingmicro/tsingmicro-llvm22
export LLVM_BINARY_DIR=${LLVM_SYSPATH}/bin
export PYTHONPATH=${LLVM_SYSPATH}/python_packages/mlir_core:$PYTHONPATH
export LD_LIBRARY_PATH=$TX8_DEPS_ROOT/lib:$LD_LIBRARY_PATH
export PATH=${LLVM_BINARY_DIR}:${PATH}
```

```shell
cd ${YOUR_CODE_DIR}/FlagTree
git checkout main
export FLAGTREE_BACKEND=tsingmicro
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

测试前需按上述说明设置环境变量。

参考 [tsingmicro3.6 后端测试](https://github.com/flagos-ai/FlagTree/blob/main/.github/workflows/tsingmicro3.6-build-and-test.yml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 Tsingmicro（清微智能）[tsingmicro](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/tsingmicro/)3.3

- 基于 Triton 3.3，x64
- 适用于 TX81

### 1. 快速开始

#### 1.1 使用镜像（TX81）

```shell
tsm_smi  # SMI V0.28791.2.01
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-tsingmicro-py310-torch2.7.0-ubuntu22.04:202607-3.3-V0.28791.2.01-base
# 方案 A：docker pull（11.9GB）
docker pull ${IMAGE}
# 方案 B：docker load（5.3GB）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-tsingmicro-py310-torch2.7.0-ubuntu22.04.202607-3.3-V0.28791.2.01-base.tar.gz
docker load -i flagtree-tsingmicro-py310-torch2.7.0-ubuntu22.04.202607-3.3-V0.28791.2.01-base.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --network=host --ipc=host --privileged \
    --security-opt seccomp=unconfined \
    -v /dev:/dev -v /lib/modules:/lib/modules -v /sys:/sys \
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
python3.10 -m pip install flagtree===0.6.0+tsingmicro3.3 $RES
```

⚠️ tsingmicro3.3 版本需要按步骤 `2.1` 安装 FlagTree 依赖项。

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/tsingmicro; cd ~/.flagtree/tsingmicro
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/tsingmicro-llvm21-glibc2.30-glibcxx3.4.28-python3.10-x64_v0.6.0.tar.gz
tar zxvf tsingmicro-llvm21-glibc2.30-glibcxx3.4.28-python3.10-x64_v0.6.0.tar.gz
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/tx8_depends_dev_20260507_104051_v0.6.0.tar.gz
tar zxvf tx8_depends_dev_20260507_104051_v0.6.0.tar.gz
```

关于 flir 应检出哪个 commit，请参考 https://github.com/flagos-ai/FlagTree/blob/triton_v3.3.x/python/setup_tools/utils/__init__.py

```shell
cd ${YOUR_CODE_DIR}/FlagTree/third_party
git clone https://github.com/flagos-ai/flir.git
```

#### 2.2 手动下载 Triton 依赖项

Triton 依赖项已在镜像中下载并安装完毕。
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

构建与测试前需设置以下环境变量：

```bash
export TX8_DEPS_ROOT=~/.flagtree/tsingmicro/tx8_deps
export LLVM_SYSPATH=~/.flagtree/tsingmicro/tsingmicro-llvm21-glibc2.30-glibcxx3.4.28-python3.10-x64
export LLVM_BINARY_DIR=${LLVM_SYSPATH}/bin
export PYTHONPATH=${LLVM_SYSPATH}/python_packages/mlir_core:$PYTHONPATH
export LD_LIBRARY_PATH=$TX8_DEPS_ROOT/lib:$LD_LIBRARY_PATH
export PATH=${LLVM_BINARY_DIR}:${PATH}
```

```shell
cd ${YOUR_CODE_DIR}/FlagTree/python
git checkout -b triton_v3.3.x origin/triton_v3.3.x
export FLAGTREE_BACKEND=tsingmicro
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

测试前需按上述说明设置环境变量。

参考 [tsingmicro3.3 后端测试](https://github.com/flagos-ai/FlagTree/blob/triton_v3.3.x/.github/workflows/tsingmicro3.3-build-and-test.yml)
