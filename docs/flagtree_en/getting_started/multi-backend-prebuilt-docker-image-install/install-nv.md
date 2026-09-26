[<a href="../../../flagtree_zh/getting_started/multi-backend-prebuilt-docker-image-install/install-nv.html">中文版</a>|English]

## 💫 NVIDIA [nvidia](https://github.com/flagos-ai/FlagTree/tree/main/third_party/nvidia/)

- Based on Triton 3.1/3.2/3.3/3.4/3.5/3.6/3.7/3.8, x64

### 1. Quick start

#### 1.1 Use the image (for Triton 3.6)

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-py312-torch2.8.0a0_5228986c39.nv25.05-cuda12.9-ubuntu24.04:202608-3.6-base
# Plan A: docker pull (36.1GB)
docker pull ${IMAGE}
# Plan B: docker load (16GB)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-py312-torch2.8.0a0_5228986c39.nv25.05-cuda12.9-ubuntu24.04.202608-3.6-base.tar.gz
docker load -i flagtree-py312-torch2.8.0a0_5228986c39.nv25.05-cuda12.9-ubuntu24.04.202608-3.6-base.tar.gz
```

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

#### 1.2 Source-free Installation (for Triton 3.6)

```shell
# Note: First install PyTorch, then execute the following commands
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install flagtree===0.7.0 $RES
```

### 2. Build from Source

#### 2.1 Manually download the LLVM

If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
cd ${YOUR_LLVM_DOWNLOAD_DIR}
# For Triton 3.1
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-10dc3a8e-ubuntu-x64.tar.gz
tar zxvf llvm-10dc3a8e-ubuntu-x64.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-10dc3a8e-ubuntu-x64
# For Triton 3.2
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-86b69c31-ubuntu-x64.tar.gz
tar zxvf llvm-86b69c31-ubuntu-x64.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-86b69c31-ubuntu-x64
# For Triton 3.3
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-a66376b0-ubuntu-x64.tar.gz
tar zxvf llvm-a66376b0-ubuntu-x64.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-a66376b0-ubuntu-x64
# For Triton 3.4
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-8957e64a-ubuntu-x64.tar.gz
tar zxvf llvm-8957e64a-ubuntu-x64.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-8957e64a-ubuntu-x64
# For Triton 3.5
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-7d5de303-ubuntu-x64.tar.gz
tar zxvf llvm-7d5de303-ubuntu-x64.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-7d5de303-ubuntu-x64
# For Triton 3.7
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-1f126a6d-ubuntu-x64-1.tar.gz
tar zxvf llvm-1f126a6d-ubuntu-x64-1.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-1f126a6d-ubuntu-x64-1
# For Triton 3.8
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-5f07f818-ubuntu-x64-1.tar.gz
tar zxvf llvm-5f07f818-ubuntu-x64-1.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-5f07f818-ubuntu-x64-1
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

To check out which commit of FlagCX, please refer to https://github.com/flagos-ai/FlagTree/blob/main/python/setup_tools/utils/__init__.py

```shell
cd ${YOUR_CODE_DIR}/FlagTree/third_party/tle/third_party
git clone https://github.com/flagos-ai/FlagCX.git
```

#### 2.2 Manually download the Triton dependencies

The Triton dependencies are already downloaded and installed in the image.
If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# For Triton 3.1 (x64)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.1.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.1.x-linux-x64.tar.gz
# For Triton 3.2 (x64)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.2.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.2.x-linux-x64.tar.gz
# For Triton 3.2 (aarch64)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.2.x-linux-aarch64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.2.x-linux-aarch64.tar.gz
# For Triton 3.3 (x64)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.3.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.3.x-linux-x64.tar.gz
# For Triton 3.4 (x64)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.4.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.4.x-linux-x64.tar.gz
# For Triton 3.5 (x64)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.5.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.5.x-linux-x64.tar.gz
# For Triton 3.6 (x64)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.6.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.6.x-linux-x64.tar.gz
# For Triton 3.7 (x64)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.7.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.7.x-linux-x64.tar.gz
# For Triton 3.8 (x64)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.8.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.8.x-linux-x64.tar.gz
```

After executing the above script, the original ~/.triton directory will be renamed, and a new ~/.triton directory will be created to store the pre-downloaded packages.
Note that the script will prompt for manual confirmation during execution.

#### 2.3 Build Commands

