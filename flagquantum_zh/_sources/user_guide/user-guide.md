# 用户指南

本指南介绍如何用 FlagQuantum 做量子线路的模拟与训练：构建程序、规划与运行、使用 PyTorch 训练、选择模拟表示、加入噪声与测量、跨 rank 扩展，并把同一份程序迁移到硬件上。

::::{grid} 1 2 2 3
:gutter: 1 1 1 2

:::{grid-item-card} {octicon}`play;1.5em;sd-mr-1` 基本用法
:link: basic-usage
:link-type: doc

构建线路、规划、执行并读取结果。

+++
[了解更多 »](basic-usage.md)
:::

:::{grid-item-card} {octicon}`code;1.5em;sd-mr-1` 线路与 IR
:link: circuits-and-ir
:link-type: doc

线路构建、FlagQuantum IR、编译与路由。

+++
[了解更多 »](circuits-and-ir.md)
:::

:::{grid-item-card} {octicon}`gear;1.5em;sd-mr-1` 使用 PyTorch 训练
:link: training-with-pytorch
:link-type: doc

可训练线路、优化器、命名参数与检查点。

+++
[了解更多 »](training-with-pytorch.md)
:::

:::{grid-item-card} {octicon}`graph;1.5em;sd-mr-1` 测量与噪声
:link: measurement-and-noise
:link-type: doc

可观测量、结果访问、噪声模型与动态线路。

+++
[了解更多 »](measurement-and-noise.md)
:::

:::{grid-item-card} {octicon}`cpu;1.5em;sd-mr-1` 模拟表示
:link: simulation-representations
:link-type: doc

态向量、MPS、张量网络与 JAX 内核。

+++
[了解更多 »](simulation-representations.md)
:::

:::{grid-item-card} {octicon}`server;1.5em;sd-mr-1` 分布式执行
:link: distributed-execution
:link-type: doc

分片态向量与按 rank 拥有的 MPS 训练。

+++
[了解更多 »](distributed-execution.md)
:::

:::{grid-item-card} {octicon}`plug;1.5em;sd-mr-1` 硬件与远程目标
:link: hardware-and-remote
:link-type: doc

FlagOS 加速器、远程任务与部署包。

+++
[了解更多 »](hardware-and-remote.md)
:::

:::{grid-item-card} {octicon}`beaker;1.5em;sd-mr-1` 算法与纠错
:link: algorithms
:link-type: doc

算法单元、纠错实验与数字孪生。

+++
[了解更多 »](algorithms.md)
:::

:::{grid-item-card} {octicon}`book;1.5em;sd-mr-1` 教程
:link: tutorials
:link-type: doc

教程系列与示例目录。

+++
[了解更多 »](tutorials.md)
:::

:::{grid-item-card} {octicon}`flame;1.5em;sd-mr-1` 运行测试
:link: run-tests
:link-type: doc

测试分层与标记命令。

+++
[了解更多 »](run-tests.md)
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
