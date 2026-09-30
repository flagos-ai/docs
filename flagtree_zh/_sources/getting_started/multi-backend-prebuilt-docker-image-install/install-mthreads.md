[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-mthreads.html">英文版</a>|中文版]

## 💫 Moore Threads（摩尔线程）[mthreads](https://github.com/flagos-ai/FlagTree/tree/main/third_party/mthreads/)3.6

- 基于 Triton 3.6，x64
- 适用于 S4000/S5000

### 1. 快速开始

#### 1.1 使用镜像（Triton 3.6，MTT-S5000）

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-mthreads-py310-torch2.7.1-musa4.3.5-mcc5.1.0-ubuntu22.04:202608-3.6-base
# 方案 A：docker pull（53.8GB）
docker pull ${IMAGE}
# 方案 B：docker load（15GB）
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

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.10 -m pip install flagtree===0.7.0+mthreads3.6 $RES
```

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/mthreads; cd ~/.flagtree/mthreads
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/mthreads-llvm22-x64_v0.6.1.tar.gz
tar zxvf mthreads-llvm22-x64_v0.6.1.tar.gz
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/mthreads_local_binary_v0.6.1.tar.gz
tar zxvf mthreads_local_binary_v0.6.1.tar.gz
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
export FLAGTREE_BACKEND=mthreads
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [mthreads3.6 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/mthreads3.6-build-and-test.yml)

### 4. 运行 Qwen vLLM 基准测试

#### 4.1 使用镜像（MTT-S5000）

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-mthreads-py310-torch2.7.1-musa4.3.5-mcc5.1.0-ubuntu22.04:202607-3.6-vllm0.20.2
```

#### 4.2 安装 FlagOS

按上述步骤安装 flagtree。

按以下方式安装 flag_gems 与 vllm-plugin-fl。

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

参考 [mthreads3.6 后端 Qwen 基准测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/mthreads3.6-qwen-benchmark.yml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 Moore Threads（摩尔线程）[mthreads](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/third_party/mthreads/)3.2

- 基于 Triton 3.2，x64
- 适用于 S4000/S5000

### 1. 快速开始

#### 1.1 使用镜像（Triton 3.2，MTT-S5000）

```shell
# 方案 A：docker pull（59.4GB）
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-mthreads3.2-py310-torch2.7.1-musa5.1.0-ubuntu22.04:202605-base
docker pull ${IMAGE}
# 方案 B：docker load（17GB）
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

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.10 -m pip install flagtree===0.5.1+mthreads3.2 $RES
```

mthreads3.2 版本需要按步骤 `2.1` 安装 FlagTree 依赖项。

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/mthreads; cd ~/.flagtree/mthreads
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/mthreads-llvm20-x64_v0.5.0.tar.gz
tar zxvf mthreads-llvm20-x64_v0.5.0.tar.gz
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/mthreadsTritonPlugin-triton3.2-cpython3.10-glibc2.35-glibcxx3.4.30-cxxabi1.3.13-x64_v0.5.0.tar.gz
tar zxvf mthreadsTritonPlugin-triton3.2-cpython3.10-glibc2.35-glibcxx3.4.30-cxxabi1.3.13-x64_v0.5.0.tar.gz
```

#### 2.2 手动下载 Triton 依赖项

Triton 依赖项已在镜像中下载并安装完毕。
如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# 适用于 Triton 3.2（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.2.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.2.x-linux-x64.tar.gz
```

执行上述脚本后，原有的 ~/.triton 目录将被重命名，并创建一个新的 ~/.triton 目录用于存放预下载的包。
请注意，脚本执行过程中会提示手动确认。

#### 2.3 构建命令

```shell
cd ${YOUR_CODE_DIR}/FlagTree/python
git checkout -b triton_v3.2.x origin/triton_v3.2.x
export FLAGTREE_BACKEND=mthreads
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [mthreads3.2 后端测试](https://github.com/flagos-ai/FlagTree/tree/triton_v3.2.x/.github/workflows/mthreads-build-and-test.yml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 Moore Threads（摩尔线程）[mthreads](https://github.com/flagos-ai/FlagTree/tree/triton_v3.1.x/third_party/mthreads/)3.1

- 基于 Triton 3.1，x64/aarch64
- 适用于 S4000/S5000

### 1. 快速开始

#### 1.1 使用预装镜像（Triton 3.1，MTT-S5000）

如果使用此预装镜像，则无需执行后续安装步骤。

```shell
# 方案 A：docker pull（55.3GB）
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-mthreads-py310-torch2.7.1-musa4.3.5-ubuntu22.04:202603
docker pull ${IMAGE}
# 方案 B：docker load（18GB）
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

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.10 -m pip install flagtree===0.5.1+mthreads3.1 $RES
```

预装镜像中已安装 `flagtree`。

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

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

#### 2.2 手动下载 Triton 依赖项

Triton 依赖项已在镜像中下载并安装完毕。
如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# 适用于 Triton 3.1（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.1.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.1.x-linux-x64.tar.gz
```

执行上述脚本后，原有的 ~/.triton 目录将被重命名，并创建一个新的 ~/.triton 目录用于存放预下载的包。
请注意，脚本执行过程中会提示手动确认。

#### 2.3 构建命令

```shell
cd ${YOUR_CODE_DIR}/FlagTree/python
git checkout -b triton_v3.1.x origin/triton_v3.1.x
export FLAGTREE_BACKEND=mthreads
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

可通过以下命令检查已安装的 `flagtree`：

```shell
python3 -m pip show flagtree
```

参考 [mthreads3.1 后端测试](https://github.com/flagos-ai/FlagTree/blob/triton_v3.1.x/.github/workflows/mthreads-build-and-test.yml)

对于使用 `tl.dot` 的 Triton 3.1 算子，设置环境变量 `export MUSA_ENABLE_SQMMA=1` 可提升性能。
