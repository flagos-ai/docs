# FlagPrism

FlagPrism 是面向 [Triton](https://github.com/triton-lang/triton) 程序的多后端调试与性能分析工具，服务于 [FlagTree](https://github.com/flagos-ai/FlagTree) 生态。它集中维护 `flagtree.debugger` 与 `flagtree.profiler` 两个组件，为 NVIDIA GPU 及多种 AI 加速设备提供一致的观测工作流。

![FlagPrism 架构](assets/flagprism-architecture.png)

::::{grid} 1 1 2 2
:gutter: 2

:::{grid-item-card} 概览
:link: overview/overview
:link-type: doc

FlagPrism 是什么、后端支持情况、与 FlagTree 的关系。
:::

:::{grid-item-card} 快速开始
:link: getting_started/install
:link-type: doc

将 FlagPrism 作为 FlagTree wheel 的一部分构建安装。
:::

:::{grid-item-card} Debugger
:link: user_guide/debugger
:link-type: doc

观察 kernel 内部数值、访存与 op 执行。
:::

:::{grid-item-card} Profiler
:link: user_guide/profiler
:link-type: doc

对 Triton kernel 进行上下文、元数据和硬件指标分析。
:::
::::

## 项目链接

- **仓库**：[flagos-ai/FlagPrism](https://github.com/flagos-ai/FlagPrism)
- **FlagTree**：[flagos-ai/FlagTree](https://github.com/flagos-ai/FlagTree)
- **许可证**：MIT License

---

```{toctree}
:caption: 📑 发布说明
:maxdepth: 5
:hidden:

release_notes/release-notes.md
```

```{toctree}
:caption: 📚 使用指南
:maxdepth: 5
:hidden:

overview/overview.md
getting_started/install.md
user_guide/debugger.md
user_guide/profiler.md
user_guide/vendor-adaptation.md
references/reference.md
```
