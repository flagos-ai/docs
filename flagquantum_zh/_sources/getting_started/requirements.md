# 环境要求

本节介绍 FlagQuantum 的硬件平台与软件要求。

## 软件要求

- Python 3.10、3.11 或 3.12
- PyTorch 2.5 及以上，低于 2.14

正式发布的包只依赖 PyTorch，其余都是可选项。

## 支持的硬件平台

| 平台 | 触达方式 |
| --- | --- |
| CPU | 默认的本地态向量、MPS 与张量网络执行 |
| NVIDIA GPU | 通过 `fq.ExecutionOptions(device="cuda:0")` 选择的 CUDA 设备 |
| FlagOS 支持的加速器 | 逻辑设备 `flagos:0`，经 Torch-FL 触达 |

FlagQuantum 不会按设备名去探测或派发某个具体国产加速器。厂商探测、运行时激活与兼容路由都由 Torch-FL 负责，并通过 `flagos` 契约暴露出来。

## 可选依赖分组

| 分组 | 增加的内容 |
| --- | --- |
| `dev` | pytest、覆盖率、xdist、ruff、black、mypy、build、pre-commit |
| `jax` | JAX 支撑的内核 |
| `cuda` | Triton |
| `qiskit` | Qiskit 与 Aer 互操作 |
| `pennylane` | PennyLane 互操作 |
| `cirq` | Cirq 互操作 |
| `braket` | Amazon Braket 互操作 |
| `cudaq` | CUDA-Q 内核导出 |
| `quafu` | Quafu 提交支持 |
| `azure` | Azure Quantum 提交支持 |
| `viz` | Matplotlib 线路绘制 |
| `examples` | 示例工作流所需的 `datasets` 与 `transformers` |
| `all` | 以上全部可选依赖 |

互操作适配器属于可选的控制面边界：`import flagquantum` 永远不会连带导入 Qiskit、PennyLane、Cirq 或其他外部框架。

## 选择目标前应了解的支持边界

每个能力的成熟度，以及各目标实际执行过什么，都公布在[能力参考](../reference/capabilities.md)中。实现了某个 API，并不等于自动获得生产支持。
