[<a href="../../../flagtree_zh/getting_started/multi-backend-prebuilt-docker-image-install/install-tsingmicro.html">中文版</a>|English]

## 💫 Tsingmicro（清微智能）[tsingmicro](https://github.com/flagos-ai/FlagTree/tree/main/third_party/tsingmicro/)3.6

- Based on Triton 3.6, x64
- Available for TX81

### 1. Quick start

#### 1.1 Use the image (TX81)

```shell
tsm_smi  # SMI V0.28791.2.01
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-tsingmicro-py310-torch2.11.0-ubuntu22.04:202608-3.6-V0.28791.2.01-base
# Plan A: docker pull (13.3GB)
docker pull ${IMAGE}
# Plan B: docker load (5.5GB)
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

#### 1.2 Source-free Installation

```shell
# Note: First install PyTorch, then execute the following commands
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.10 -m pip install flagtree===0.7.0+tsingmicro3.6 $RES
```

⚠️ The tsingmicro3.6 version requires installing the FlagTree dependencies according to steps `2.1`.

### 2. Build from Source

#### 2.1 Manually download the FlagTree dependencies

If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
mkdir -p ~/.flagtree/tsingmicro; cd ~/.flagtree/tsingmicro
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/tsingmicro-llvm22-x64_v0.6.1.tar.gz
tar zxvf tsingmicro-llvm22-x64_v0.6.1.tar.gz
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/tx8_depends_v0.6.1.tar.gz
tar zxvf tx8_depends_v0.6.1.tar.gz
```

To check out which commit of flir, please refer to https://github.com/flagos-ai/FlagTree/blob/main/python/setup_tools/utils/__init__.py

```shell
cd ${YOUR_CODE_DIR}/FlagTree/third_party
git clone https://github.com/flagos-ai/flir.git
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

Before building and testing, you need to set the following environment variables:

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

### 3. Testing and validation

After installing `flagtree`, you can check it with:

```shell
python3 -m pip show flagtree
```

Before testing, you need to set the environment variables as described above.

Refer to [Tests of tsingmicro3.6 backend](https://github.com/flagos-ai/FlagTree/blob/main/.github/workflows/tsingmicro3.6-build-and-test.yml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 Tsingmicro（清微智能）[tsingmicro](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/tsingmicro/)3.3

- Based on Triton 3.3, x64
- Available for TX81

### 1. Quick start

#### 1.1 Use the image (TX81)

```shell
tsm_smi  # SMI V0.28791.2.01
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-tsingmicro-py310-torch2.7.0-ubuntu22.04:202607-3.3-V0.28791.2.01-base
# Plan A: docker pull (11.9GB)
docker pull ${IMAGE}
# Plan B: docker load (5.3GB)
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

#### 1.2 Source-free Installation

```shell
# Note: First install PyTorch, then execute the following commands
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.10 -m pip install flagtree===0.6.0+tsingmicro3.3 $RES
```

⚠️ The tsingmicro3.3 version requires installing the FlagTree dependencies according to steps `2.1`.

### 2. Build from Source

#### 2.1 Manually download the FlagTree dependencies

If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
mkdir -p ~/.flagtree/tsingmicro; cd ~/.flagtree/tsingmicro
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/tsingmicro-llvm21-glibc2.30-glibcxx3.4.28-python3.10-x64_v0.6.0.tar.gz
tar zxvf tsingmicro-llvm21-glibc2.30-glibcxx3.4.28-python3.10-x64_v0.6.0.tar.gz
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/tx8_depends_dev_20260507_104051_v0.6.0.tar.gz
tar zxvf tx8_depends_dev_20260507_104051_v0.6.0.tar.gz
```

To check out which commit of flir, please refer to https://github.com/flagos-ai/FlagTree/blob/triton_v3.3.x/python/setup_tools/utils/__init__.py

```shell
cd ${YOUR_CODE_DIR}/FlagTree/third_party
git clone https://github.com/flagos-ai/flir.git
```

#### 2.2 Manually download the Triton dependencies

The Triton dependencies are already downloaded and installed in the image.
If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# For Triton 3.3 (x64)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.3.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.3.x-linux-x64.tar.gz
```

After executing the above script, the original ~/.triton directory will be renamed, and a new ~/.triton directory will be created to store the pre-downloaded packages.
Note that the script will prompt for manual confirmation during execution.

#### 2.3 Build Commands

Before building and testing, you need to set the following environment variables:

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

### 3. Testing and validation

After installing `flagtree`, you can check it with:

```shell
python3 -m pip show flagtree
```

Before testing, you need to set the environment variables as described above.

Refer to [Tests of tsingmicro3.3 backend](https://github.com/flagos-ai/FlagTree/blob/triton_v3.3.x/.github/workflows/tsingmicro3.3-build-and-test.yml)
