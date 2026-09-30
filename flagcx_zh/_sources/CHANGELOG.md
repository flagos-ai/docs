# 发布说明

- **[2026/09]** 发布 [v.0.14.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.14.0):

  - 添加 SHMEM Device API 支持，并提供 `USE_SHMEM` 和 `SHMEM_HOME` 构建控制项。
  - 添加 Scalar IR 和 Unified IR 的 Device API 测试覆盖，包括拆分后的节点内和节点间测试目标。
  - 添加 ACCL/Barex 网络适配器支持和 PPU 后端集成控制项。
  - 扩展 PyTorch 插件构建检测，支持 PPU 和规范的 `USE_ILUVATAR` 后端标志。
  - 更新 Iluvatar 构建标志文档：新构建应使用 `USE_ILUVATAR`；`USE_ILUVATAR_COREX` 仅作为弃用的兼容别名保留。
  - 将 Device IR 路径中的 lane-mask ABI 扩展为 64 位。
  - 更新打包和依赖处理，包括 NVIDIA/NCCL 包装器使用场景下的 NCCL 2.27 文档版本下限。

- **[2026/06]** 发布 [v.0.13.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.13.0):

  - 引入 FlagCX P2P 引擎，用于单边 RDMA 操作，专为与 NIXL 等传输框架集成而设计。
  - 添加 IBRC P2P 适配器，支持基于 InfiniBand 的 P2P 通信。
  - 重构 Device API，增加对称内存（symmem）和多播支持。
  - 为 Device API 操作添加多 FIFO 支持。
  - 引入设备指针 API，用于 Triton 集成。
  - 弃用 `flagcxHandlerGroup`，改用独立的 `flagcxDeviceHandle` 生命周期管理。
  - 添加新的单边 RDMA 操作：`flagcxPut`、`flagcxBatchPut`、`flagcxReadCounter`、`flagcxWaitCounter`。
  - 优化 RMA 代理，通过批量单边 PUT 操作提高 RDMA 吞吐量。

- **[2026/05]** 发布 [v.0.12.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.12.0):

  - 添加 Sunrise AI 加速器支持，包括设备适配器 `ptpuAdaptor` 和 CCL 适配器 `pcclAdaptor`。
  - 扩展 PyTorch 插件对 PCCL 后端的支持。
  - 重构单边内存注册，采用全局句柄索引和 HeteroComm 隔离。
  - 添加 P2P 拓扑管理器，优化点对点通信。
  - 重构 P2P 零拷贝实现。
  - 为 Device API 添加设备端传输支持。
  - 添加 traits 抽象和 DeviceAPI，实现统一的厂商/回退支持。
  - 添加 bootstrap 扩展，增强汇合能力。
  - 将 C++17 特性替换为 C++11 等效实现，提高兼容性。

- **[2026/03]** 发布 [v.0.11.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.11.0):

  - 在异构平台上启用基于内核的通信，包括 NVIDIA 和 Hygon。
  - 添加主机端和设备端单边通信语义支持。
  - 引入适配器插件支持，支持动态加载用户定义的 Device、CCL 和 Net 适配器实现。

- **[2026/02]** 发布 [v.0.10.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.10.0):

  - 在 uniRunner 模式下实现 11 个芯片解耦的集合通信算法。
  - 重构设备节点内/节点间 API，并在 NVIDIA 平台上集成 NCCL Device API 支持。
  - 增强易用性，支持 pip 安装 FlagCX，并提供 NCCL 包装插件以便在 NVIDIA 平台上无缝采用。

- **[2026/01]** 发布 [v.0.9.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.9.0):

  - 添加 Enflame 支持，包括 `topsAdaptor` 和 `ecclAdaptor`。
  - 扩展 flagcxCCLAdaptor 以支持对称操作。
  - 在 ncclAdaptor 中引入 NCCL Device API，支持自定义 AllReduce 操作。
  - 重构 `glooAdaptor`，支持 TCP 和 IB 传输，并自动检测网卡。

