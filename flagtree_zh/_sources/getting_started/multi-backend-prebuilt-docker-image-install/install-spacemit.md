[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-spacemit.html">英文版</a>|中文版]

## 💫 SpacemiT（进迭时空）[spacemit](https://github.com/flagos-ai/FlagTree/tree/main/third_party/spacemit/)3.6

- 基于 Triton 3.6，x64
- 适用于 K3

### 1. 快速开始

#### 1.1 使用镜像（x64 emulation environment）

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-spacemit-py312-torch2.10.0-ubuntu24.04:202607-3.6-base
# 方案 A：docker pull（19.4GB）
docker pull ${IMAGE}
# 方案 B：docker load（11GB）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-spacemit-py312-torch2.10.0-ubuntu24.04.202607-3.6-base.tar.gz
docker load -i flagtree-spacemit-py312-torch2.10.0-ubuntu24.04.202607-3.6-base.tar.gz
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

TODO

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/spacemit; cd ~/.flagtree/spacemit
wget https://github.com/zuoweixia497/spacemit-ci-assets/releases/download/v0.1/llvm-f6ded0be-x86-release.tar.gz
mkdir llvm_installed; tar zxf llvm-f6ded0be-x86-release.tar.gz -C llvm_installed --strip-components=1
wget https://github.com/zuoweixia497/spacemit-ci-assets/releases/download/v0.1/spine-mlir.x86_64.0.8.0.tar.gz
mkdir spine_mlir_installed; tar zxf spine-mlir.x86_64.0.8.0.tar.gz -C spine_mlir_installed --strip-components=1
wget https://github.com/spacemit-com/spine-runtime/releases/download/0.6.0/spine-runtime.riscv64.0.6.0.tar.gz
mkdir spine_runtime_installed; tar zxf spine-runtime.riscv64.0.6.0.tar.gz -C spine_runtime_installed --strip-components=1
wget https://github.com/zuoweixia497/spacemit-ci-assets/releases/download/v0.1/spine-triton-rpc-runtime.riscv64.0.6.0.tar.gz
mkdir rpc_runtime_installed; tar zxf spine-triton-rpc-runtime.riscv64.0.6.0.tar.gz -C rpc_runtime_installed --strip-components=1
wget https://github.com/spacemit-com/toolchain/releases/download/v1.1.2/spacemit-toolchain-linux-glibc-x86_64-v1.1.2.tar.xz
mkdir toolchain; tar xf spacemit-toolchain-linux-glibc-x86_64-v1.1.2.tar.xz -C toolchain --strip-components=1
wget https://github.com/zuoweixia497/spacemit-ci-assets/releases/download/v0.1/jdsk-qemu-v10.0.2.tar.gz
mkdir jdsk-qemu; tar zxf jdsk-qemu-v10.0.2.tar.gz -C jdsk-qemu --strip-components=1
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
export SPACEMIT_CACHE="${HOME}/.flagtree/spacemit"
set -a; source third_party/spacemit/spacemit-ci.env; set +a
bash third_party/spacemit/scripts/install_flagtree_plugin.sh
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [spacemit3.6 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/spacemit3.6-build-and-test.yml)

---
