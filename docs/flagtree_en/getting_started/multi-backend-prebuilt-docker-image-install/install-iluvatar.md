[<a href="../../../flagtree_zh/getting_started/multi-backend-prebuilt-docker-image-install/install-iluvatar.html">中文版</a>|English]

## 💫 ILUVATAR（天数智芯）[iluvatar](https://github.com/flagos-ai/FlagTree/tree/main/third_party/iluvatar/)3.6

- Based on Triton 3.6, x64
- Available for MR-V100, BI-V150

### 1. Quick start

#### 1.1 Use the image (BI-V150)

```shell
modinfo iluvatar | grep "description"  # 6384f0db
ixsmi  # IX-ML: 4.4.0  Driver Version: 4.5.0  CUDA Version: 10.2
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-iluvatar-py312-torch2.10.0-corex4.5.0-cu10.2-ubuntu24.04:202609-3.6-vllm0.24.0
# Plan A: docker pull (55.3GB)
docker pull ${IMAGE}
# Plan B: docker load (20GB)
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-iluvatar-py312-torch2.10.0-corex4.5.0-cu10.2-ubuntu24.04.202609-3.6-vllm0.24.0.tar.gz
docker load -i flagtree-iluvatar-py312-torch2.10.0-corex4.5.0-cu10.2-ubuntu24.04.202609-3.6-vllm0.24.0.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --net=host --pid=host --privileged \
    --cap-add=ALL \
    --security-opt seccomp=unconfined \
    -v /usr/local/corex-4.5.0/bin/ixsmi:/usr/local/corex-4.5.0/bin/ixsmi \
    -v /lib/modules:/lib/modules -v /dev:/dev  \
    -v /etc/localtime:/etc/localtime:ro \
    -v /data1:/data1 -v /home:/home \
    -w /root --name ${CONTAINER} ${IMAGE} bash
docker exec -it ${CONTAINER} /bin/bash
```

#### 1.2 Source-free Installation

```shell
# Note: First install PyTorch, then execute the following commands
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install flagtree===0.7.0+iluvatar3.6 $RES
```

### 2. Build from Source

#### 2.1 Manually download the FlagTree dependencies

If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
mkdir -p ~/.flagtree/iluvatar; cd ~/.flagtree/iluvatar
# llvm
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/iluvatar-llvm22-x86_64_v0.6.1.tar.gz
tar zxvf iluvatar-llvm22-x86_64_v0.6.1.tar.gz
```

To check out which commit of FlagPrism, please refer to https://github.com/flagos-ai/FlagTree/blob/main/python/setup_tools/utils/__init__.py

```shell
cd ${YOUR_CODE_DIR}/FlagTree/third_party
git clone https://github.com/flagos-ai/FlagPrism.git
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
export FLAGTREE_BACKEND=iluvatar
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. Testing and validation

After installing `flagtree`, you can check it with:

```shell
python3 -m pip show flagtree
```

Refer to [Tests of iluvatar3.6 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/iluvatar3.6-build-and-test.yml)

### 4. Run Qwen vLLM benchmark

#### 4.1 Install FlagOS

Install flagtree as described above.

Install flag_gems and vllm-plugin-fl as follows.

```shell
git clone https://github.com/flagos-ai/FlagGems.git
cd FlagGems; git checkout v5.3.5
python3 -m pip install --no-build-isolation .
```

```shell
git clone https://github.com/flagos-ai/vllm-plugin-FL.git
cd vllm-plugin-FL; git checkout 13eb9be69
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
export CUDA_VISIBLE_DEVICES=0,1,2,3  # BI-V150 * 4 for Qwen3.6-27B
export VLLM_QWEN3_PORT=8000
```

```shell
export BENCH_SCRIPT_DIR="${GIT_DIR}/FlagTree/.github/workflows/benchmark/iluvatar/iluvatar3.6-qwen3.6"
cd ${MODEL_DIR}
vim ${BENCH_SCRIPT_DIR}/start.sh  # Edit vllm serve Qwen3.6-27B or Qwen3.6-35B-A3B
bash ${BENCH_SCRIPT_DIR}/start.sh
bash ${BENCH_SCRIPT_DIR}/test.sh
vim ${BENCH_SCRIPT_DIR}/all_perf.py  # Edit TOKENIZER_PATH
bash ${BENCH_SCRIPT_DIR}/perf.sh
bash ${BENCH_SCRIPT_DIR}/stop.sh
```

