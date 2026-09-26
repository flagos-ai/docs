[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-enflame.html">英文版</a>|中文版]

## 💫 Enflame（燧原）[enflame](https://github.com/flagos-ai/FlagTree/tree/main/third_party/enflame/)3.6

- 基于 Triton 3.6，x64
- 适用于 GCU300 (S60), GCU400 (L300/L600)

### 1. 快速开始

#### 1.1 使用镜像（GCU300|GCU400）

提示：下载大文件时，可用 `apt install aria2; aria2c -c ...` 替代 `wget ...`，支持断点续传。

```shell
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-enflame3.6-py312-torch2.10.0-ubuntu24.04:202607-base
# 方案 A：docker pull（19.2GB）
docker pull ${IMAGE}
# 方案 B：docker load（4.0GB）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-enflame3.6-py312-torch2.10.0-ubuntu24.04.202607-base.tar.gz
docker load -i flagtree-enflame3.6-py312-torch2.10.0-ubuntu24.04.202607-base.tar.gz
```

```shell
TopsRider=TopsRider_Triton_gcu-3.6.0-1.0.20260826.cc.1.10.25_deb_amd64.run    # gcu400
TopsRider=TopsRider_Triton_gcu-3.6.0-1.0.20260826.cc.1.9.29_deb_amd64.run     # gcu300
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/${TopsRider}        # 2.0GB

# 宿主机
sh ${TopsRider} --driver -y    # on the host: restart the container after installing driver
cat /sys/module/enflame/version
efsmi

CONTAINER=flagtree-dev-xxx
docker run -dit \
    --privileged \
    -v /etc/localtime:/etc/localtime:ro \
    -v /home:/home \
    -w /root --name ${CONTAINER} ${IMAGE} bash
docker exec -it ${CONTAINER} /bin/bash

# 容器
sh ${TopsRider} --container -y    # in the container
dpkg -s triton-gcu
```

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton --break-system-packages  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install flagtree===0.7.0rc2+enflame3.6 --break-system-packages $RES
```

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/enflame; cd ~/.flagtree/enflame
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/enflame-llvm23-fc83c68-gcc9-x64_v0.4.0.tar.gz
tar zxvf enflame-llvm23-fc83c68-gcc9-x64_v0.4.0.tar.gz
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
export FLAGTREE_BACKEND=enflame
MAX_JOBS=8 python3 -m pip install . --no-build-isolation -v --break-system-packages
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [enflame3.6 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/enflame3.6-gcu400-build-and-test.yml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 Enflame（燧原）[enflame](https://github.com/flagos-ai/FlagTree/tree/triton_v3.5.x/third_party/enflame/)3.5

- 基于 Triton 3.5，x64
- 适用于 GCU300 (S60), GCU400 (L300/L600)

### 1. 快速开始

#### 1.1 使用镜像（GCU300|GCU400）

```shell
# 方案 A：docker pull（13.3GB）
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-enflame3.5-py312-torch2.9.1-ubuntu24.04:202603
docker pull ${IMAGE}
# 方案 B：docker load（2.8GB）
IMAGE=flagtree-enflame3.5-py312-torch2.9.1-ubuntu24.04:202603
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-enflame3.5-py312-torch2.9.1-ubuntu24.04.202603.tar.gz
docker load -i flagtree-enflame3.5-py312-torch2.9.1-ubuntu24.04.202603.tar.gz
```

```shell
# 宿主机
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --privileged \
    -v /etc/localtime:/etc/localtime:ro \
    -v /home:/home \
    -w /root --name ${CONTAINER} ${IMAGE} bash
docker cp ${CONTAINER}:/enflame enflame    # Will create ./enflame dir
bash enflame/driver/enflame-x86_64-gcc-1.7.2.14-20260302150833.run
efsmi
docker stop ${CONTAINER}
docker start ${CONTAINER}
docker exec -it ${CONTAINER} /bin/bash

# 容器
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/topsruntime_1.10.25-1_amd64.deb
dpkg -i topsruntime_1.10.25-1_amd64.deb    # If efsmi shows 1.10.25 on the host
```

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton --break-system-packages  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.12 -m pip install flagtree===0.5.0+enflame3.5 --break-system-packages $RES
```

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/enflame; cd ~/.flagtree/enflame
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/enflame-llvm22-189e06b-gcc9-x64_v0.4.0.tar.gz
tar zxvf enflame-llvm22-189e06b-gcc9-x64_v0.4.0.tar.gz
```

#### 2.2 手动下载 Triton 依赖项

Triton 依赖项已在镜像中下载并安装完毕。
如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# 适用于 Triton 3.5（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.5.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.5.x-linux-x64.tar.gz
```

执行上述脚本后，原有的 ~/.triton 目录将被重命名，并创建一个新的 ~/.triton 目录用于存放预下载的包。
请注意，脚本执行过程中会提示手动确认。

#### 2.3 构建命令

```shell
cd ${YOUR_CODE_DIR}/FlagTree
git checkout -b triton_v3.5.x origin/triton_v3.5.x
export FLAGTREE_BACKEND=enflame
MAX_JOBS=8 python3 -m pip install . --no-build-isolation -v --break-system-packages
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [enflame3.5 后端测试](https://github.com/flagos-ai/FlagTree/blob/triton_v3.5.x/.github/workflows/enflame3.5-gcu400-build-and-test.yml)

<!-- legacy generation: previous FlagTree release -->

---

## 💫 Enflame（燧原）[enflame](https://github.com/flagos-ai/FlagTree/tree/triton_v3.3.x/third_party/enflame/)3.3

- 基于 Triton 3.3，x64
- 适用于 GCU300 (S60)

### 1. 快速开始

#### 1.1 使用镜像（GCU300）

```shell
# 方案 A：docker pull（12.5GB）
IMAGE=harbor.baai.ac.cn/flagtree/flagtree-enflame3.3-py310-torch2.7.0-ubuntu22.04:202603
docker pull ${IMAGE}
# 方案 B：docker load（5.7GB）
IMAGE=flagtree-enflame3.3-py310-torch2.7.0-ubuntu22.04:202603
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/flagtree-hcu-py310-torch2.9.0-ubuntu22.04.202603.tar.gz
docker load -i flagtree-hcu-py310-torch2.9.0-ubuntu22.04.202603.tar.gz
```

```shell
CONTAINER=flagtree-dev-xxx
docker run -dit \
    --privileged \
    -v /etc/localtime:/etc/localtime:ro \
    -v /home:/home \
    -w /root --name ${CONTAINER} ${IMAGE} bash
docker cp ${CONTAINER}:/enflame enflame    # Will create ./enflame dir
bash enflame/driver/enflame-x86_64-gcc-1.6.3.12-20251115104629.run
efsmi
docker stop ${CONTAINER}
docker start ${CONTAINER}
docker exec -it ${CONTAINER} /bin/bash
```

#### 1.2 免源码安装

```shell
# 注意：请先安装 PyTorch，再执行以下命令
python3 -m pip uninstall -y triton  # Repeat the cmd until fully uninstalled
RES="--index-url=https://resource.flagos.net/repository/flagos-pypi-hosted/simple"
python3.10 -m pip install flagtree===0.4.0+enflame3.3 $RES
```

### 2. 从源码构建

#### 2.1 手动下载 FlagTree 依赖项

如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
mkdir -p ~/.flagtree/enflame; cd ~/.flagtree/enflame
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/enflame-llvm21-d752c5b-gcc9-x64_v0.3.0.tar.gz
tar zxvf enflame-llvm21-d752c5b-gcc9-x64_v0.3.0.tar.gz
```

#### 2.2 手动下载 Triton 依赖项

Triton 依赖项已在镜像中下载并安装完毕。
如果网络连接可用，则无需下载依赖项，构建过程中会自动获取。

```shell
cd ${YOUR_CODE_DIR}/FlagTree
# 适用于 Triton 3.3（x64）
wget https://baai-cp-web.ks3-cn-beijing.ksyuncs.com/trans/build-deps-triton_3.3.x-linux-x64.tar.gz
sh python/scripts/unpack_triton_build_deps.sh ./build-deps-triton_3.3.x-linux-x64.tar.gz
```

执行上述脚本后，原有的 ~/.triton 目录将被重命名，并创建一个新的 ~/.triton 目录用于存放预下载的包。
请注意，脚本执行过程中会提示手动确认。

#### 2.3 构建命令

```shell
cd ${YOUR_CODE_DIR}/FlagTree/python
git checkout -b triton_v3.3.x origin/triton_v3.3.x
export FLAGTREE_BACKEND=enflame
MAX_JOBS=8 python3 -m pip install . --no-build-isolation -v
```

### 3. 测试与验证

安装 `flagtree` 后，可通过以下命令检查：

```shell
python3 -m pip show flagtree
```

参考 [enflame3.3 后端测试](https://github.com/flagos-ai/FlagTree/blob/triton_v3.3.x/.github/workflows/enflame-gcu300-3.3-build-and-test.yml)
