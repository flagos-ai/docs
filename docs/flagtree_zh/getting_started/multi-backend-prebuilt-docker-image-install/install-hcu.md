[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-hcu.html">英文版</a>|中文版]

## 💫 HYGON（海光信息）[hcu](https://github.com/flagos-ai/FlagTree/tree/main/third_party/hcu/)3.6

- 基于 Triton 3.6，x64
- 适用于 K100/BW1000

### 1. 快速开始

#### 1.1 使用镜像（BW1000）

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-hcu-py310-torch2.10.0-dtk26.04-ubuntu22.04:202608-3.6-vllm0.24.0
# 方案 A：docker pull（30.6GB）
docker pull ${IMAGE}
# 方案 B：docker load（8.1GB）
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

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.10 -m pip install flagtree===0.7.0+hcu3.6 $RES
```

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/hcu; cd ~/.flagtree/hcu
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/hcu-llvm22-b0ca808-glibc2.35-glibcxx3.4.30-ubuntu-x86_64_v0.5.0.tar.gz
tar zxvf hcu-llvm22-b0ca808-glibc2.35-glibcxx3.4.30-ubuntu-x86_64_v0.5.0.tar.gz
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
export FLAGTREE_BACKEND=hcu
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [hcu3.6 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/hcu3.6-build-and-test.yml)

### 4. 运行 Qwen vLLM 基准测试

#### 4.1 安装 FlagOS

按上述步骤安装 flagtree。

按以下方式安装 flag_gems 与 vllm-plugin-fl。

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

#### 4.2 下载模型

```shell
python3 -m modelscope.cli.cli download --model Qwen/Qwen3.6-27B \
    --local_dir ${MODEL_DIR}/Qwen3.6-27B
python3 -m modelscope.cli.cli download --model Qwen/Qwen3.6-35B-A3B \
    --local_dir ${MODEL_DIR}/Qwen3.6-35B-A3B
```

#### 4.3 运行基准测试

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

参考 [hcu3.6 后端 Qwen 基准测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/hcu3.6-qwen-benchmark.yml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 HYGON（海光信息）[hcu](https://github.com/flagos-ai/FlagTree/tree/triton_v3.1.x/third_party/hcu/)3.1

- 基于 Triton 3.1，x64
- 适用于 K100/BW1000

### 1. 快速开始

#### 1.1 使用预装镜像（BW1000）

如果使用此预装镜像，则无需执行后续安装步骤。

```shell
# 方案 A：docker pull（22.7GB）
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-hcu3.0-py310-torch2.4.1-ubuntu22.04:202603
docker pull ${IMAGE}
# 方案 B：docker load（5.7GB）
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

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.10 -m pip install flagtree===0.5.0+hcu3.0 $RES
```

预装镜像中已安装 `flagtree`。

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/hcu; cd ~/.flagtree/hcu
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/hcu-llvm20-df0864e-glibc2.35-glibcxx3.4.30-ubuntu-x86_64_v0.3.0.tar.gz
tar zxvf hcu-llvm20-df0864e-glibc2.35-glibcxx3.4.30-ubuntu-x86_64_v0.3.0.tar.gz
```

#### 2.2 手动下载 Triton 依赖项

Triton 依赖项已在预装镜像中下载并安装完毕。
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
export FLAGTREE_BACKEND=hcu
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

可通过以下命令检查已安装的 `flagtree`：

```shell
python3 -m pip show flagtree
```

参考 [hcu3.1 后端测试](https://github.com/flagos-ai/FlagTree/blob/triton_v3.1.x/.github/workflows/hcu3.1-build-and-test.yml)
