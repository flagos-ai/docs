[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-nv.html">英文版</a>|中文版]

## 💫 NVIDIA [nvidia](https://github.com/flagos-ai/FlagTree/tree/main/third_party/nvidia/)

- 基于 Triton 3.1/3.2/3.3/3.4/3.5/3.6/3.7/3.8，x64

### 1. 快速开始

#### 1.1 使用镜像（Triton 3.6）

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-py312-torch2.8.0a0_5228986c39.nv25.05-cuda12.9-ubuntu24.04:202608-3.6-base
# 方案 A：docker pull（36.1GB）
docker pull ${IMAGE}
# 方案 B：docker load（16GB）
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

#### 1.2 免源码安装（Triton 3.6）

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install flagtree===0.7.0 $RES
```

### 2. 从源码构建

#### 2.1 手动下载 LLVM

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
cd ${YOUR_LLVM_DOWNLOAD_DIR}
# 适用于 Triton 3.1
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-10dc3a8e-ubuntu-x64.tar.gz
tar zxvf llvm-10dc3a8e-ubuntu-x64.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-10dc3a8e-ubuntu-x64
# 适用于 Triton 3.2
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-86b69c31-ubuntu-x64.tar.gz
tar zxvf llvm-86b69c31-ubuntu-x64.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-86b69c31-ubuntu-x64
# 适用于 Triton 3.3
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-a66376b0-ubuntu-x64.tar.gz
tar zxvf llvm-a66376b0-ubuntu-x64.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-a66376b0-ubuntu-x64
# 适用于 Triton 3.4
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-8957e64a-ubuntu-x64.tar.gz
tar zxvf llvm-8957e64a-ubuntu-x64.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-8957e64a-ubuntu-x64
# 适用于 Triton 3.5
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-7d5de303-ubuntu-x64.tar.gz
tar zxvf llvm-7d5de303-ubuntu-x64.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-7d5de303-ubuntu-x64
# 适用于 Triton 3.7
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-1f126a6d-ubuntu-x64-1.tar.gz
tar zxvf llvm-1f126a6d-ubuntu-x64-1.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-1f126a6d-ubuntu-x64-1
# 适用于 Triton 3.8
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-5f07f818-ubuntu-x64-1.tar.gz
tar zxvf llvm-5f07f818-ubuntu-x64-1.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-5f07f818-ubuntu-x64-1
# 适用于 Triton 3.6（方案 A）
wget https://oaitriton.blob.core.windows.net/public/llvm-builds/llvm-f6ded0be-ubuntu-x64.tar.gz
tar zxvf llvm-f6ded0be-ubuntu-x64.tar.gz
export LLVM_SYSPATH=${YOUR_LLVM_DOWNLOAD_DIR}/llvm-f6ded0be-ubuntu-x64
# 适用于所有版本
export LLVM_INCLUDE_DIRS=$LLVM_SYSPATH/include
export LLVM_LIBRARY_DIR=$LLVM_SYSPATH/lib
```

```shell
# 适用于 Triton 3.6（方案 B，推荐）
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install mlir $RES
```

关于 FlagCX 应检出哪个 commit，请参考 https://github.com/flagos-ai/FlagTree/blob/main/python/setup_tools/utils/__init__.py

```shell
cd ${YOUR_CODE_DIR}/FlagTree/third_party/tle/third_party
git clone https://github.com/flagos-ai/FlagCX.git
```

#### 2.2 手动下载 Triton 依赖项

Triton 依赖项已在镜像中下载并安装完毕。
如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# 适用于 Triton 3.1（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.1.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.1.x-linux-x64.tar.gz
# 适用于 Triton 3.2（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.2.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.2.x-linux-x64.tar.gz
# 适用于 Triton 3.2（aarch64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.2.x-linux-aarch64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.2.x-linux-aarch64.tar.gz
# 适用于 Triton 3.3（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.3.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.3.x-linux-x64.tar.gz
# 适用于 Triton 3.4（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.4.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.4.x-linux-x64.tar.gz
# 适用于 Triton 3.5（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.5.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.5.x-linux-x64.tar.gz
# 适用于 Triton 3.6（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.6.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.6.x-linux-x64.tar.gz
# 适用于 Triton 3.7（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.7.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.7.x-linux-x64.tar.gz
# 适用于 Triton 3.8（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.8.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.8.x-linux-x64.tar.gz
```

执行上述脚本后，原有的 ~/.triton 目录将被重命名，并创建一个新的 ~/.triton 目录用于存放预下载的包。
请注意，脚本执行过程中会提示手动确认。

#### 2.3 构建命令

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
# 如需随后构建其他后端，请清理 LLVM 相关环境变量
unset LLVM_SYSPATH LLVM_INCLUDE_DIRS LLVM_LIBRARY_DIR
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [nvidia3.6 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/nvidia3.6-build-and-test.yml)、[nvidia3.7 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/nvidia3.7-build-and-test.yml) 和 [nvidia3.8 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/nvidia3.8-build-and-test.yml)

### 4. 运行 Qwen vLLM 基准测试

#### 4.1 使用镜像（Triton 3.6）

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-py312-torch2.11.0_cu130-cuda13.0-ubuntu24.04:202609-3.6-vllm0.24.0
# 方案 A：docker pull（42GB）
docker pull ${IMAGE}
# 方案 B：docker load（17GB）
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

#### 4.2 安装 FlagOS

按上述步骤安装 flagtree。

按以下方式安装 flag_gems 与 vllm-plugin-fl。

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

#### 4.3 下载模型

```shell
python3 -m modelscope.cli.cli download --model Qwen/Qwen3.6-27B \
    --local_dir ${MODEL_DIR}/Qwen3.6-27B
python3 -m modelscope.cli.cli download --model Qwen/Qwen3.6-35B-A3B \
    --local_dir ${MODEL_DIR}/Qwen3.6-35B-A3B
```

#### 4.4 运行基准测试

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

参考 [nvidia3.6 后端 Qwen 基准测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/nvidia3.6-qwen-benchmark.yml)

### 常见问题

#### Q：安装后运行程序报错：找不到 GLIBC 或 GLIBCXX 版本

A：请检查环境中 libc.so.6 与 libstdc++.so.6.0.30 支持的 GLIBC / GLIBCXX 版本：

```shell
strings /lib/x86_64-linux-gnu/libc.so.6 |grep GLIBC
strings /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30 | grep GLIBCXX
```

若所需的 GLIBC / GLIBCXX 版本受支持，还可尝试：

```shell
export LD_PRELOAD="/lib/x86_64-linux-gnu/libc.so.6"  # If GLIBC cannot be found
export LD_PRELOAD="/usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30"  # If GLIBCXX cannot be found
export LD_PRELOAD="/lib/x86_64-linux-gnu/libc.so.6 \
    /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30"  # If neither GLIBC nor GLIBCXX can be found
```
