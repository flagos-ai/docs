# verl-hardware-plugin Documentation

verl-hardware-plugin provides multi-chip hardware platform and engine plugins for [verl](https://github.com/verl-project/verl). It is jointly developed by the ByteDance verl team and the [FlagOS](https://github.com/flagos-ai) community, and allows the same RL post-training code to run on NVIDIA, MetaX, Iluvatar, Cambricon MLU, Enflame, and Intel XPU hardware.

```{button-ref} getting_started/getting-started
:ref-type: myst
:color: primary
:class: sd-btn-lg sd-px-4 sd-py-2 sd-fw-bold

Getting Started
```

::::{grid} 1 2 2 3
:gutter: 1 1 1 2

:::{grid-item-card} {octicon}`browser;1.5em;sd-mr-1` Overview
:link: overview/overview
:link-type: doc

Understand what verl-hardware-plugin is, its architecture, and the platform/engine registry design.

+++
[Learn more »](overview/overview.md)
:::

:::{grid-item-card} {octicon}`book;1.5em;sd-mr-1` Getting Started
:link: getting_started/getting-started
:link-type: doc

Requirements and step-by-step installation for supported hardware platforms.

+++
[Learn more »](getting_started/getting-started.md)
:::

:::{grid-item-card} {octicon}`broadcast;1.5em;sd-mr-1` User Guide
:link: user_guide/user-guide
:link-type: doc

Platform-specific guides and the end-to-end GSM8K GRPO baseline.

+++
[Learn more »](user_guide/user-guide.md)
:::

::::

---

```{toctree}
:caption: 📑 Release Notes
:maxdepth: 5
:hidden:

release_notes/release-notes.md
```

```{toctree}
:caption: 📚 Guides
:maxdepth: 5
:hidden:

overview/overview.md
getting_started/getting-started.md
user_guide/user-guide.md
```

```{toctree}
:caption: 📖 References
:maxdepth: 5
:hidden:

references/reference.md
```
