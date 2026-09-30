# PyTorch-Plugin-FL

PyTorch-Plugin-FL（`torch_fl`）是面向 FlagOS 软件栈的 PyTorch 设备插件。它对外提供统一的 `flagos` 设备，并在可复用原生内核、可移植编译器内核、厂商原生实现和显式 CPU 回退之间路由算子，使同一份 PyTorch 程序无需修改即可运行在不同加速器上。

![PyTorch-Plugin-FL 架构](assets/images/pytorch-plugin-fl.png)

::::{grid} 1 2 2 3
:gutter: 1 1 1 2

:::{grid-item-card} {octicon}`browser;1.5em;sd-mr-1` 概览
:link: overview/overview
:link-type: doc

PyTorch-Plugin-FL 是什么、设计理念、能力范围与组件架构。

+++
[了解更多 »](overview/overview.md)
:::

:::{grid-item-card} {octicon}`book;1.5em;sd-mr-1` 快速入门
:link: getting_started/installation
:link-type: doc

平台选择、构建要求、环境配置、安装校验与测试标记。

+++
[了解更多 »](getting_started/installation.md)
:::

:::{grid-item-card} {octicon}`broadcast;1.5em;sd-mr-1` 分布式
:link: architecture/distributed
:link-type: doc

`ProcessGroupFlagOS`、FlagCX、厂商回退后端，以及 DDP 与 DataParallel 支持。

+++
[了解更多 »](architecture/distributed.md)
:::

:::{grid-item-card} {octicon}`pulse;1.5em;sd-mr-1` Profiler
:link: architecture/profiler
:link-type: doc

`torch.profiler` 集成、厂商追踪器、correlation id，以及与 `torch.cuda` 的对等性。

+++
[了解更多 »](architecture/profiler.md)
:::

:::{grid-item-card} {octicon}`zap;1.5em;sd-mr-1` torch.compile
:link: architecture/torch-compile
:link-type: doc

`flagos` 设备的 Inductor 集成、FlagTree 编译与各平台差异。

+++
[了解更多 »](architecture/torch-compile.md)
:::

:::{grid-item-card} {octicon}`gear;1.5em;sd-mr-1` 参考
:link: reference/compatibility
:link-type: doc

分平台能力验证、环境变量与算子路由配置。

+++
[了解更多 »](reference/compatibility.md)
:::

::::

## 项目链接

- **代码仓库**：[flagos-ai/Torch-FL](https://github.com/flagos-ai/Torch-FL)
- **FlagGems**：[flagos-ai/FlagGems](https://github.com/flagos-ai/FlagGems)
- **FlagTree**：[flagos-ai/FlagTree](https://github.com/flagos-ai/FlagTree)
- **FlagCX**：[flagos-ai/FlagCX](https://github.com/flagos-ai/FlagCX)
- **许可证**：Apache License 2.0

---

```{toctree}
:caption: 📑 发布说明
:maxdepth: 5
:hidden:

release_notes/release-notes.md
```

```{toctree}
:caption: 📚 指南
:maxdepth: 5
:hidden:

overview/overview.md
overview/features.md
overview/architecture.md
getting_started/installation.md
architecture/distributed.md
architecture/profiler.md
architecture/torch-compile.md
reference/compatibility.md
reference/environment-variables.md
```
