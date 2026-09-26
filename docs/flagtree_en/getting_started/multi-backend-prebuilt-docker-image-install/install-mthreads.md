[<a href="../../../flagtree_zh/getting_started/multi-backend-prebuilt-docker-image-install/install-mthreads.html">中文版</a>|English]

## 💫 Moore Threads（摩尔线程）[mthreads](https://github.com/flagos-ai/FlagTree/tree/main/third_party/mthreads/)3.6

- Based on Triton 3.6, x64
- Available for S4000/S5000

### 1. Quick start

#### 1.1 Use the image (Triton 3.6, MTT-S5000)

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-mthreads-py310-torch2.7.1-musa4.3.5-mcc5.1.0-ubuntu22.04:202608-3.6-base
# Plan A: docker pull (53.8GB)
docker pull ${IMAGE}
# Plan B: docker load (15GB)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-mthreads-py310-torch2.7.1-musa4.3.5-mcc5.1.0-ubuntu22.04.202608-3.6-base.tar.gz
docker load -i flagtree-mthreads-py310-torch2.7.1-musa4.3.5-mcc5.1.0-ubuntu22.04.202608-3.6-base.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --network=host --pid=host --privileged \
    --cap-add=SYS_PTRACE \
    --shm-size 16gb \
    --security-opt seccomp=unconfined \
    -e MTHREADS_VISIBLE_DEVICES=all -e MTHREADS_DRIVER_CAPABILITIES=all \
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
python3.10 -m pip install flagtree===0.7.0+mthreads3.6 $RES
```

### 2. Build from Source

#### 2.1 Manually download the FlagTree dependencies

If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
mkdir -p ~/.flagtree/mthreads; cd ~/.flagtree/mthreads
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/mthreads-llvm22-x64_v0.6.1.tar.gz
tar zxvf mthreads-llvm22-x64_v0.6.1.tar.gz
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/mthreads_local_binary_v0.6.1.tar.gz
tar zxvf mthreads_local_binary_v0.6.1.tar.gz
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
export FLAGTREE_BACKEND=mthreads
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. Testing and validation

After installing `flagtree`, you can check it with:

```shell
python3 -m pip show flagtree
```

Refer to [Tests of mthreads3.6 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/mthreads3.6-build-and-test.yml)

### 4. Run Qwen vLLM benchmark

#### 4.1 Use the image (MTT-S5000)

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-mthreads-py310-torch2.7.1-musa4.3.5-mcc5.1.0-ubuntu22.04:202607-3.6-vllm0.20.2
```

#### 4.2 Install FlagOS

Install flagtree as described above.

Install flag_gems and vllm-plugin-fl as follows.

```shell
git clone https://github.com/flagos-ai/FlagGems.git
cd FlagGems; git checkout v5.0.0
python3 -m pip install --no-build-isolation .
```

```shell
git clone https://github.com/flagos-ai/vllm-plugin-FL.git
cd vllm-plugin-FL
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
export MUSA_VISIBLE_DEVICES=0,1,2,3  # S5000 * 4 for Qwen3.6-27B
export VLLM_QWEN3_PORT=8000
```

```shell
export BENCH_SCRIPT_DIR="${GIT_DIR}/FlagTree/.github/workflows/benchmark/mthreads/mthreads3.6-qwen3.6"
cd ${MODEL_DIR}
vim ${BENCH_SCRIPT_DIR}/start.sh  # Edit vllm serve Qwen3.6-27B or Qwen3.6-35B-A3B
bash ${BENCH_SCRIPT_DIR}/start.sh
bash ${BENCH_SCRIPT_DIR}/test.sh
vim ${BENCH_SCRIPT_DIR}/all_perf.py  # Edit TOKENIZER_PATH
bash ${BENCH_SCRIPT_DIR}/perf.sh
bash ${BENCH_SCRIPT_DIR}/stop.sh
```

