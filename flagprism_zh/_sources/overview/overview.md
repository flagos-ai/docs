# 概览

FlagPrism 是面向 Triton 程序的多后端调试与性能分析工具，为 NVIDIA GPU 及多种 AI 加速设备提供一致的观测工作流：在编译期和运行期观测 Triton kernel，将源码上下文、Triton IR 操作与设备事件关联起来，并把采集的数据转化为报告，帮助开发者分析不同加速器后端上的程序正确性、内存行为和性能表现。

## 组件

- **Debugger**（`Debugger/`）—— `flagtree.debugger` 的 Python 与 native 实现，可从 `@triton.jit` kernel 的指定区域采集数值、数值摘要、访存地址摘要、完整张量数据以及语句/op 元数据。
- **Profiler**（`Profiler/`）—— `flagtree.profiler` 的 Python 包、native 运行时与 CLI，记录执行上下文、时间线、op 数量、估算数据量、硬件指标和厂商性能分析数据，并聚合为调用树、时间线、Hatchet、元数据及厂商相关输出。
- **`cmake/FlagPrism.cmake`** —— 两个组件统一的 CMake 构建策略与 target 集成。
- **`python/flagprism_build.py`** —— 统一 wheel 的包、CLI 与 CMake 参数策略。

## 后端支持

下表展示 FlagPrism 的支持路线图，描述的是 Debugger 与 Profiler 的集成状态，而不是相应 FlagTree 编译器后端的可用状态。

| 厂商 | 状态 |
| --- | --- |
| NVIDIA | 进行中（目标：2026 年 9 月） |
| 华为昇腾 | 已支持 |
| 摩尔线程 | 合并中 |
| 沐曦 | 待启动（目标：2026 年 10 月） |
| 天数智芯 | 已支持 |
| 燧原 | 进行中（目标：2026 年 9 月） |

Debugger 动态采集与 hidden-argument launch 路径已在昇腾/CANN9、天数/CoreX 4.4（LLVM 22）、MUSA/mthreads 4.3.5 与 NVIDIA CUDA 上验证。

Profiler 支持 `nvidia`、`cupti`、`roctracer`、`instrumentation`、`cann`、`mthreads`、`tianshu` 后端。

## 与 FlagTree 的关系

FlagTree 是面向 AI 加速器的统一多后端编译器，使 Triton 程序能够在不同类型的 AI 加速设备上运行。FlagPrism 为 FlagTree 提供配套的观测工具，帮助开发者调试 kernel 正确性、分析运行行为、定位性能瓶颈并优化 Triton workload。

FlagTree 将 FlagPrism 作为 `third_party/FlagPrism` 子模块消费，不再单独发布 `flagtree-debugger` 与 `flagtree-profiler` wheel。在 FlagTree 仓库运行 `pip wheel .` 会在同一个 CMake graph 中构建 core、Debugger 和 Profiler，并打包进单个 FlagTree wheel：

- Debugger 源码安装为 `flagtree.debugger`。
- `Profiler/python/flagtree_profiler` 安装为 `flagtree.profiler`。
- 两个组件的 `_native` 扩展都放入同一个 wheel。

Debugger 编译器插件链接进 `libtriton`；其运行时传输与解码接口位于独立的 `flagtree.debugger._native` 扩展，不链接 `libtriton`。

## 构建模式

Python wheel 仅支持两种构建模式：

1. **联合构建（默认）** —— Debugger 与 Profiler 一起构建（`TRITON_BUILD_FLAGPRISM=ON`）。
2. **core-only 构建** —— `TRITON_BUILD_FLAGPRISM=OFF`，不包含任一工具包。

两个组件不能单独启用或禁用，`TRITON_BUILD_FLAGPRISM` 是唯一的组件开关。可用 `FLAGPRISM_BACKEND` 选择厂商后端（例如 `tianshu`）。

## 状态

FlagPrism 通过 FlagTree 子模块交付，随 FlagTree wheel 一起安装。