- **[2025/12]** 发布 [v.0.8.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.8.0):

  - 启用节点内零拷贝，提高小消息数据传输效率。
  - 在 uniRunner 模式下支持朴素的 AllReduce 实现，采用以 CPU 为中心、设备辅助的算法。
  - 通过新 API flagcxHeteroPut 和 flagcxHeteroPutSignal 添加单边通信原语。

- **[2025/11]** 发布 [v.0.7.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.7.0):

  - 添加 TsingMicro 支持，包括设备适配器 `tsmicroAdaptor` 和 CCL 适配器 `tcclAdaptor`。
  - 实现实验性的无内核非归约集合通信（*SendRecv*、*AlltoAll*、*AlltoAllv*、*Broadcast*、*Gather*、*Scatter*、*AllGather*），使用设备缓冲区 IPC/RDMA。
  - 在 NVIDIA、MetaX 和 Hygon 平台上启用自动调优，*AllReduce*、*AllGather*、*ReduceScatter* 和 *AlltoAll* 性能提升 1.02×–1.26×。
  - 增强 `flagcxNetAdaptor`，添加单边原语（`put`、`putSignal`、`waitValue`）和重传支持，提高可靠性。

- **[2025/10]** 发布 [v.0.6.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.6.0):

  - 实现设备缓冲区 IPC 通信，支持节点内 *SendRecv* 操作。
  - 引入设备发起、主机启动的设备端原语，支持直接从设备进行基于内核的通信。
  - 增强自动调优，MetaX 平台上 *AllReduce* 操作性能提升 50%。

- **[2025/09]** 发布 [v.0.5.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.5.0):

  - 添加 AMD GPU 支持，包括设备适配器 `hipAdaptor` 和 CCL 适配器 `rcclAdaptor`。
  - 引入 `flagcxNetAdaptor` 统一网络后端，目前支持 socket、IBRC、UCX 和 IBUC（实验性）。
  - 启用零拷贝设备缓冲区 RDMA（用户缓冲区 RDMA），提升小消息性能。
  - 通过 `flagcxTuner` 支持同构场景下的自动调优。
  - 在 CI/CD 中添加 PyTorch API 测试自动化。

- **[2025/08]** 发布 [v.0.4.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.4.0):

  - 支持 ERNIE4.5（百度）在 NVIDIA 和 Iluvatar GPU 上使用 Paddle + FlagCX 进行异构训练。
  - 改进任意网卡配置下的异构通信，部署更加稳健灵活。
  - 引入实验性网络插件接口，扩展支持 IBRC 和 SOCKET。设备缓冲区注册现在可以通过 DMA-BUF 完成。
  - 添加 InterOp 级 DSL，支持自定义 C2C 算法设计。
  - 在 `docs/` 下提供用户文档。

- **[2025/07]** 发布 [v.0.3.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.3.0):

  - 集成三个额外的原生通信库：HCCL（华为）、MUSACCL（摩尔线程）和 MPI。
  - 通过流水线优化增强异构集合通信操作。
  - 引入设备端函数支持设备缓冲区 RDMA，补充现有的主机端函数。
  - 提供全栈开源解决方案 FlagScale + FlagCX，实现高效的异构预填充-解码分离。

- **[2025/05]** 发布 [v.0.2.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.2.0):

  - 集成 3 个额外的原生通信库，包括 MCCL（摩尔线程）、XCCL（Mellanox）和 DUCCL（BAAI）。
  - 改进 11 个异构集合通信操作，支持自动拓扑检测和单网卡/多网卡环境。

- **[2025/04]** 发布 [v.0.1.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.1.0):

  - 添加 5 个原生通信库，包括 NCCL（NVIDIA）、IXCCL（Iluvatar）和 CNCL（寒武纪）的 CCL 适配器，以及主机 CCL 适配器 GLOO 和 Bootstrap。
  - 使用 C2C（集群到集群）算法支持 11 个异构集合通信操作。
  - 提供全栈开源解决方案 FlagScale + FlagCX，实现高效异构训练。
  - 原生集成到 PaddlePaddle [v3.0.0](https://github.com/PaddlePaddle/Paddle/tree/v3.0.0)，支持动态图和静态图。
