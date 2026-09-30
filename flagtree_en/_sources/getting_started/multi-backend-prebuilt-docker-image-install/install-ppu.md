[<a href="../../../flagtree_zh/getting_started/multi-backend-prebuilt-docker-image-install/install-ppu.html">中文版</a>|English]

## 💫 T-Head（平头哥）[ppu](https://github.com/flagos-ai/FlagTree/tree/main/third_party/ppu/)3.6

- Based on Triton 3.6, x64
- Available for 810E, 890P

### 1. Quick start

#### 1.1 Use the image (810E|890P)

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-ppu-py312-torch2.10.0-sdk2.1.0-cu130-ubuntu24.04:202607-3.6-vllm0.24.0
# Plan A: docker pull (42.8GB)
docker pull ${IMAGE}
# Plan B: docker load (18GB)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-ppu-py312-torch2.10.0-sdk2.1.0-cu130-ubuntu24.04.202607-3.6-vllm0.24.0.tar.gz
docker load -i flagtree-ppu-py312-torch2.10.0-sdk2.1.0-cu130-ubuntu24.04.202607-3.6-vllm0.24.0.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
devices=()
for i in {0..7}; do
  devices+=(--device=/dev/alixpu_ppu$i)
done
docker run -dit \
    --network=host \
    --device=/dev/alixpu \
    --device=/dev/alixpu_ctl \
    "${devices[@]}" \
    -v /etc/localtime:/etc/localtime:ro \
    -v /home:/home \
    -w /root --name ${CONTAINER} ${IMAGE} bash
docker exec -it ${CONTAINER} /bin/bash
```

#### 1.2 Source-free Installation

```shell
# Note: First install PyTorch, then execute the following commands
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install flagtree===0.7.0+ppu3.6 $RES
```

### 2. Build from Source

#### 2.1 Manually download the LLVM

If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
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
export FLAGTREE_BACKEND=ppu
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. Testing and validation

After installing `flagtree`, you can check it with:

```shell
python3 -m pip show flagtree
```

Refer to [Tests of ppu3.6 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/ppu3.6-build-and-test.yml)

### 4. Run Qwen vLLM benchmark

#### 4.1 Install FlagOS

Install flagtree as described above.

Install flag_gems and vllm-plugin-fl as follows.

```shell
git clone https://github.com/flagos-ai/FlagGems.git
cd FlagGems; git checkout v5.3.4
python3 -m pip install --no-build-isolation .
```

```shell
git clone https://github.com/flagos-ai/vllm-plugin-FL.git
cd vllm-plugin-FL; git checkout f4319bd2
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
export CUDA_VISIBLE_DEVICES=0,1  # 810E * 2 for Qwen3.6-27B
export VLLM_QWEN3_PORT=8000
```

```shell
export BENCH_SCRIPT_DIR="${GIT_DIR}/FlagTree/.github/workflows/benchmark/ppu/ppu3.6-qwen3.6"
cd ${MODEL_DIR}
vim ${BENCH_SCRIPT_DIR}/start.sh  # Edit vllm serve Qwen3.6-27B or Qwen3.6-35B-A3B
bash ${BENCH_SCRIPT_DIR}/start.sh
bash ${BENCH_SCRIPT_DIR}/test.sh
vim ${BENCH_SCRIPT_DIR}/all_perf.py  # Edit TOKENIZER_PATH
bash ${BENCH_SCRIPT_DIR}/perf.sh
bash ${BENCH_SCRIPT_DIR}/stop.sh
```

Refer to [Qwen Benchmark of ppu3.6 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/ppu3.6-qwen-benchmark.yml)
