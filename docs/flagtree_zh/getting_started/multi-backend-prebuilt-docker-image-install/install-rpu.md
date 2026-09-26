[<a href="../../../flagtree_en/getting_started/multi-backend-prebuilt-docker-image-install/install-rpu.html">英文版</a>|中文版]

## 💫 Huixi Intelligence（辉羲智能）[rpu](https://github.com/flagos-ai/FlagTree/tree/main/third_party/rpu/)3.6

- 基于 Triton 3.6，aarch64

**Rhino RPU** 是辉羲智能光至 R1 SoC 内的 AI 加速器
（[rhino.auto](https://www.rhino.auto/)）。与 CPU/GPU 后端不同，RPU
后端**没有预装镜像，也没有 CPU 模拟器**——它只能在
实体 R1 SoC 板卡上编译与运行，其驱动、运行时和工具链需
向厂商获取。请直接在板卡上构建与测试。

> RPU 驱动、运行时和 LLVM 工具链均不公开发布。
> 请联系 **辉羲智能**（[rhino.auto](https://www.rhino.auto/)）
> 获取。

### 1. 构建与运行环境

#### 1.1 硬件与操作系统

- 一块运行 aarch64 Linux 的 R1 SoC 板卡，已暴露 RPU 设备节点
`/dev/rpu`（已加载内核模块）。
- 至少 24 GB 内存与 60 GB 可用磁盘。
- Python 3.10+、`cmake >= 3.20`、`ninja` 及较新的 `pip`。

RPU 后端没有 Docker 镜像；以下步骤全部在
R1 SoC 板卡上原生执行。请先确认设备节点：

```shell
ls /dev/rpu
```

#### 1.2 RPU 驱动与运行时（厂商提供）

请按厂商说明安装：

- 提供 `/dev/rpu` 的 RPU 内核驱动；
- `rhino-launch-kernel` 运行时库（`librhino_launch.so`），供板上
launch_kernel 测试使用。

#### 1.3 RPU LLVM 工具链（厂商提供）

RPU 后端使用定制的 LLVM 作为 `.rpubin` 生成器。请将
`RPU_LLVM_ROOT` 指向工具链安装前缀（即包含
`bin/clang` 的目录）：

```shell
# 工具链目录结构：
#   $RPU_LLVM_ROOT/bin/clang
#   $RPU_LLVM_ROOT/lib/...
export RPU_LLVM_ROOT=/opt/rpu/llvm
```

### 2. 安装命令

RPU 后端在板卡上从源码构建，没有
免源码（pip wheel）安装方式。

#### 2.1 拉取源码

```shell
cd ~
git clone https://github.com/flagos-ai/FlagTree.git
cd FlagTree
git checkout main
```

#### 2.2 从源码构建

```shell
export FLAGTREE_BACKEND=rpu
export MAX_JOBS=8                        # tune to available RAM

cd ~/FlagTree/python
pip3 install -r requirements.txt         # build-time dependencies

cd ~/FlagTree
# 首次构建
pip3 install . --no-build-isolation -v
# 源码修改后重新构建
pip3 install . --no-build-isolation --force-reinstall -v
```

Triton MLIR LLVM 会在首次运行时从公共 oaitriton blob 自动下载，
无需手动操作。

### 3. 测试与验证

#### 3.1 单元测试

编译测试会调用真实工具链，因此须先设置 `RPU_LLVM_ROOT`（即包含
`bin/clang` 的目录）。若未设置或路径不存在，
测试会中断并明确提示该变量名。

```shell
cd ~/FlagTree
export RPU_LLVM_ROOT=/opt/rpu/llvm
pytest -s third_party/rpu/python/test/unit
```

#### 3.2 板上 launch_kernel 验证

这需要 `launch_kernel_runner` CLI，它是 `rhino-launch-kernel`
运行时库的轻量前端。构建后端时通过启用 `RPU_BUILD_LAUNCH_RUNNER`
一并构建它（默认关闭；需要先安装
`rhino-launch-kernel`），然后在具备
`/dev/rpu` 的板卡上运行冒烟测试：

```shell
TRITON_APPEND_CMAKE_ARGS="-DRPU_BUILD_LAUNCH_RUNNER=ON -DCMAKE_PREFIX_PATH=/path/to/rhino-launch-kernel/install" \
    pip3 install . --no-build-isolation --force-reinstall -v
export RPU_LK_RUNNER=$PWD/third_party/rpu/tools/launch_runner/launch_kernel_runner
python3 third_party/rpu/python/test/board/lk_board_smoke.py --require-board
```

它会编译一个小算子、在设备上派发执行，并将结果与
numpy 基准结果比对。

参考 [rpu 后端测试](https://github.com/flagos-ai/FlagTree/tree/main/.github/workflows/rpu3.6-build-and-test.yml)
