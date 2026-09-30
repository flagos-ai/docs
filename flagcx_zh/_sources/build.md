# 构建与安装

## 获取源代码

```shell
git clone https://github.com/flagos-ai/FlagCX.git
cd FlagCX
git submodule update --init --recursive
```

## 安装

**方式 A — Python 安装（pip install）：**

```shell
pip install . -v --no-build-isolation
```

**方式 B — C++ 库（make）：**

```shell
make <backend>=1 -j$(nproc)
```

其中 `<backend>` 为以下选项之一：
- `USE_NVIDIA`：NVIDIA GPU 支持
- `USE_ILUVATAR`：Iluvatar GPU 支持
- `USE_ILUVATAR_COREX`：`USE_ILUVATAR` 的弃用兼容别名
- `USE_CAMBRICON`：寒武纪支持
- `USE_METAX`：MetaX 支持
- `USE_MUSA`：摩尔线程支持
- `USE_KUNLUNXIN`：昆仑芯支持
- `USE_DU`：海光支持
- `USE_ASCEND`：华为昇腾支持
- `USE_AMD`：AMD 支持
- `USE_TSM`：清微智能支持
- `USE_ENFLAME`：燧原支持
- `USE_SUNRISE`：Sunrise AI 支持
- `USE_PPU`：PPU 后端支持
- `USE_GLOO`：GLOO 支持
- `USE_MPI`：MPI 支持

Device API 和集成构建控制项包括：

- `USE_SHMEM=1`：启用 SHMEM Device API 适配器。
- `SHMEM_HOME`：SHMEM 安装路径，默认为 `/usr/local/nvshmem`。
- `USE_ACCL_BAREX=1`：启用 ACCL/Barex 网络适配器。
- `COMPILE_KERNEL=1`：编译启用内核的 Device API 组件和测试。
- `HOST_CXX_STANDARD`：在构建环境需要时覆盖主机端 C++ 语言标准。
- `HOST_CXXFLAGS`：添加主机端编译器选项。
- `JSON_INCLUDE_DIR`：覆盖 JSON 头文件包含目录。

PPU 集成通常使用 `USE_PPU=1 USE_ACCL_BAREX=1`；厂商运行时和传输设置取决于具体集成环境，并非通用默认值。

方式 A 同样支持 `<backend>=1`，允许用户显式指定后端；否则系统会自动选择后端。

默认安装路径为 `build/`，您可以手动设置 `BUILDDIR` 环境变量来自定义构建路径。
您也可以指定 `DEVICE_HOME` 和/或 `CCL_HOME`，分别指示设备运行时和通信库的安装路径。
