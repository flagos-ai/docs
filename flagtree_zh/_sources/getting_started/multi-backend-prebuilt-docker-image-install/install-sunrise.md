[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-sunrise.html">英文版</a>|中文版]

## 💫 Sunrise（曦望芯科）[sunrise](https://github.com/flagos-ai/FlagTree/tree/main/third_party/sunrise/)3.6

- 基于 Triton 3.6，x64
- 适用于 S2

### 1. 快速开始

#### 1.1 使用镜像（S2）

```shell
TODO
```

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.10 -m pip install flagtree===0.6.0+sunrise3.6 $RES
```

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/sunrise; cd ~/.flagtree/sunrise
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/llvm-71bd243f-triton-v3.6.x.tar.gz
tar zxvf llvm-71bd243f-triton-v3.6.x.tar.gz
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/sunriseTritonPlugin_v0.6.0.4.tar.gz
tar zxvf sunriseTritonPlugin_v0.6.0.4.tar.gz
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
export TRITON_BUILD_WITH_CLANG_LLD=1
export TRITON_OFFLINE_BUILD=1
export TRITON_BUILD_PROTON=OFF
export FLAGTREE_BACKEND=sunrise
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [sunrise3.6 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/sunrise-build-and-test.yml)


## 💫 Sunrise（曦望芯科）[sunrise](https://github.com/flagos-ai/FlagTree/tree/triton_v3.4.x/third_party/sunrise/)3.4

- 基于 Triton 3.4，x64
- 适用于 S2

### 1. 快速开始

#### 1.1 使用镜像（S2）

```shell
TODO
```

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.10 -m pip install flagtree===0.4.0+sunrise3.4 $RES
```

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/sunrise; cd ~/.flagtree/sunrise
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/sunrise-llvm21-glibc2.39-glibcxx3.4.33-x86_64_v0.4.0.tar.gz
tar zxvf sunrise-llvm21-glibc2.39-glibcxx3.4.33-x86_64_v0.4.0.tar.gz
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/sunriseTritonPlugin-cpython3.10-glibc2.39-glibcxx3.4.33-x86_64_v0.4.0.tar.gz
tar zxvf sunriseTritonPlugin-cpython3.10-glibc2.39-glibcxx3.4.33-x86_64_v0.4.0.tar.gz
```

#### 2.2 手动下载 Triton 依赖项

Triton 依赖项已在镜像中下载并安装完毕。
如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# 适用于 Triton 3.4（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.4.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.4.x-linux-x64.tar.gz
```

执行上述脚本后，原有的 ~/.triton 目录将被重命名，并创建一个新的 ~/.triton 目录用于存放预下载的包。
请注意，脚本执行过程中会提示手动确认。

#### 2.3 构建命令

```shell
cd ${YOUR_CODE_DIR}/FlagTree
git checkout -b triton_v3.4.x origin/triton_v3.4.x
export TRITON_BUILD_WITH_CLANG_LLD=1
export TRITON_OFFLINE_BUILD=1
export TRITON_BUILD_PROTON=OFF
export FLAGTREE_BACKEND=sunrise
MAX_JOBS=32 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [sunrise3.4 后端测试](https://github.com/flagos-ai/FlagTree/blob/triton_v3.4.x/.github/workflows/sunrise-build-and-test.yml)
