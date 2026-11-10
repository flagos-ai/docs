# FlagPrism

FlagPrism is a multi-backend debugging and performance-analysis toolkit for [Triton](https://github.com/triton-lang/triton) programs, built for the [FlagTree](https://github.com/flagos-ai/FlagTree) ecosystem. It centrally maintains the `flagtree.debugger` and `flagtree.profiler` components and provides a consistent observability workflow across NVIDIA GPUs and diverse AI accelerators.

![FlagPrism architecture](assets/flagprism-architecture.png)

::::{grid} 1 1 2 2
:gutter: 2

:::{grid-item-card} Overview
:link: overview/overview
:link-type: doc

What FlagPrism is, its backend support, and how it relates to FlagTree.
:::

:::{grid-item-card} Getting Started
:link: getting_started/install
:link-type: doc

Build and install FlagPrism as part of the FlagTree wheel.
:::

:::{grid-item-card} Debugger
:link: user_guide/debugger
:link-type: doc

Observe in-kernel values, memory access, and op execution.
:::

:::{grid-item-card} Profiler
:link: user_guide/profiler
:link-type: doc

Profile Triton kernels with context, metadata, and hardware metrics.
:::
::::

## Project links

- **Repository**: [flagos-ai/FlagPrism](https://github.com/flagos-ai/FlagPrism)
- **FlagTree**: [flagos-ai/FlagTree](https://github.com/flagos-ai/FlagTree)
- **License**: MIT License

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
getting_started/install.md
user_guide/debugger.md
user_guide/profiler.md
user_guide/vendor-adaptation.md
references/reference.md
```
