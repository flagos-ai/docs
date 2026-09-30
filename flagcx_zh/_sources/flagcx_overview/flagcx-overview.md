# 概述

FlagCX 是一个可扩展、自适应的跨芯片通信库。它作为一个平台，开发者、研究人员和 AI 工程师可以在各种项目上进行协作，为前沿 AI 解决方案的开发做出贡献，并与全球社区分享他们的工作。

FlagCX 利用原生集合通信库在各平台上提供完整的单芯片通信支持。除了其原生 x-CCL 集成外，FlagCX 还引入了原创的设备缓冲区 IPC 和设备缓冲区 RDMA 技术，为跨芯片和单芯片场景启用高性能 P2P 操作。这些机制可以与原生 x-CCL 后端无缝结合，为跨芯片集合通信提供优化性能。

## 架构

FlagCX 分为三层：

### 用户接口层（UIL）

`flagcx/include/flagcx.h` 中定义的公共 C API。它公开了：

- 通信器生命周期：`flagcxCommInitRank`、`flagcxCommDestroy`、`flagcxCommFinalize`
- 集合操作：AllReduce、AllGather、ReduceScatter、Broadcast、Reduce、Gather、Scatter、AlltoAll、AlltoAllv、Send、Recv
- 单边 RDMA 操作：`flagcxGet`、`flagcxPutSignal`、`flagcxSignal`、`flagcxWaitSignal`
- 内存注册：`flagcxMemAlloc`、`flagcxCommRegister`、`flagcxCommWindowRegister`
- 组语义：`flagcxGroupStart` / `flagcxGroupEnd`

### 通信运行时层（CRL）

运行时实现了四种执行策略（runner），根据通信器类型和环境配置进行选择：

| Runner | 模式 | 激活方式 |
|--------|------|------------|
| **homoRunner** | 同构通信（相同芯片类型） | 同构通信器的默认选择 |
| **hostRunner** | 主机端（CPU）通信 | `FLAGCX_USE_HOST_COMM=1` |
| **hybridRunner** | 多集群异构通信 | `FLAGCX_CLUSTER_SPLIT_LIST=...` |
| **uniRunner** | 统一异构通信 | `FLAGCX_USE_HETERO_COMM=1` |

CRL 还包括拓扑检测、用于异步通信的代理线程、P2P 传输、用于算法/协议选择的自动调优器（`flagcxTuner`）和成本模型。

### 可移植抽象层（PAL）

通过适配器模式实现硬件抽象。每次构建选择一个设备适配器和两个 CCL 适配器（主机 + 设备）：

- **CCL 适配器**（`flagcx/adaptor/ccl/`）：每个厂商 CCL 库一个 — NCCL、HCCL、IXCCL、CNCL、MCCL、DUCCL、MUSACCL、RCCL、TCCL、ECCL、PCCL
- **设备适配器**（`flagcx/adaptor/device/`）：每个硬件运行时一个 — CUDA、CANN、IXCUDA、MLU、MACA、MUSA、HIP、TOPS、PTPU 等
- **网络适配器**（`flagcx/adaptor/net/`）：网络传输 — InfiniBand、socket、UCX
- **调优适配器**（`flagcx/adaptor/tuner/`）：调优策略插件

FlagCX 支持**适配器插件**——用户定义的 Device、CCL 和 Net 适配器实现，通过 `dlopen` 在运行时动态加载。参见 FlagCX 仓库中的 `adaptor_plugin/` 目录获取 SDK 文档和示例。

```{toctree}

backend-support.md
application-integration.md
```
