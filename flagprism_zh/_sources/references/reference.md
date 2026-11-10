# 参考

## 项目链接

- **仓库**：[flagos-ai/FlagPrism](https://github.com/flagos-ai/FlagPrism)
- **FlagTree**：[flagos-ai/FlagTree](https://github.com/flagos-ai/FlagTree)
- **许可证**：MIT License

## 源码结构

| 路径 | 内容 |
| --- | --- |
| `Debugger/` | `flagtree.debugger` Python 与 native 实现；IR、instrumentation、metadata、runtime、Python 绑定、测试和示例。 |
| `Profiler/` | `flagtree.profiler` Python 包、native 运行时、CLI、Proton/ProtonGPU MLIR dialect 及 LLVM 转换、厂商适配器、教程和测试。 |
| `cmake/FlagPrism.cmake` | 统一的 CMake 构建策略与 target 集成。 |
| `python/flagprism_build.py` | 统一 wheel 的包、CLI 与 CMake 参数策略。 |
| `docs/CHIP_VENDOR_ADAPTATION_REQUIREMENTS.md` | Profiler 与 Debugger 的芯片厂商适配需求。 |
| `docs/TESTING.md` | 由根目录 `test.py` 驱动的统一算子验收流程。 |
| `docs/enflame.md` | 燧原后端的构建、采集方式与限制。 |

## 公开接口

- Debugger Python 入口：`flagtree.debugger`（native 扩展 `flagtree.debugger._native`）。
- kernel 内 marker：`ftl.debug_collect_start(...)` / `ftl.debug_collect_end(...)`。
- Profiler Python 入口：`flagtree.profiler`（native 扩展 `flagtree.profiler._native`）。
- Profiler CLI：`flagtree-profiler`、`flagtree-profiler-viewer`。
- 构建开关：`TRITON_BUILD_FLAGPRISM=ON|OFF`；厂商选择：`FLAGPRISM_BACKEND`。
- Profiler 环境变量：`FLAGTREE_PROFILER_*`。

## 后端支持

- Profiler 后端：`nvidia`/`cupti`（NVIDIA）、`roctracer`（AMD）、`instrumentation`（NVIDIA/AMD）、`cann`（昇腾）、`mthreads`（摩尔线程）、`tianshu`（天数/CoreX）。
- Debugger 动态采集已在昇腾/CANN9、天数/CoreX 4.4（LLVM 22）、MUSA/mthreads 4.3.5 与 NVIDIA CUDA 上验证。

## 相关组件

- [FlagTree](https://github.com/flagos-ai/FlagTree) —— 基于 Triton 的编译器与语言运行时，将 FlagPrism 作为子模块消费。
