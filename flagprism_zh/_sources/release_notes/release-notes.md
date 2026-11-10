# 发布说明

FlagPrism 是 FlagTree 面向 Triton 程序的调试与性能分析工具套件，通过 `third_party/FlagPrism` 子模块随 FlagTree wheel 一起交付，不单独发布调试器/性能分析器 wheel。

- **Debugger** —— 通过 `flagtree.debugger` 与 kernel 内的 `ftl.debug_collect_start/end` marker，检查 `@triton.jit` kernel 内部的数值、访存与 op 执行情况；可导出语句级报告、IR op 级报告和 NumPy 张量数据文件，并支持可选的设备时间线。
- **Profiler** —— 通过 `flagtree.profiler` 分析函数或代码区域，支持标注 scope 与自定义指标；支持 NVIDIA、AMD、昇腾、摩尔线程、天数等后端，提供 `flagtree-profiler` 与 `flagtree-profiler-viewer` 命令行工具，输出 Hatchet 兼容的 JSON（也支持 Chrome trace 输出）。
- **厂商适配** —— 提供将 Debugger 与 Profiler 接入新芯片厂商所需的接口文档与适配要求。