```shell
apt update; apt install zlib1g zlib1g-dev libxml2 libxml2-dev nlohmann-json3-dev
cd ${YOUR_CODE_DIR}/FlagTree
python3 -m pip install -r python/requirements.txt
cd python; git checkout -b triton_v3.1.x origin/triton_v3.2.x  # For Triton 3.1
cd python; git checkout -b triton_v3.2.x origin/triton_v3.2.x  # For Triton 3.2
cd python; git checkout -b triton_v3.3.x origin/triton_v3.3.x  # For Triton 3.3
git checkout -b triton_v3.4.x origin/triton_v3.4.x  # For Triton 3.4
git checkout -b triton_v3.5.x origin/triton_v3.5.x  # For Triton 3.5
git checkout -b triton_v3.7.x origin/triton_v3.7.x  # For Triton 3.7
git checkout -b triton_v3.8.x origin/triton_v3.8.x  # For Triton 3.8
git checkout main                                   # For Triton 3.6
unset FLAGTREE_BACKEND
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
# If you need to build other backends afterward, you should clear LLVM-related environment variables
unset LLVM_SYSPATH LLVM_INCLUDE_DIRS LLVM_LIBRARY_DIR
```

### 3. Testing and validation

After installing `flagtree`, you can check it with:

```shell
python3 -m pip show flagtree
```

Refer to [Tests of nvidia3.6 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/nvidia3.6-build-and-test.yml), [Tests of nvidia3.7 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/nvidia3.7-build-and-test.yml), [Tests of nvidia3.8 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/nvidia3.8-build-and-test.yml)

### 4. Run Qwen vLLM benchmark

#### 4.1 Use the image (for Triton 3.6)

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-py312-torch2.11.0_cu130-cuda13.0-ubuntu24.04:202609-3.6-vllm0.24.0
# Plan A: docker pull (42GB)
docker pull ${IMAGE}
# Plan B: docker load (17GB)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-py312-torch2.11.0_cu130-cuda13.0-ubuntu24.04.202609-3.6-vllm0.24.0.tar.gz
docker load -i flagtree-py312-torch2.11.0_cu130-cuda13.0-ubuntu24.04.202609-3.6-vllm0.24.0.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --entrypoint /bin/bash \
    --net=host --uts=host --ipc=host --privileged \
    --shm-size 512g \
    --security-opt seccomp=unconfined \
    --gpus=all \
    -v /etc/localtime:/etc/localtime:ro \
    -v /data:/data -v /home:/home \
    -w /root --name ${CONTAINER} ${IMAGE}
docker exec -it ${CONTAINER} /bin/bash
```

#### 4.2 Install FlagOS

Install flagtree as described above.

Install flag_gems and vllm-plugin-fl as follows.

```shell
git clone https://github.com/flagos-ai/FlagGems.git
cd FlagGems; git checkout v5.3.5
python3 -m pip install --no-build-isolation .
```

```shell
git clone https://github.com/flagos-ai/vllm-plugin-FL.git
cd vllm-plugin-FL; git checkout v0.3.0-rc0
python3 -m pip install --no-build-isolation .
```

#### 4.3 Download the model

```shell
python3 -m modelscope.cli.cli download --model Qwen/Qwen3.6-27B \
    --local_dir ${MODEL_DIR}/Qwen3.6-27B
python3 -m modelscope.cli.cli download --model Qwen/Qwen3.6-35B-A3B \
    --local_dir ${MODEL_DIR}/Qwen3.6-35B-A3B
```

#### 4.4 Run the benchmark

```shell
# ~/env.sh
export CUDA_VISIBLE_DEVICES=0,1  # H100 * 2 for Qwen3.6-27B
export VLLM_QWEN3_PORT=8000
```

```shell
export BENCH_SCRIPT_DIR="${GIT_DIR}/FlagTree/.github/workflows/benchmark/nvidia/nv3.6-qwen3.6"
cd ${MODEL_DIR}
vim ${BENCH_SCRIPT_DIR}/start.sh  # Edit vllm serve Qwen3.6-27B or Qwen3.6-35B-A3B
bash ${BENCH_SCRIPT_DIR}/start.sh
bash ${BENCH_SCRIPT_DIR}/test.sh
vim ${BENCH_SCRIPT_DIR}/all_perf.py  # Edit TOKENIZER_PATH
bash ${BENCH_SCRIPT_DIR}/perf.sh
bash ${BENCH_SCRIPT_DIR}/stop.sh
```

Refer to [Qwen Benchmark of nvidia3.6 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/nvidia3.6-qwen-benchmark.yml)

### Q&A

#### Q: After installation, running the program reports: version GLIBC or GLIBCXX not found

A: Check which GLIBC / GLIBCXX versions are supported by libc.so.6 and libstdc++.so.6.0.30 in your environment:

```shell
strings /lib/x86_64-linux-gnu/libc.so.6 |grep GLIBC
strings /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30 | grep GLIBCXX
```

If the required GLIBC / GLIBCXX version is supported, you can also try:

```shell
export LD_PRELOAD="/lib/x86_64-linux-gnu/libc.so.6"  # If GLIBC cannot be found
export LD_PRELOAD="/usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30"  # If GLIBCXX cannot be found
export LD_PRELOAD="/lib/x86_64-linux-gnu/libc.so.6 \
    /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30"  # If neither GLIBC nor GLIBCXX can be found
```