Refer to [Qwen Benchmark of iluvatar3.6 backend](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/iluvatar3.6-qwen-benchmark.yml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 ILUVATAR（天数智芯）[iluvatar](https://github.com/flagos-ai/FlagTree/tree/triton_v3.1.x/third_party/iluvatar/)3.1

- Based on Triton 3.1, x64
- Available for MR-V100, BI-V150

### 1. Quick start

#### 1.1 Use the image (BI-V150)

```shell
modinfo iluvatar | grep "description"  # f65d8ac7
# Plan A: docker pull (17.9GB)
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-iluvatar-py312-torch2.7.1-4.4.0release_f65d8ac7-ubuntu24.04:202604-base
docker pull ${IMAGE}
# Plan B: docker load (5.1GB)
IMAGE=flagtree-iluvatar-py312-torch2.7.1-4.4.0release_f65d8ac7-ubuntu24.04:202604-base
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-iluvatar-py312-torch2.7.1-4.4.0release_f65d8ac7-ubuntu24.04.202604-base.tar.gz
docker load -i flagtree-iluvatar-py312-torch2.7.1-4.4.0release_f65d8ac7-ubuntu24.04.202604-base.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --net=host --pid=host --privileged \
    --cap-add=ALL \
    --security-opt seccomp=unconfined \
    -v /lib/modules:/lib/modules -v /dev:/dev  \
    -v /etc/localtime:/etc/localtime:ro \
    -v /data1:/data1 -v /home:/home \
    -w /root --name ${CONTAINER} ${IMAGE}
docker exec -it ${CONTAINER} /bin/bash
```

#### 1.2 Source-free Installation

```shell
# Note: First install PyTorch, then execute the following commands
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install flagtree===0.5.1+iluvatar3.1 $RES
```

### 2. Build from Source

#### 2.1 Manually download the FlagTree dependencies

If your network connection is available, you do not need to download the dependencies which will be fetched automatically during the build.

```shell
mkdir -p ~/.flagtree/iluvatar; cd ~/.flagtree/iluvatar
# llvm
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/iluvatar-llvm18-x86_64_v0.5.0.tar.gz
tar zxvf iluvatar-llvm18-x86_64_v0.5.0.tar.gz

# iluvatarTritonPlugin
ABI=$(echo | g++ -dM -E -x c++ - | awk '/__GXX_ABI_VERSION/{print $3}')
case "${ABI}" in  # For python3.12 in the image
  1018) PLUGIN_TGZ=iluvatarTritonPlugin-cpython3.12-glibc2.39-glibcxx3.4.33-cxxabi1.3.15-ubuntu-x86_64_v0.5.0.tar.gz ;;
  *) echo "Unsupported __GXX_ABI_VERSION=${ABI}"; exit 1 ;;
esac
case "${ABI}" in  # For python3.10, not suitable for this image
  1013) PLUGIN_TGZ=iluvatarTritonPlugin-cpython3.10-glibc2.17-glibcxx3.4.19-cxxabi1.3.12-linux-x86_64_v0.5.0.tar.gz ;;
  1016) PLUGIN_TGZ=iluvatarTritonPlugin-cpython3.10-glibc2.35-glibcxx3.4.30-cxxabi1.3.13-ubuntu-x86_64_v0.5.0.tar.gz ;;
  1018) PLUGIN_TGZ=iluvatarTritonPlugin-cpython3.10-glibc2.39-glibcxx3.4.33-cxxabi1.3.15-ubuntu-x86_64_v0.5.0.tar.gz ;;
  *) echo "Unsupported __GXX_ABI_VERSION=${ABI}"; exit 1 ;;
esac
wget "https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/${PLUGIN_TGZ}"
tar zxvf "${PLUGIN_TGZ}"
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
export FLAGTREE_BACKEND=iluvatar
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. Testing and validation

After installing `flagtree`, you can check it with:

```shell
python3 -m pip show flagtree
```

Refer to [Tests of iluvatar3.1 backend](https://github.com/flagos-ai/FlagTree/blob/triton_v3.1.x/.github/workflows/iluvatar3.1-build-and-test.yml)
