# FlagCX 环境变量

本文档提供 FlagCX 中使用的所有环境变量的综合参考。

## 目录

- [FlagCX 环境变量](#flagcx-环境变量)
  - [目录](#目录)
  - [调试与日志](#调试与日志)
  - [通信模式](#通信模式)
  - [缓冲区与内存](#缓冲区与内存)
  - [代理与运行时](#代理与运行时)
  - [P2P 引擎配置](#p2p-引擎配置)
  - [拓扑配置](#拓扑配置)
  - [调优器配置](#调优器配置)
  - [HybridRunner 配置](#hybridrunner-配置)
  - [UniRunner 配置](#unirunner-配置)
  - [网络配置](#网络配置)
    - [InfiniBand (IB) 设置](#infiniband-ib-设置)
    - [IB 重传](#ib-重传)
    - [Socket 网络](#socket-网络)
    - [UCX 网络](#ucx-网络)
    - [Gloo 网络](#gloo-网络)
    - [ACCL/Barex 和 PPU 集成](#acclbarex-和-ppu-集成)
  - [插件配置](#插件配置)
  - [其他](#其他)
  - [注意事项](#注意事项)

---

## 调试与日志

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_DEBUG` | 无 | 设置调试日志级别。可选值：VERSION、WARN、INFO、ABORT、TRACE |
| `FLAGCX_DEBUG_SUBSYS` | INIT,ENV | 逗号分隔的调试子系统列表。使用 ^ 前缀进行反转。可选值：INIT、COLL、P2P、SHM、NET、GRAPH、TUNING、ENV、ALLOC、CALL、PROXY、NVLS、BOOTSTRAP、REG、ALL |
| `FLAGCX_DEBUG_FILE` | stdout | 调试日志输出文件。支持 %h（主机名）、%p（进程ID）占位符 |
| `FLAGCX_WARN_ENABLE_DEBUG_INFO` | 0 | 设置为 1 时，在警告上启用扩展调试信息 |
| `FLAGCX_SET_THREAD_NAME` | 0 | 设置为 1 时，启用设置线程名称以便调试 |

---

## 通信模式

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_USE_HOST_COMM` | 0 | 设置为 1 时，使用主机通信模式 |
| `FLAGCX_USE_HETERO_COMM` | 0 | 设置为 1 时，启用 uniRunner 模式 |
| `FLAGCX_COMM_ID` | 无 | 指定用于 bootstrap 的通信 ID。设置后，rank 0 将创建根节点 |
| `FLAGCX_HOSTID` | 无 | 覆盖用于主机哈希的主机标识符字符串 |
| `FLAGCX_CLUSTER_SPLIT_LIST` | 无 | 逗号分隔的集群拆分计数列表（如 2,4,8），启用 hybridRunner 模式 |

---

## 缓冲区与内存

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_NET_BUFFER_SIZE` | 67108864 (64MB) | 网络缓冲区大小（字节） |
| `FLAGCX_NET_CHUNK_SIZE` | 4194304 (4MB) | 网络分块大小（字节） |
| `FLAGCX_P2P_BUFFER_SIZE` | 67108864 (64MB) | P2P 缓冲区大小（字节） |
| `FLAGCX_P2P_CHUNK_SIZE` | 16777216 (16MB) | P2P 分块大小（字节） |
| `FLAGCX_SEMAPHORE_BUFFER_POOL_CAPACITY` | 32 | 信号量缓冲池容量 |
| `FLAGCX_KERNEL_FIFO_CAPACITY` | 128 | 内核 FIFO 容量 |
| `FLAGCX_REDUCE_FIFO_CAPACITY` | 128 | Reduce 操作 FIFO 容量 |
| `FLAGCX_MEM_ENABLE` | 0 | 设置为 1 时，启用通过设备适配器进行内存分配 |
| `FLAGCX_DMABUF_ENABLE` | 0 | 设置为 1 时，启用内存注册的 DMA-BUF 支持 |

---

## 代理与运行时

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_RUNTIME_PROXY` | 0 | 设置为 1 时，启用运行时代理模式 |
| `FLAGCX_PROGRESS_APPENDOP_FREQ` | 8 | 进度循环中追加操作的频率 |
| `FLAGCX_P2P_DISABLE` | 0 | 设置为 1 时，禁用 P2P 传输 |
| `FLAGCX_P2P_SCHEDULE_DISABLE` | 0 | 设置为 1 时，禁用 P2P 调度优化 |
| `FLAGCX_DEVICE_FUNC_PATH` | 无 | 异步内核加载的设备函数库路径 |
| `FLAGCX_RMA_QUEUE_SIZE` | 256 | RMA 代理线程的每个对等节点环形缓冲区深度。必须是 2 的幂 |
| `FLAGCX_RMA_BATCH_MAX` | 256 | 在单个 `iputBatch` 调用中批量的 RDMA PUT 描述符的最大数量 |

---

## P2P 引擎配置

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_P2P_QPS_PER_CONN` | 4 | 每个 P2P 连接的 QP 连接数 |
| `FLAGCX_P2P_WORKERS_PER_POOL` | 4 | 每个池的工作线程数 |
| `FLAGCX_P2P_SHARD_COUNT` | 8 | 负载分片的分片数 |
| `FLAGCX_P2P_CQ_DEPTH` | 4096 | 完成队列深度 |
| `FLAGCX_P2P_MAX_WR_PER_POST` | 256 | 每次 post 的最大工作请求数 |
| `FLAGCX_P2P_MAX_REQUESTS` | 256 | 最大未完成请求数 |
| `FLAGCX_P2P_BATCH_POLL_SIZE` | 64 | 完成轮询的批量大小 |
| `FLAGCX_P2P_SLICE_SIZE` | 1073741824 (1GB) | 大传输的分片大小 |
| `FLAGCX_P2P_FRAGMENT_LIMIT` | 4096 (4KB) | 分片的片段限制 |
| `FLAGCX_P2P_MAX_SGE` | 4 | 最大分散/聚集元素数 |
| `FLAGCX_P2P_MAX_INLINE` | 64 | 最大内联数据大小 |
| `FLAGCX_P2P_IB_PORT` | 1 | InfiniBand 端口号 |
| `FLAGCX_P2P_GID_INDEX` | -1 | RoCE 的 GID 索引（-1 = 自动检测） |
| `FLAGCX_P2P_MTU` | 4096 | IB 传输的 MTU 大小 |
| `FLAGCX_P2P_IB_TC` | -1 | IB 流量类别（-1 = 关闭） |
| `FLAGCX_P2P_RETRY_CNT` | 7 | 失败操作的重试次数 |
| `FLAGCX_P2P_NOTIF_MAX_PEERS` | 64 | 最大通知对等节点数 |
| `FLAGCX_P2P_DEST_DEV_AFFINITY` | 0 | 设置为 1 时，启用目标设备亲和性 |

**注意**：这些变量用于配置 FlagCX P2P 引擎以支持单边 RDMA 操作，主要用于与 NIXL 等传输框架集成。

---

## 拓扑配置

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_TOPO_FILE` | 无 | 网络/GPU 拓扑的 XML 拓扑文件路径 |
| `FLAGCX_TOPO_DUMP_FILE` | 无 | 将发现的拓扑导出为 XML 的路径 |
| `FLAGCX_INTERSERVER_ROUTE_FILE` | 无 | 服务器间路由配置文件路径 |
| `FLAGCX_TOPO_DETECTION_DISABLE` | 0 | 设置为 1 时，禁用拓扑检测 |

---

## 调优器配置

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_USE_TUNER` | 0 | 设置为 1 时，启用内部调优器 |
| `FLAGCX_USE_COMM_TAG` | 无 | 从配置列表中指定要使用的通信器标签 |
| `FLAGCX_TUNER_SEARCH_NLOOPS` | 5 | 调优器搜索的循环次数（最少 5 次） |
| `FLAGCX_TUNER_CONFIG_ID` | 无 | 当前调优器配置 ID（用于 FlagScale 调优） |
| `FLAGCX_TUNER_BEST_CONFIG_ID` | 无 | 最佳调优器配置 ID（用于 FlagScale 调优） |
| `FLAGCX_TUNER_DONE` | 无 | 调优完成时设置为 1（由系统设置） |
| `FLAGCX_TUNE_FILE` | 无 | 调优文件路径 |
| `FLAGCX_TUNE_GROUP_IDX` | 无 | 调优组索引 |
| `FLAGCX_TUNING_WITH_FLAGSCALE` | 0 | 设置为 1 时，启用与 FlagScale 一起调优 |
| `TUNNING_WITH_SINGLE_COMM` | 0 | 设置为 1 时，使用单个通信器进行调优（注意：无 FLAGCX_ 前缀） |

---

## HybridRunner 配置

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_C2C_ALGO` | Sequential | C2C 算法选择。可选值：RING_PIPELINED、XML_INPUT |
| `FLAGCX_C2C_ALGO_EXPORT_PATH` | 无 | 导出算法 XML 文件的目录路径 |
| `FLAGCX_C2C_ALGO_EXPORT_PREFIX` | 无 | 导出的算法 XML 文件的前缀 |
| `FLAGCX_C2C_ALGO_IMPORT_PATH` | 无 | 导入算法 XML 文件的目录路径 |
| `FLAGCX_C2C_ALGO_IMPORT_PREFIX` | 无 | 导入的算法 XML 文件的前缀 |
| `FLAGCX_C2C_SEARCH_GRANULARITY` | 无 | C2C 算法搜索的粒度 |

---

## UniRunner 配置

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_P2P_EVENT_POOL_SIZE` | 1024 | P2P 事件池大小 |
| `FLAGCX_UNIRUNNER_NSLICES` | 1 | uniRunner 的分片数 |
| `FLAGCX_UNIRUNNER_NTHREADS` | 32 | uniRunner 每个块的线程数 |
| `FLAGCX_UNIRUNNER_NBLOCKS` | 1 | uniRunner 的块数 |
| `FLAGCX_UNIRUNNER_USE_LOCRED` | 0 | 设置为 1 时，在 uniRunner 中使用本地归约 |
| `FLAGCX_UNIRUNNER_USE_RINGAG` | 0 | 设置为 1 时，在 uniRunner 中使用环形 allgather |
| `FLAGCX_UNIRUNNER_USE_SLICEDAR` | 0 | 设置为 1 时，在 uniRunner 中使用分片 allreduce |
| `FLAGCX_UNIRUNNER_NREDSLICES` | 0 | uniRunner 的归约分片数（0 = 自动） |
| `FLAGCX_UNIRUNNER_REDSLICESIZE` | 65536 | uniRunner 的归约分片大小（字节） |

---

## 网络配置

### InfiniBand (IB) 设置

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_IB_DISABLE` | 0 | 设置为 1 时，禁用 InfiniBand |
| `FLAGCX_IB_HCA` | 无 | 指定要使用的 IB HCA 设备 |
| `FLAGCX_IB_GID_INDEX` | -1 | RoCE 的 GID 索引。-1 表示自动检测 |
| `FLAGCX_IB_ROCE_VERSION_NUM` | 2 | 使用的 RoCE 版本号 |
| `FLAGCX_IB_TIMEOUT` | 18 | IB 超时值（指数级，实际超时 = 4.096us * 2^值） |
| `FLAGCX_IB_RETRY_CNT` | 7 | IB 重试次数 |
| `FLAGCX_IB_PKEY` | 0 | IB 分区键索引 |
| `FLAGCX_IB_USE_INLINE` | 0 | 设置为 1 时，为小消息启用内联数据 |
| `FLAGCX_IB_SL` | 0 | IB 服务级别 |
| `FLAGCX_IB_TC` | 0 | IB 流量类别 |
| `FLAGCX_IB_AR_THRESHOLD` | 8192 | 启用自适应路由的阈值（字节） |
| `FLAGCX_IB_PCI_RELAXED_ORDERING` | 2 | PCI 宽松排序模式。0=关闭、1=开启、2=自动 |
| `FLAGCX_IB_ADAPTIVE_ROUTING` | -2 | 自适应路由设置。-2=自动、-1=关闭、0+=开启并使用该值 |
| `FLAGCX_IB_MERGE_VFS` | 1 | 设置为 1 时，合并虚拟功能 |
| `FLAGCX_IB_MERGE_NICS` | 1 | 设置为 1 时，将多个网卡合并为一个逻辑设备 |
| `FLAGCX_IB_QPS_PER_CONNECTION` | 1 | 每个连接的队列对数量 |
| `FLAGCX_IB_SPLIT_DATA_ON_QPS` | 0 | 设置为 1 时，在 QP 间分割数据 |
| `FLAGCX_IB_ADDR_FAMILY` | 无 | IB 地址族。可选值：AF_IB、AF_INET、AF_INET6 |
| `FLAGCX_IB_ADDR_RANGE` | 无 | IB 连接的 IP 地址范围 |
| `FLAGCX_GDR_FLUSH_DISABLE` | 0 | 设置为 1 时，禁用 GDR 刷新操作 |
| `FLAGCX_IBUC_SPLIT_DATA_ON_QPS` | 0 | 设置为 1 时，为 IBUC 在 QP 间分割数据 |

### IB 重传

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_IB_RETRANS_ENABLE` | 0 | 设置为 1 时，启用软件重传 |
| `FLAGCX_IB_RETRANS_TIMEOUT` | 5000 | 最小 RTO 超时（微秒） |
| `FLAGCX_IB_RETRANS_MAX_RETRY` | 10 | 最大重传重试次数 |
| `FLAGCX_IB_RETRANS_ACK_INTERVAL` | 16 | 重传的 ACK 间隔 |
| `FLAGCX_IB_MAX_OUTSTANDING` | 16 | 最大未完成请求数 |

### Socket 网络

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_SOCKET_FAMILY` | 自动 | Socket 地址族。可选值：AF_INET（IPv4）、AF_INET6（IPv6） |
| `FLAGCX_SOCKET_IFNAME` | 自动 | 要使用的网络接口名称。使用 ^ 前缀排除，= 精确匹配 |
| `FLAGCX_NSOCKS_PERTHREAD` | -2 | 每个线程的 socket 数量（-2=自动） |
| `FLAGCX_SOCKET_NTHREADS` | -2 | socket 线程数量（-2=自动） |
| `FLAGCX_FORCE_NET_SOCKET` | 0 | 设置为 1 时，强制使用 socket 网络而非 IB |

### UCX 网络

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_UCX_DISABLE` | 0 | 设置为 1 时，禁用 UCX 网络 |
| `FLAGCX_UCX_TLS` | 无 | 要使用的 UCX 传输层。如果未设置，则回退到 UCX_TLS |
| `FLAGCX_UCX_CUDA_DISABLE` | 1 | 设置为 1 时，禁用 UCX CUDA 支持 |

### Gloo 网络

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_GLOO_IB_DISABLE` | 0 | 设置为 1 时，为 Gloo 传输禁用 IB |

### ACCL/Barex 和 PPU 集成

使用 `USE_ACCL_BAREX=1` 构建 ACCL/Barex 网络适配器。PPU 集成通常使用 `USE_PPU=1 USE_ACCL_BAREX=1`；具体集成环境还可能选择 `FLAGCX_P2P_TRANSPORT=accl`、启用 `FLAGCX_MEM_ENABLE=1`，并通过 `FLAGCX_VMM_ENABLE=0` 禁用虚拟内存。这些设置是特定集成环境的前置条件，并非通用默认值。

---

## 插件配置

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_DEVICE_ADAPTOR_PLUGIN` | 无 | 设备适配器插件共享库路径 |
| `FLAGCX_NET_ADAPTOR_PLUGIN` | 无 | 网络适配器插件共享库路径 |
| `FLAGCX_CCL_ADAPTOR_PLUGIN` | 无 | CCL 适配器插件共享库路径 |

---

## 其他

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `FLAGCX_IGNORE_CPU_AFFINITY` | 0 | （已注释）设置为 1 时，忽略 CPU 亲和性 |

---

## 注意事项

- 布尔变量通常使用 0 表示假/禁用，1 表示真/启用
- 默认值为 -2 的变量通常表示"自动检测"行为
- 使用 FLAGCX_PARAM 宏时，FLAGCX_ 前缀会自动添加到变量名
- 某些变量可能仅在初始化时生效
- 调试日志会显著影响性能；在生产环境中请谨慎使用
