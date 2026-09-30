[<a href="../../../flagtree_en/getting_started/flagtree-cpu.html">英文版</a>|中文版]

# 在 Arm64 上启用 FlagTree CPU

[FlagTree CPU](https://github.com/flagos-ai/flagtree-cpu/tree/triton_v3.7.x) 为 Triton 提供 CPU 后端，使使用 Triton Python API 编写的 kernel 能够在 CPU 上编译和运行。它的编译器通过 MLIR/LLVM 将 Triton kernel 下降为原生 CPU 代码，运行时负责 CPU 目标选择、kernel 启动和编译缓存。本指南覆盖 Linux Arm64 上的 Triton 3.7.2 实现，并通过一个 vector-add kernel 和 FlagGems W4A8 算子测试进行验证。

使用 [flagos-ai/community](https://github.com/flagos-ai/community/tree/main/fep/sig-edge/scripts/flagtree-cpu37) 中的脚本构建并验证 Triton 3.7.2 CPU 后端。请在同一个 shell 中按以下步骤操作。

## 步骤 1 准备主机

使用 **Debian 13（Linux Arm64，`aarch64`）**，已安装 Git、具备 sudo 权限（或 root），并且至少有 **25 GiB 可用磁盘空间**。确保主机能够访问源码仓库和依赖下载服务。

## 步骤 2 获取脚本

```bash
git clone --single-branch --branch main \
  https://github.com/flagos-ai/community.git community-flagtree
cd community-flagtree

RUN=fep/sig-edge/scripts/flagtree-cpu37/run.sh
export WORK_DIR="$HOME/flagtree-cpu-3.7-test"
export BUILD_JOBS=4
```

专用工作目录将编译器、Python 环境和缓存与其他安装隔离开来。请保留完整的脚本目录；`run.sh` 依赖其配套文件。

## 步骤 3 构建并安装

```bash
bash "$RUN" setup
```

setup 会安装系统依赖、创建 Python 3.11 环境、拉取固定版本的 FlagTree CPU 与 FlagGems 修订、初始化子模块，并构建 Triton 3.7.2。固定的 LLVM 与 SLEEF 版本保证构建可复现。安装后的包以 `triton` 名称导入。

## 步骤 4 验证 CPU 执行

```bash
bash "$RUN" test
```

测试会检查源码/工具链修订与 CPU 目标，分别使用全新缓存和复用缓存执行真实的 vector-add kernel，并将 FlagGems W4A8 结果与 PyTorch 对比。验收要求 **7 passed, 0 skipped**。日志与测试报告保存在 `$WORK_DIR/logs/` 下。

## 步骤 5 为你的应用启用该后端

```bash
source "$WORK_DIR/.venv/bin/activate"
export TRITON_CPU_BACKEND=1
export FLAGGEMS_VENDOR=arm
export TRITON_CACHE_DIR="$WORK_DIR/triton-runtime-cache"
mkdir -p "$TRITON_CACHE_DIR"

python your_program.py
```

将 `your_program.py` 替换为你的应用。`TRITON_CPU_BACKEND=1` 选择 CPU 执行；`FLAGGEMS_VENDOR=arm` 选择 FlagGems 的 Arm 实现。持久化缓存使与之兼容的 kernel 特化可以复用已编译的代码。这些变量必须在你的应用 shell 中导出，因为 setup/test 脚本运行在独立的 Bash 进程中。

通过上述检查可以验证编译器和已测算子；模型集成与模型冷启动性能需要单独验证。

参考：[FEP-0082](https://github.com/flagos-ai/community/blob/main/fep/sig-edge/0082-flagtree-cpu-bump-to-triton-3_7.md)。
