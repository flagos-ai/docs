# PyTorch-Plugin-FL

PyTorch-Plugin-FL (`torch_fl`) is a PyTorch device plugin for the FlagOS software stack. It exposes a single `flagos` device that routes operators among reusable native kernels, portable compiler kernels, vendor-native implementations, and explicit CPU fallback, so the same PyTorch program runs across accelerators without workload changes.

![PyTorch-Plugin-FL architecture](assets/images/pytorch-plugin-fl.png)

::::{grid} 1 2 2 3
:gutter: 1 1 1 2

:::{grid-item-card} {octicon}`browser;1.5em;sd-mr-1` Overview
:link: overview/overview
:link-type: doc

What PyTorch-Plugin-FL is, its design principles, capabilities, and component architecture.

+++
[Learn more »](overview/overview.md)
:::

:::{grid-item-card} {octicon}`book;1.5em;sd-mr-1` Getting Started
:link: getting_started/installation
:link-type: doc

Platform selection, build requirements, environment setup, verification, and test markers.

+++
[Learn more »](getting_started/installation.md)
:::

:::{grid-item-card} {octicon}`broadcast;1.5em;sd-mr-1` Distributed
:link: architecture/distributed
:link-type: doc

`ProcessGroupFlagOS`, FlagCX, vendor fallbacks, DDP and DataParallel support.

+++
[Learn more »](architecture/distributed.md)
:::

:::{grid-item-card} {octicon}`pulse;1.5em;sd-mr-1` Profiler
:link: architecture/profiler
:link-type: doc

`torch.profiler` integration, vendor tracers, correlation ids, and parity with `torch.cuda`.

+++
[Learn more »](architecture/profiler.md)
:::

:::{grid-item-card} {octicon}`zap;1.5em;sd-mr-1` torch.compile
:link: architecture/torch-compile
:link-type: doc

Inductor integration for the `flagos` device, FlagTree compilation, and platform notes.

+++
[Learn more »](architecture/torch-compile.md)
:::

:::{grid-item-card} {octicon}`gear;1.5em;sd-mr-1` Reference
:link: reference/compatibility
:link-type: doc

Per-platform capability validation, environment variables, and operation-routing configuration.

+++
[Learn more »](reference/compatibility.md)
:::

::::

## Project links

- **Repository**: [flagos-ai/Torch-FL](https://github.com/flagos-ai/Torch-FL)
- **FlagGems**: [flagos-ai/FlagGems](https://github.com/flagos-ai/FlagGems)
- **FlagTree**: [flagos-ai/FlagTree](https://github.com/flagos-ai/FlagTree)
- **FlagCX**: [flagos-ai/FlagCX](https://github.com/flagos-ai/FlagCX)
- **License**: Apache License 2.0

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
overview/features.md
overview/architecture.md
getting_started/installation.md
architecture/distributed.md
architecture/profiler.md
architecture/torch-compile.md
reference/compatibility.md
reference/environment-variables.md
```
