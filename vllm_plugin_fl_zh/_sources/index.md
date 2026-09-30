# vllm-plugin-FL 文档

```{button-ref} getting_started/getting-started
:ref-type: myst
:color: primary
:class: sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold

快速入门
```

::::{grid} 1 2 2 3
:gutter: 1 1 1 2

:::{grid-item-card} {octicon}`browser;1.5em;sd-mr-1` 概览
:link: overview/overview
:link-type: doc

快速了解 vllm-plugin-FL 以及一些基本概念。

+++
[了解更多 »](overview/overview.md)
:::

:::{grid-item-card} {octicon}`book;1.5em;sd-mr-1` 快速入门
:link: getting_started/getting-started
:link-type: doc

概述 vllm-plugin-FL 的安装要求，并提供从运行推理任务的逐步说明。

+++
[了解更多 »](getting_started/getting-started.md)
:::

:::{grid-item-card} {octicon}`broadcast;1.5em;sd-mr-1` 用户指南
:link: dispatch_user_guide/dispatch-user-guide
:link-type: doc

指导如何在 FlagGems、厂商特定实现和 PyTorch 之间调度算子。

+++
[了解更多 »](dispatch_user_guide/dispatch-user-guide.md)
:::

:::{grid-item-card} {octicon}`code;1.5em;sd-mr-1` 参考文档
:link: reference/dispatch-api-reference
:link-type: doc

列出用于调用算子、管理策略和发现插件的调度 API。

+++
[了解更多 »](reference/dispatch-api-reference.md)
:::

::::

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
getting_started/getting-started.md
dispatch_user_guide/dispatch-user-guide.md
```

```{toctree}
:caption: 📖 参考文档
:maxdepth: 5
:hidden:

reference/dispatch-api-reference.md
```
