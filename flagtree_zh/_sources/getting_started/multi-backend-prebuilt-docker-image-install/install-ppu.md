[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-ppu.html">英文版</a>|中文版]

## 💫 T-Head（平头哥）[ppu](https://github.com/flagos-ai/FlagTree/tree/main/third_party/ppu/)3.6

- 基于 Triton 3.6，x64
- 适用于 810E, 890P

### 1. 快速开始

#### 1.1 使用镜像（810E|890P）

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-ppu-py312-torch2.10.0-sdk2.1.0-cu130-ubuntu24.04:202607-3.6-vllm0.24.0
# 方案 A：docker pull（42.8GB）
docker pull ${IMAGE}
# 方案 B：docker load（18GB）
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

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install flagtree===0.7.0+ppu3.6 $RES
```

### 2. 从源码构建

#### 2.1 手动下载 LLVM

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install mlir $RES
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
export FLAGTREE_BACKEND=ppu
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [ppu3.6 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/ppu3.6-build-and-test.yml)

### 4. 运行 Qwen vLLM 基准测试

#### 4.1 安装 FlagOS

按上述步骤安装 flagtree。

按以下方式安装 flag_gems 与 vllm-plugin-fl。

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

参考 [ppu3.6 后端 Qwen 基准测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/ppu3.6-qwen-benchmark.yml)
