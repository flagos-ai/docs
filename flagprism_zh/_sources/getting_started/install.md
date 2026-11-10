# 安装

FlagPrism 通过 `third_party/FlagPrism` 子模块作为 FlagTree wheel 的一部分构建，不单独发布为独立包。

## 前置条件

- 带有 FlagPrism 子模块的 FlagTree 源码检出。
- 受支持的后端工具链：
  - Debugger 动态采集：昇腾/CANN、天数/CoreX、摩尔线程 MUSA 或 NVIDIA CUDA。
  - Profiler：NVIDIA CUDA、AMD ROCm、昇腾 CANN、摩尔线程 MUSA 或天数 CoreX。
- FlagTree 所需的构建依赖（LLVM/MLIR、Python 构建工具）。

## 随 FlagTree 构建

在 FlagTree 仓库根目录：

```bash
git submodule update --init --recursive
python -m pip wheel . --no-build-isolation
```

这会在同一个 CMake graph 中构建 FlagTree core、Debugger 和 Profiler，并打包进单个 FlagTree wheel。

各厂商构建示例：

```bash
# 昇腾
FLAGTREE_BACKEND=ascend TRITON_BUILD_FLAGPRISM=ON MAX_JOBS=16 \
python -m pip install . --no-build-isolation

# 纯天数版本（排除昇腾/CANN 源码，使用天数/CoreX 运行时路径）
FLAGPRISM_BACKEND=tianshu TRITON_BUILD_FLAGPRISM=ON \
python -m pip install . --no-build-isolation

# 摩尔线程
FLAGTREE_BACKEND=mthreads FLAGPRISM_BACKEND=mthreads \
TRITON_BUILD_FLAGPRISM=ON python -m pip install . --no-build-isolation

# 纯 NVIDIA 版本（CUDA/CUPTI 路径，无需 ROCm 头文件或库）
FLAGTREE_BACKEND=nvidia FLAGPRISM_BACKEND=nvidia \
TRITON_BUILD_FLAGPRISM=ON python -m pip install . --no-build-isolation
```

开发期可使用 editable 安装：

```bash
python3 -m pip install -e . --no-build-isolation --no-deps
```

## 构建开关

| 变量 | 取值 | 作用 |
| --- | --- | --- |
| `TRITON_BUILD_FLAGPRISM` | `ON`（默认）、`OFF` | 构建联合 Debugger+Profiler 套件，或生成 core-only wheel。这是唯一的组件开关，两个工具不能单独启用。 |
| `FLAGPRISM_BACKEND` | 如 `tianshu`、`mthreads`、`nvidia` | 选择厂商后端；例如 `tianshu` 仅构建天数/CoreX 适配，不探测或链接昇腾 CANN。 |
| `FLAGTREE_BACKEND` | 如 `ascend` | 选择构建所用的 FlagTree 目标后端。 |

## 验证安装

```python
import flagtree.debugger as debugger
import flagtree.profiler as profiler

print("debugger available:", debugger.is_available())
print("profiler imported:", profiler is not None)
```

core-only wheel（`TRITON_BUILD_FLAGPRISM=OFF`）不包含 `flagtree.debugger`。可用 `debugger.is_available()` 检查编译器与运行时 native binding 是否同时存在。

## 要求

- Python 3.10+
- PyTorch（如适用，昇腾需 `torch_npu` 等厂商扩展）
- 所选后端对应的 Triton/FlagTree 兼容设备与驱动
