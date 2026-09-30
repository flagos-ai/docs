[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-metax.html">英文版</a>|中文版]

## 💫 MetaX（沐曦股份）[metax](https://github.com/flagos-ai/FlagTree/tree/main/third_party/metax/)3.6

- 基于 Triton 3.6，x64
- 适用于 C550

### 1. 快速开始

#### 1.1 使用镜像（C550）

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-metax-py312-torch2.8.0-metax3.7.0.7-ubuntu22.04:202609-3.6-vllm0.24.0
# 方案 A：docker pull（21.2GB）
docker pull ${IMAGE}
# 方案 B：docker load（6.0GB）
IMAGE=flagtree-metax3.6-py312-torch2.8.0-metax3.7.2.0-ubuntu24.04:202606-base
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-metax3.6-py312-torch2.8.0-metax3.7.2.0-ubuntu24.04.202606-base.tar.gz
docker load -i flagtree-metax3.6-py312-torch2.8.0-metax3.7.2.0-ubuntu24.04.202606-base.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --net=host --uts=host --ipc=host --privileged=true \
    --group-add video \
    --shm-size 100gb --ulimit memlock=-1 \
    --security-opt seccomp=unconfined --security-opt apparmor=unconfined \
    --device=/dev/dri --device=/dev/mxcd \
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
python3.12 -m pip install flagtree===0.7.0rc3+metax3.6 $RES
```

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/metax; cd ~/.flagtree/metax
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/metax-llvm19-3.8.0.6-x86_64_v0.6.0.tar.gz
tar zxvf metax-llvm19-3.8.0.6-x86_64_v0.6.0.tar.gz
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/metaxTritonPlugin-cpython3.12-x86_64_v0.6.1.tar.gz
tar zxvf metaxTritonPlugin-cpython3.12-x86_64_v0.6.1.tar.gz
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
export FLAGTREE_BACKEND=metax
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [metax3.6 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/metax3.6-build-and-test.yml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 MetaX（沐曦股份）[metax](https://github.com/flagos-ai/FlagTree/tree/triton_v3.1.x/third_party/metax/)3.0

- 基于 Triton 3.0，x64
- 适用于 C550

### 1. 快速开始

#### 1.1 使用预装镜像（C550）

如果使用此预装镜像，则无需执行后续安装步骤。

```shell
# 方案 A：docker pull（28.1GB）
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-metax-py312-torch2.8.0-vllm0.15.0-metax3.5.3.x-ubuntu22.04:202604-0.5.1
docker pull ${IMAGE}
# 方案 B：docker load（8.1GB）
IMAGE=flagtree-metax-py312-torch2.8.0-vllm0.15.0-metax3.5.3.x-ubuntu22.04:202604-0.5.1
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-metax-py312-torch2.8.0-vllm0.15.0-metax3.5.3.x-ubuntu22.04.202604-0.5.1.tar.gz
docker load -i flagtree-metax-py312-torch2.8.0-vllm0.15.0-metax3.5.3.x-ubuntu22.04.202604-0.5.1.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --net=host --uts=host --ipc=host --privileged=true \
    --group-add video \
    --shm-size 100gb --ulimit memlock=-1 \
    --security-opt seccomp=unconfined --security-opt apparmor=unconfined \
    --device=/dev/dri --device=/dev/mxcd \
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
python3.12 -m pip install flagtree===0.5.1+metax3.0 $RES
```

预装镜像中已安装 `flagtree`。

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/metax; cd ~/.flagtree/metax
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/metaxTritonPlugin-cpython3.12-glibc2.35-glibcxx3.4.30-cxxabi1.3.13-linux-x86_64_v0.5.0.tar.gz
tar zxvf metaxTritonPlugin-cpython3.12-glibc2.35-glibcxx3.4.30-cxxabi1.3.13-linux-x86_64_v0.5.0.tar.gz
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/ext_maca_mathlib_bc_v0.5.0.tar.gz
tar zxvf ext_maca_mathlib_bc_v0.5.0.tar.gz
# 注意：请联系沐曦供应商获取 maca-llvm-metax20250708.521-x86_64.tar.xz
tar xvf maca-llvm-metax20250708.521-x86_64.tar.xz
```

#### 2.2 手动下载 Triton 依赖项

Triton 依赖项已在预装镜像中下载并安装完毕。
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
export FLAGTREE_BACKEND=metax
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

可通过以下命令检查已安装的 `flagtree`：

```shell
python3 -m pip show flagtree
```

参考 [metax3.0 后端测试](https://github.com/flagos-ai/FlagTree/blob/triton_v3.1.x/.github/workflows/metax3.0-build-and-test.yml)
