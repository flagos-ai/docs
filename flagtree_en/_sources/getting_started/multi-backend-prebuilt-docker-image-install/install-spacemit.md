[<a href="../../../flagtree_zh/getting_started/multi-backend-prebuilt-docker-image-install/install-spacemit.html">中文版</a>|English]

## 💫 SpacemiT（进迭时空）[spacemit](https://github.com/flagos-ai/FlagTree/tree/main/third_party/spacemit/)3.6

- Based on Triton 3.6, x64
- Available for K3

### 1. Quick start

#### 1.1 Use the image (x64 emulation environment)

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-spacemit-py312-torch2.10.0-ubuntu24.04:202607-3.6-base
# Plan A: docker pull (19.4GB)
docker pull ${IMAGE}
# Plan B: docker load (11GB)
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

#### 1.2 Source-free Installation

TODO

### 2. Build from Source

#### 2.1 Manually download the FlagTree dependencies

If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

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

#### 2.2 Manually download the Triton dependencies

The Triton dependencies are already downloaded and installed in the image.
If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# For Triton 3.6 (x64)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.6.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.6.x-linux-x64.tar.gz
```

After executing the above script, the original ~/.triton directory will be renamed, and a new ~/.triton directory will be created to store the pre-downloaded packages.
Note that the script will prompt for manual confirmation during execution.

#### 2.3 Build Commands

```shell
cd ${YOUR_CODE_DIR}/FlagTree
git checkout main
export SPACEMIT_CACHE="${HOME}/.flagtree/spacemit"
set -a; source third_party/spacemit/spacemit-ci.env; set +a
bash third_party/spacemit/scripts/install_flagtree_plugin.sh
```

### 3. Testing and validation

After installing `flagtree`, you can check it with:

```shell
python3 -m pip show flagtree
```

Refer to [Tests of spacemit3.6 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/spacemit3.6-build-and-test.yml)

---
