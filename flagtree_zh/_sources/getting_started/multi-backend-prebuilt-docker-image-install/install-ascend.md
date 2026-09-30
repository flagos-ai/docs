[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-ascend.html">英文版</a>|中文版]

## 💫 Huawei Ascend（华为昇腾）[ascend](https://github.com/flagos-ai/FlagTree/blob/triton_v3.5.x/third_party/ascend)3.5

- 基于 Triton 3.5，aarch64
- 适用于 910B, 910C

### 1. 快速开始

#### 1.1 使用镜像（910B|910C）

```shell
# 910B 方案 A：docker pull（13.3GB）
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-ascend3.5-910b-py311-cann9.0.0-ubuntu22.04-aarch64:202606-torch2.9.0-base
docker pull ${IMAGE}
# 910B 方案 B：docker load（4.8GB）
IMAGE=flagtree-ascend3.5-910b-py311-cann9.0.0-ubuntu22.04-aarch64:202606-torch2.9.0-base
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-ascend3.5-910b-py311-cann9.0.0-ubuntu22.04-aarch64.202606-torch2.9.0-base.tar.gz
docker load -i flagtree-ascend3.5-910b-py311-cann9.0.0-ubuntu22.04-aarch64.202606-torch2.9.0-base.tar.gz
```

```shell
# 910C 方案 A：docker pull（19.2GB）
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-ascend3.5-910c-py311-cann9.0.0-ubuntu22.04-aarch64:202608-torch2.10.0-vllm0.20.2
docker pull ${IMAGE}
# 910C 方案 B：docker load（6.6GB）
IMAGE=flagtree-ascend3.5-910c-py311-cann9.0.0-ubuntu22.04-aarch64:202608-torch2.10.0-vllm0.20.2
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-ascend3.5-910c-py311-cann9.0.0-ubuntu22.04-aarch64.202608-torch2.10.0-vllm0.20.2.tar.gz
docker load -i flagtree-ascend3.5-910c-py311-cann9.0.0-ubuntu22.04-aarch64.202608-torch2.10.0-vllm0.20.2.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit -u 0 --user=root \
    --network=host --pid=host --ipc=host --privileged \
    -v /usr/local/Ascend/driver:/usr/local/Ascend/driver \
    -v /usr/local/Ascend/add-ons/:/usr/local/Ascend/add-ons/ \
    -v /usr/local/sbin/:/usr/local/sbin/ \
    -v /etc/ascend_install.info:/etc/ascend_install.info \
    --device=/dev/davinci0 --device=/dev/davinci1 \
    --device=/dev/davinci2 --device=/dev/davinci3 \
    --device=/dev/davinci4 --device=/dev/davinci5 \
    --device=/dev/davinci6 --device=/dev/davinci7 \
    --device=/dev/davinci_manager --device=/dev/devmm_svm --device=/dev/hisi_hdc \
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
python3.11 -m pip install flagtree===0.7.0+ascend3.5 $RES
```

### 2. 从源码构建

#### 2.1 安装 CANN

- 910B 镜像已预装 A2 CANN，910C 镜像已预装 A3 CANN。
- 可在 https://www.hiascend.com/developer/download/community/result?module=cann 注册账号，下载对应平台的 `cann-ops`。

```shell
# cann-toolkit（A2|A3）
chmod +x Ascend-cann-toolkit_9.0.0_linux-aarch64.run
./Ascend-cann-toolkit_9.0.0_linux-aarch64.run --install
# 910B（A2）的 cann-ops
chmod +x Ascend-cann-910b-ops_9.0.0_linux-aarch64.run
./Ascend-cann-910b-ops_9.0.0_linux-aarch64.run --install
# 910C（A3）的 cann-ops
chmod +x Ascend-cann-A3-ops_9.0.0_linux-aarch64.run
./Ascend-cann-A3-ops_9.0.0_linux-aarch64.run --install
```

#### 2.2 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/ascend; cd ~/.flagtree/ascend
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/llvm-7d5de303-ubuntu-aarch64-python311-compat_v0.6.0.tar.gz
tar zxvf llvm-7d5de303-ubuntu-aarch64-python311-compat_v0.6.0.tar.gz
```

关于 flir & FlagPrism 应检出哪个 commit，请参考 https://github.com/flagos-ai/FlagTree/blob/triton_v3.5.x/python/setup_tools/utils/__init__.py

```shell
cd ${YOUR_CODE_DIR}/FlagTree/third_party
git clone https://github.com/flagos-ai/flir.git
git clone https://github.com/flagos-ai/FlagPrism.git
```

关于 AscendNPU-IR 应检出哪个 commit，请参考 https://github.com/flagos-ai/FlagTree/blob/triton_v3.5.x/python/setup_tools/utils/ascend.py

```shell
cd ${YOUR_CODE_DIR}/FlagTree/third_party/ascend
git clone https://github.com/flagos-ai/FlagTree-AscendNPU-IR.git
```

#### 2.3 手动下载 Triton 依赖项

Triton 依赖项已在镜像中下载并安装完毕。
如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# 适用于 Triton 3.5（aarch64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.5.x-linux-aarch64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.5.x-linux-aarch64.tar.gz
```

执行上述脚本后，原有的 ~/.triton 目录将被重命名，并创建一个新的 ~/.triton 目录用于存放预下载的包。
请注意，脚本执行过程中会提示手动确认。

#### 2.4 构建命令

```shell
cd ${YOUR_CODE_DIR}/FlagTree
git checkout -b triton_v3.5.x origin/triton_v3.5.x
export PATH=~/.flagtree/ascend/llvm-7d5de303-ubuntu-aarch64-python311-compat/bin/:${PATH}  # clang
export FLAGTREE_BACKEND=ascend
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

测试前需执行 `source /usr/local/Ascend/ascend-toolkit/set_env.sh`

参考 [ascend3.5 后端测试](https://github.com/flagos-ai/FlagTree/blob/triton_v3.5.x/.github/workflows/ascend3.5-build-and-test.yml)

### 4. 运行 Qwen vLLM 基准测试

#### 4.1 使用镜像（910C）

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-ascend3.5-910c-py311-cann9.0.0-ubuntu22.04-aarch64:202608-torch2.10.0-vllm0.20.2
```

#### 4.2 安装 FlagOS

按上述步骤安装 flagtree。

按以下方式安装 flag_gems 与 vllm-plugin-fl。

```shell
git clone https://github.com/flagos-ai/FlagGems.git
cd FlagGems; git checkout qwen-vllm_for_ascend
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
export BENCH_SCRIPT_DIR="${GIT_DIR}/FlagTree/.github/workflows/benchmark/ascend/ascend3.5-qwen3.6"
cd ${MODEL_DIR}
bash ${BENCH_SCRIPT_DIR}/start.sh
bash ${BENCH_SCRIPT_DIR}/test.sh
bash ${BENCH_SCRIPT_DIR}/perf.sh
bash ${BENCH_SCRIPT_DIR}/stop.sh
```

参考 [ascend3.5 后端 Qwen 基准测试](https://github.com/flagos-ai/FlagTree/tree/triton_v3.5.x/.github/workflows/ascend3.5-qwen-benchmark.yaml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 Huawei Ascend（华为昇腾）[ascend](https://github.com/flagos-ai/FlagTree/blob/triton_v3.2.x/third_party/ascend)3.2

- 基于 Triton 3.2，aarch64
- 适用于 910B, 910C

### 1. 快速开始

#### 1.1 使用预装镜像（910C）

如果使用此预装镜像，910C 无需执行后续安装步骤，910B 只需执行步骤 2.1。

```shell
# 方案 A：docker pull（26.2GB）
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-ascend-910c-py311-torch2.6.0-cann8.5.0-ubuntu22.04-aarch64:202603
docker pull ${IMAGE}
# 方案 B：docker load（8.8GB）
IMAGE=flagtree-ascend-910c-py311-torch2.6.0-cann8.5.0-ubuntu22.04-aarch64:202603
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-ascend-910c-py311-torch2.6.0-cann8.5.0-ubuntu22.04-aarch64.202603.tar.gz
docker load -i flagtree-ascend-910c-py311-torch2.6.0-cann8.5.0-ubuntu22.04-aarch64.202603.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit -u 0 --user=root \
    --network=host --pid=host --ipc=host --privileged \
    -v /usr/local/Ascend/driver:/usr/local/Ascend/driver \
    -v /usr/local/Ascend/add-ons/:/usr/local/Ascend/add-ons/ \
    -v /usr/local/sbin/:/usr/local/sbin/ \
    -v /etc/ascend_install.info:/etc/ascend_install.info \
    --device=/dev/davinci0 --device=/dev/davinci1 \
    --device=/dev/davinci2 --device=/dev/davinci3 \
    --device=/dev/davinci4 --device=/dev/davinci5 \
    --device=/dev/davinci6 --device=/dev/davinci7 \
    --device=/dev/davinci_manager --device=/dev/devmm_svm --device=/dev/hisi_hdc \
    -v /etc/localtime:/etc/localtime:ro \
    -v /data:/data -v /home:/home -v /tmp:/tmp \
    -w /root --name ${CONTAINER} ${IMAGE} bash
docker exec -it ${CONTAINER} /bin/bash
```

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.11 -m pip install flagtree===0.6.0+ascend3.2 $RES
```

预装镜像中已安装 `flagtree`。

### 2. 从源码构建

#### 2.1 安装 CANN

- 910C 镜像已预装 A3 CANN。910B 需在 https://www.hiascend.com/developer/download/community/result?module=cann 注册账号，下载对应平台的 `cann-ops`。

```shell
# cann-toolkit（A2|A3）
chmod +x Ascend-cann-toolkit_8.5.0_linux-aarch64.run
./Ascend-cann-toolkit_8.5.0_linux-aarch64.run --install
# 910B（A2）的 cann-ops
chmod +x Ascend-cann-910b-ops_8.5.0_linux-aarch64.run
./Ascend-cann-910b-ops_8.5.0_linux-aarch64.run --install
# 910C（A3）的 cann-ops
chmod +x Ascend-cann-A3-ops_8.5.0_linux-aarch64.run
./Ascend-cann-A3-ops_8.5.0_linux-aarch64.run --install
```

#### 2.2 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/ascend; cd ~/.flagtree/ascend
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/llvm-a66376b0-ubuntu-aarch64-python311-compat_v0.3.0.tar.gz
tar zxvf llvm-a66376b0-ubuntu-aarch64-python311-compat_v0.3.0.tar.gz
```

```shell
cd ${YOUR_CODE_DIR}/FlagTree/third_party
git clone https://github.com/flagos-ai/flir.git
cd flir
git checkout -b triton_v3.3.x origin/triton_v3.3.x  # For flagtree triton_v3.2.x triton_v3.3.x
```

```shell
cd ${YOUR_CODE_DIR}/FlagTree/third_party/ascend
git clone https://gitcode.com/Ascend/AscendNPU-IR.git
git checkout 5a3921f8
```

#### 2.3 手动下载 Triton 依赖项

Triton 依赖项已在预装镜像中下载并安装完毕。
如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# 适用于 Triton 3.2（aarch64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.2.x-linux-aarch64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.2.x-linux-aarch64.tar.gz
```

执行上述脚本后，原有的 ~/.triton 目录将被重命名，并创建一个新的 ~/.triton 目录用于存放预下载的包。
请注意，脚本执行过程中会提示手动确认。

#### 2.4 构建命令

```shell
cd ${YOUR_CODE_DIR}/FlagTree/python
git checkout -b triton_v3.2.x origin/triton_v3.2.x
export FLAGTREE_BACKEND=ascend
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

可通过以下命令检查已安装的 `flagtree`：

```shell
python3 -m pip show flagtree
```

测试前需执行 `source /usr/local/Ascend/ascend-toolkit/set_env.sh`

参考 [ascend3.2 后端测试](https://github.com/flagos-ai/FlagTree/blob/triton_v3.2.x/.github/workflows/ascend-build-and-test.yml)
