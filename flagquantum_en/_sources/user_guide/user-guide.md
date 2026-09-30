# User Guide

This guide covers how to use FlagQuantum for quantum circuit simulation and
training: building programs, planning and running them, training with PyTorch,
choosing a simulation representation, adding noise and measurement, scaling
across ranks, and moving the same program to hardware.

::::{grid} 1 2 2 3
:gutter: 1 1 1 2

:::{grid-item-card} {octicon}`play;1.5em;sd-mr-1` Basic Usage
:link: basic-usage
:link-type: doc

Build a circuit, plan it, run it and read the result.

+++
[Learn more »](basic-usage.md)
:::

:::{grid-item-card} {octicon}`code;1.5em;sd-mr-1` Circuits and IR
:link: circuits-and-ir
:link-type: doc

Circuit construction, FlagQuantum IR, compilation and routing.

+++
[Learn more »](circuits-and-ir.md)
:::

:::{grid-item-card} {octicon}`gear;1.5em;sd-mr-1` Training with PyTorch
:link: training-with-pytorch
:link-type: doc

Trainable circuits, optimizers, named parameters and checkpoints.

+++
[Learn more »](training-with-pytorch.md)
:::

:::{grid-item-card} {octicon}`graph;1.5em;sd-mr-1` Measurement and Noise
:link: measurement-and-noise
:link-type: doc

Observables, result accessors, noise models and dynamic circuits.

+++
[Learn more »](measurement-and-noise.md)
:::

:::{grid-item-card} {octicon}`cpu;1.5em;sd-mr-1` Simulation Representations
:link: simulation-representations
:link-type: doc

Statevector, MPS, tensor network and JAX kernels.

+++
[Learn more »](simulation-representations.md)
:::

:::{grid-item-card} {octicon}`server;1.5em;sd-mr-1` Distributed Execution
:link: distributed-execution
:link-type: doc

Sharded statevector and rank-owned MPS training.

+++
[Learn more »](distributed-execution.md)
:::

:::{grid-item-card} {octicon}`plug;1.5em;sd-mr-1` Hardware and Remote Targets
:link: hardware-and-remote
:link-type: doc

FlagOS accelerators, remote jobs, deployment packages.

+++
[Learn more »](hardware-and-remote.md)
:::

:::{grid-item-card} {octicon}`beaker;1.5em;sd-mr-1` Algorithms and QEC
:link: algorithms
:link-type: doc

Algorithm units, error-correction experiments and digital twins.

+++
[Learn more »](algorithms.md)
:::

:::{grid-item-card} {octicon}`book;1.5em;sd-mr-1` Tutorials
:link: tutorials
:link-type: doc

The tutorial series and the example catalog.

+++
[Learn more »](tutorials.md)
:::

:::{grid-item-card} {octicon}`flame;1.5em;sd-mr-1` Run Tests
:link: run-tests
:link-type: doc

Test tiers and marker commands.

+++
[Learn more »](run-tests.md)
:::

::::

```{toctree}
:maxdepth: 2
:hidden:

basic-usage.md
circuits-and-ir.md
training-with-pytorch.md
measurement-and-noise.md
simulation-representations.md
distributed-execution.md
hardware-and-remote.md
algorithms.md
tutorials.md
run-tests.md
```
