# verl-hardware-plugin 文档

verl-hardware-plugin 为 [verl](https://github.com/verl-project/verl) 提供多芯片硬件平台与训练引擎插件。它由字节跳动 verl 团队与 [FlagOS](https://github.com/flagos-ai) 社区联合开发，使同一份 RL 后训练代码能够运行在 NVIDIA、沐曦 MetaX、天数智芯 Iluvatar、寒武纪 MLU、燧原 Enflame、Intel XPU 等硬件上。

```{button-ref} getting_started/getting-started
:ref-type: myst
:color: primary
:class: sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold

快速开始
```

::::{grid} 1 2 2 3
:gutter: 1 1 1 2

:::{grid-item-card} {octicon}`browser;1.5em;sd-mr-1` 概述
:link: overview/overview
:link-type: doc

了解 verl-hardware-plugin 是什么、其架构以及平台/引擎注册表设计。

+++
[了解更多 »](overview/overview.md)
:::

:::{grid-item-card} {octicon}`book;1.5em;sd-mr-1` 快速开始
:link: getting_started/getting-started
:link-type: doc

支持硬件平台的安装要求与分步说明。

+++
[了解更多 »](getting_started/getting-started.md)
:::

:::{grid-item-card} {octicon}`broadcast;1.5em;sd-mr-1` 用户指南
:link: user_guide/user-guide
:link-type: doc

各平台指南与端到端 GSM8K GRPO 基线。

+++
[了解更多 »](user_guide/user-guide.md)
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
user_guide/user-guide.md
```

```{toctree}
:caption: 📖 参考
:maxdepth: 5
:hidden:

references/reference.md
```
