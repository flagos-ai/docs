# vllm-plugin-FL Documentation

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

Have a quick view of vllm-plugin-FL, and also some basic concepts.

+++
[Learn more »](overview/overview.md)
:::

:::{grid-item-card} {octicon}`book;1.5em;sd-mr-1` Getting Started
:link: getting_started/getting-started
:link-type: doc

Outlines the installation requirements for vllm-plugin-FL and provides step-by-step instructions from running an inference.

+++
[Learn more »](getting_started/getting-started.md)
:::

:::{grid-item-card} {octicon}`broadcast;1.5em;sd-mr-1` User Guide
:link: dispatch_user_guide/dispatch-user-guide
:link-type: doc

Guides you how to dispatch operators between FlagGems, vendor-specific, and PyTorch.

+++
[Learn more »](dispatch_user_guide/dispatch-user-guide.md)
:::

:::{grid-item-card} {octicon}`code;1.5em;sd-mr-1` API Reference
:link: reference/dispatch-api-reference
:link-type: doc

Lists the dispatch API for calling operators, managing policy, and discovering plugins.

+++
[Learn more »](reference/dispatch-api-reference.md)
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
dispatch_user_guide/dispatch-user-guide.md
```

```{toctree}
:caption: 📖 References
:maxdepth: 5
:hidden:

reference/dispatch-api-reference.md
```
