[<a href="../../../flagtree_zh/getting_started/multi-backend-prebuilt-docker-image-install/install-hcu.html">中文版</a>|English]

## 💫 HYGON（海光信息）[hcu](https://github.com/flagos-ai/FlagTree/tree/main/third_party/hcu/)3.6

- Based on Triton 3.6, x64
- Available for K100/BW1000

### 1. Quick start

#### 1.1 Use the image (BW1000)

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-hcu-py310-torch2.10.0-dtk26.04-ubuntu22.04:202608-3.6-vllm0.24.0
# Plan A: docker pull (30.6GB)
docker pull ${IMAGE}
# Plan B: docker load (8.1GB)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-hcu-py310-torch2.10.0-dtk26.04-ubuntu22.04.202608-3.6-vllm0.24.0.tar.gz
docker load -i flagtree-hcu-py310-torch2.10.0-dtk26.04-ubuntu22.04.202608-3.6-vllm0.24.0.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --network=host --ipc=host --privileged=true \
    --group-add video --cap-add=SYS_PTRACE \
    --security-opt seccomp=unconfined \
    --device=/dev/kfd --device=/dev/mkfd --device=/dev/dri \
    -v /opt/hyhal:/opt/hyhal \
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
python3.10 -m pip install flagtree===0.7.0+hcu3.6 $RES
```

### 2. Build from Source

#### 2.1 Manually download the FlagTree dependencies

If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
mkdir -p ~/.flagtree/hcu; cd ~/.flagtree/hcu
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/hcu-llvm22-b0ca808-glibc2.35-glibcxx3.4.30-ubuntu-x86_64_v0.5.0.tar.gz
tar zxvf hcu-llvm22-b0ca808-glibc2.35-glibcxx3.4.30-ubuntu-x86_64_v0.5.0.tar.gz
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
export FLAGTREE_BACKEND=hcu
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. Testing and validation

After installing `flagtree`, you can check it with:

```shell
python3 -m pip show flagtree
```

Refer to [Tests of hcu3.6 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/hcu3.6-build-and-test.yml)

### 4. Run Qwen vLLM benchmark

#### 4.1 Install FlagOS

Install flagtree as described above.

Install flag_gems and vllm-plugin-fl as follows.

```shell
git clone https://github.com/flagos-ai/FlagGems.git
cd FlagGems; git checkout v5.3.2
python3 -m pip install --no-build-isolation .
```

```shell
git clone https://github.com/flagos-ai/vllm-plugin-FL.git
cd vllm-plugin-FL; git checkout v0.3.0-rc1.post1
python3 -m pip install --no-build-isolation .
```

#### 4.2 Download the model

```shell
python3 -m modelscope.cli.cli download --model Qwen/Qwen3.6-27B \
    --local_dir ${MODEL_DIR}/Qwen3.6-27B
python3 -m modelscope.cli.cli download --model Qwen/Qwen3.6-35B-A3B \
    --local_dir ${MODEL_DIR}/Qwen3.6-35B-A3B
```

#### 4.3 Run the benchmark

```shell
# ~/env.sh
export HIP_VISIBLE_DEVICES=0,1  # BW1000 * 2 for Qwen3.6-27B
export VLLM_QWEN3_PORT=8000
```

```shell
export BENCH_SCRIPT_DIR="${GIT_DIR}/FlagTree/.github/workflows/benchmark/hcu/hcu3.6-qwen3.6"
cd ${MODEL_DIR}
vim ${BENCH_SCRIPT_DIR}/start.sh  # Edit vllm serve Qwen3.6-27B or Qwen3.6-35B-A3B
bash ${BENCH_SCRIPT_DIR}/start.sh
bash ${BENCH_SCRIPT_DIR}/test.sh
vim ${BENCH_SCRIPT_DIR}/all_perf.py  # Edit TOKENIZER_PATH
bash ${BENCH_SCRIPT_DIR}/perf.sh
bash ${BENCH_SCRIPT_DIR}/stop.sh
```

Refer to [Qwen Benchmark of hcu3.6 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/hcu3.6-qwen-benchmark.yml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 HYGON（海光信息）[hcu](https://github.com/flagos-ai/FlagTree/tree/triton_v3.1.x/third_party/hcu/)3.1

- Based on Triton 3.1, x64
- Available for K100/BW1000

### 1. Quick start

#### 1.1 Use the preinstalled image (BW1000)

If you use this preinstalled image, you do not need to perform the later installation steps.

```shell
# Plan A: docker pull (22.7GB)
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-hcu3.0-py310-torch2.4.1-ubuntu22.04:202603
docker pull ${IMAGE}
# Plan B: docker load (5.7GB)
IMAGE=flagtree-hcu3.0-py310-torch2.4.1-ubuntu22.04:202603
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-hcu3.0-py310-torch2.4.1-ubuntu22.04.202603.tar.gz
docker load -i flagtree-hcu3.0-py310-torch2.4.1-ubuntu22.04.202603.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --network=host --ipc=host --privileged=true \
    --group-add video --cap-add=SYS_PTRACE \
    --security-opt seccomp=unconfined \
    --device=/dev/kfd --device=/dev/mkfd --device=/dev/dri \
    -v /opt/hyhal:/opt/hyhal \
    -v /etc/localtime:/etc/localtime:ro \
    -v /data:/data -v /home:/home \
    -w /root --name ${CONTAINER} ${IMAGE}
docker exec -it ${CONTAINER} /bin/bash
```

#### 1.2 Source-free Installation

```shell
# Note: First install PyTorch, then execute the following commands
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.10 -m pip install flagtree===0.5.0+hcu3.0 $RES
```

`flagtree` is already installed in the preinstalled image.

### 2. Build from Source

#### 2.1 Manually download the FlagTree dependencies

If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
mkdir -p ~/.flagtree/hcu; cd ~/.flagtree/hcu
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/hcu-llvm20-df0864e-glibc2.35-glibcxx3.4.30-ubuntu-x86_64_v0.3.0.tar.gz
tar zxvf hcu-llvm20-df0864e-glibc2.35-glibcxx3.4.30-ubuntu-x86_64_v0.3.0.tar.gz
```

#### 2.2 Manually download the Triton dependencies

The Triton dependencies are already downloaded and installed in the preinstalled image.
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
export FLAGTREE_BACKEND=hcu
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. Testing and validation

You can check the installed `flagtree` with:

```shell
python3 -m pip show flagtree
```

Refer to [Tests of hcu3.1 backend](https://github.com/flagos-ai/FlagTree/blob/triton_v3.1.x/.github/workflows/hcu3.1-build-and-test.yml)