Refer to [Qwen Benchmark of mthreads3.6 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/mthreads3.6-qwen-benchmark.yml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 Moore Threads（摩尔线程）[mthreads](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/third_party/mthreads/)3.2

- Based on Triton 3.2, x64
- Available for S4000/S5000

### 1. Quick start

#### 1.1 Use the image (Triton 3.2, MTT-S5000)

```shell
# Plan A: docker pull (59.4GB)
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-mthreads3.2-py310-torch2.7.1-musa5.1.0-ubuntu22.04:202605-base
docker pull ${IMAGE}
# Plan B: docker load (17GB)
IMAGE=flagtree-mthreads3.2-py310-torch2.7.1-musa5.1.0-ubuntu22.04:202605-base
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-mthreads3.2-py310-torch2.7.1-musa5.1.0-ubuntu22.04.202605-base.tar.gz
docker load -i flagtree-mthreads3.2-py310-torch2.7.1-musa5.1.0-ubuntu22.04.202605-base.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --network=host --pid=host --privileged \
    --cap-add=SYS_PTRACE \
    --shm-size 16gb \
    --security-opt seccomp=unconfined \
    -e MTHREADS_VISIBLE_DEVICES=all -e MTHREADS_DRIVER_CAPABILITIES=all \
    -v /usr/lib/x86_64-linux-gnu:/usr/lib/x86_64-linux-gnu \
    -v /lib/x86_64-linux-gnu:/lib/x86_64-linux-gnu \
    -v /etc/alternatives:/etc/alternatives \
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
python3.10 -m pip install flagtree===0.5.1+mthreads3.2 $RES
```

The mthreads3.2 version requires installing the FlagTree dependencies according to steps `2.1`.

### 2. Build from Source

#### 2.1 Manually download the FlagTree dependencies

If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
mkdir -p ~/.flagtree/mthreads; cd ~/.flagtree/mthreads
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/mthreads-llvm20-x64_v0.5.0.tar.gz
tar zxvf mthreads-llvm20-x64_v0.5.0.tar.gz
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/mthreadsTritonPlugin-triton3.2-cpython3.10-glibc2.35-glibcxx3.4.30-cxxabi1.3.13-x64_v0.5.0.tar.gz
tar zxvf mthreadsTritonPlugin-triton3.2-cpython3.10-glibc2.35-glibcxx3.4.30-cxxabi1.3.13-x64_v0.5.0.tar.gz
```

#### 2.2 Manually download the Triton dependencies

The Triton dependencies are already downloaded and installed in the image.
If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# For Triton 3.2 (x64)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.2.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.2.x-linux-x64.tar.gz
```

After executing the above script, the original ~/.triton directory will be renamed, and a new ~/.triton directory will be created to store the pre-downloaded packages.
Note that the script will prompt for manual confirmation during execution.

#### 2.3 Build Commands

```shell
cd ${YOUR_CODE_DIR}/FlagTree/python
git checkout -b triton_v3.2.x origin/triton_v3.2.x
export FLAGTREE_BACKEND=mthreads
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. Testing and validation

After installing `flagtree`, you can check it with:

```shell
python3 -m pip show flagtree
```

Refer to [Tests of mthreads3.2 backend](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/.github/workflows/mthreads-build-and-test.yml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 Moore Threads（摩尔线程）[mthreads](https://github.com/flagos-ai/FlagTree/tree/triton_v3.1.x/third_party/mthreads/)3.1

- Based on Triton 3.1, x64/aarch64
- Available for S4000/S5000

### 1. Quick start

#### 1.1 Use the preinstalled image (Triton 3.1, MTT-S5000)

If you use this preinstalled image, you do not need to perform the later installation steps.

```shell
# Plan A: docker pull (55.3GB)
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-mthreads-py310-torch2.7.1-musa4.3.5-ubuntu22.04:202603
docker pull ${IMAGE}
# Plan B: docker load (18GB)
IMAGE=flagtree-mthreads-py310-torch2.7.1-musa4.3.5-ubuntu22.04:202603
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-mthreads-py310-torch2.7.1-musa4.3.5-ubuntu22.04.202603.tar.gz
docker load -i flagtree-mthreads-py310-torch2.7.1-musa4.3.5-ubuntu22.04.202603.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --network=host --pid=host --privileged \
    --cap-add=SYS_PTRACE \
    --shm-size 16gb \
    --security-opt seccomp=unconfined \
    -e MTHREADS_VISIBLE_DEVICES=all -e MTHREADS_DRIVER_CAPABILITIES=all \
    -v /usr/lib/x86_64-linux-gnu:/usr/lib/x86_64-linux-gnu \
    -v /lib/x86_64-linux-gnu:/lib/x86_64-linux-gnu \
    -v /etc/alternatives:/etc/alternatives \
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
python3.10 -m pip install flagtree===0.5.1+mthreads3.1 $RES
```

`flagtree` is already installed in the preinstalled image.

### 2. Build from Source

#### 2.1 Manually download the FlagTree dependencies

If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
mkdir -p ~/.flagtree/mthreads; cd ~/.flagtree/mthreads
# x64
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/mthreads-llvm19-glibc2.35-glibcxx3.4.30-x64_v0.4.0.tar.gz
tar zxvf mthreads-llvm19-glibc2.35-glibcxx3.4.30-x64_v0.4.0.tar.gz \
    -C ./mthreads-llvm19-glibc2.35-glibcxx3.4.30 --strip-components=1
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/mthreadsTritonPlugin-cpython3.10-glibc2.35-glibcxx3.4.30-cxxabi1.3.13-ubuntu-x64_v0.4.1.tar.gz
tar zxvf mthreadsTritonPlugin-cpython3.10-glibc2.35-glibcxx3.4.30-cxxabi1.3.13-ubuntu-x64_v0.4.1.tar.gz
# aarch64
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/mthreads-llvm19-glibc2.35-glibcxx3.4.30-aarch64_v0.4.0.tar.gz
tar zxvf mthreads-llvm19-glibc2.35-glibcxx3.4.30-aarch64_v0.4.0.tar.gz \
    -C ./mthreads-llvm19-glibc2.35-glibcxx3.4.30 --strip-components=1
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/mthreadsTritonPlugin-cpython3.10-glibc2.35-glibcxx3.4.30-cxxabi1.3.13-ubuntu-aarch64_v0.4.0.tar.gz
tar zxvf mthreadsTritonPlugin-cpython3.10-glibc2.35-glibcxx3.4.30-cxxabi1.3.13-ubuntu-aarch64_v0.4.0.tar.gz
```

#### 2.2 Manually download the Triton dependencies

The Triton dependencies are already downloaded and installed in the image.
If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# For Triton 3.1 (x64)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.1.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.1.x-linux-x64.tar.gz
```

After executing the above script, the original ~/.triton directory will be renamed, and a new ~/.triton directory will be created to store the pre-downloaded packages.
Note that the script will prompt for manual confirmation during execution.

#### 2.3 Build Commands

```shell
cd ${YOUR_CODE_DIR}/FlagTree/python
git checkout -b triton_v3.1.x origin/triton_v3.1.x
export FLAGTREE_BACKEND=mthreads
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. Testing and validation

You can check the installed `flagtree` with:

```shell
python3 -m pip show flagtree
```

Refer to [Tests of mthreads3.1 backend](https://github.com/flagos-ai/FlagTree/blob/triton_v3.1.x/.github/workflows/mthreads-build-and-test.yml)

For triton 3.1 kernels that use `tl.dot`, setting the environment variable `export MUSA_ENABLE_SQMMA=1` can improve performance.
