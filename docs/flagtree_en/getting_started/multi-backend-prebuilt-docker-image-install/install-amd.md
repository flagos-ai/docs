[<a href="../../../flagtree_zh/getting_started/multi-backend-prebuilt-docker-image-install/install-amd.html">中文版</a>|English]

## 💫 AMD [amd](https://github.com/flagos-ai/FlagTree/tree/main/third_party/amd/)

- Based on Triton 3.1/3.2/3.3/3.4/3.5/3.6/3.7/3.8, x64

### 1. Quick start

#### 1.1 Use the image (for Triton 3.6)

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-amd-py312-torch2.11-rocm7.2.3-gfx1100-ubuntu22.04:202608-3.6-base
# Plan A: docker pull (35.9GB)
docker pull ${IMAGE}
# Plan B: docker load (12GB)
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

#### 1.2 Source-free Installation (for Triton 3.6)

```shell
# Note: First install PyTorch, then execute the following commands
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install flagtree===0.7.0rc1+amd3.6 $RES
```

### 2. Build from Source

#### 2.1 Manually download the LLVM

If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
cd ${YOUR_LLVM_DOWNLOAD_DIR}
# For Triton 3.6 (Plan A)
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-f6ded0be-ubuntu-x64.tar.gz
tar zxvf llvm-f6ded0be-ubuntu-x64.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-f6ded0be-ubuntu-x64
# For all versions
export LLVM_INCLUDE_DIRS=$LLVM_SYSPATH/include
export LLVM_LIBRARY_DIR=$LLVM_SYSPATH/lib
```

```shell
# For Triton 3.6 (Plan B, Recommended)
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install mlir $RES
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
export FLAGTREE_BACKEND=amd
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. Testing and validation

After installing `flagtree`, you can check it with:

```shell
python3 -m pip show flagtree
```

Refer to [Tests of amd3.6 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/amd3.6-build-and-test.yml)
