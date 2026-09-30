# FlagCX Environment Variables

This document provides a comprehensive reference for all environment variables used in FlagCX.

## Table of Contents

- [FlagCX Environment Variables](#flagcx-environment-variables)
  - [Table of Contents](#table-of-contents)
  - [Debug and Logging](#debug-and-logging)
  - [Communication Mode](#communication-mode)
  - [Buffer and Memory](#buffer-and-memory)
  - [Proxy and Runtime](#proxy-and-runtime)
  - [Topology Configuration](#topology-configuration)
  - [Tuner Configuration](#tuner-configuration)
  - [HybridRunner Configuration](#hybridrunner-configuration)
  - [UniRunner Configuration](#unirunner-configuration)
  - [Network Configuration](#network-configuration)
    - [InfiniBand (IB) Settings](#infiniband-ib-settings)
    - [IB Retransmission](#ib-retransmission)
    - [Socket Network](#socket-network)
    - [UCX Network](#ucx-network)
    - [Gloo Network](#gloo-network)
    - [ACCL/Barex and PPU Integration](#acclbarex-and-ppu-integration)
  - [Plugin Configuration](#plugin-configuration)
  - [Miscellaneous](#miscellaneous)
  - [Notes](#notes)

---

## Debug and Logging

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_DEBUG` | None | Set debug logging level. Values: VERSION, WARN, INFO, ABORT, TRACE |
| `FLAGCX_DEBUG_SUBSYS` | INIT,ENV | Comma-separated list of debug subsystems. Prefix with ^ to invert. Values: INIT, COLL, P2P, SHM, NET, GRAPH, TUNING, ENV, ALLOC, CALL, PROXY, NVLS, BOOTSTRAP, REG, ALL |
| `FLAGCX_DEBUG_FILE` | stdout | Output file for debug logs. Supports %h (hostname), %p (pid) placeholders |
| `FLAGCX_WARN_ENABLE_DEBUG_INFO` | 0 | When set to 1, enables extended debug info on warnings |
| `FLAGCX_SET_THREAD_NAME` | 0 | When set to 1, enables setting thread names for debugging |

---

## Communication Mode

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_USE_HOST_COMM` | 0 | When set to 1, uses host communication mode |
| `FLAGCX_USE_HETERO_COMM` | 0 | When set to 1, enables uniRunner mode |
| `FLAGCX_COMM_ID` | None | Specifies the communication ID for bootstrap. When set, rank 0 will create the root |
| `FLAGCX_HOSTID` | None | Override the host identifier string for host hashing |
| `FLAGCX_CLUSTER_SPLIT_LIST` | None | Comma-separated list of cluster split counts (e.g., 2,4,8), enabling hybridRunner mode |

---

## Buffer and Memory

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_NET_BUFFER_SIZE` | 67108864 (64MB) | Network buffer size in bytes |
| `FLAGCX_NET_CHUNK_SIZE` | 4194304 (4MB) | Network chunk size in bytes |
| `FLAGCX_P2P_BUFFER_SIZE` | 67108864 (64MB) | P2P buffer size in bytes |
| `FLAGCX_P2P_CHUNK_SIZE` | 16777216 (16MB) | P2P chunk size in bytes |
| `FLAGCX_SEMAPHORE_BUFFER_POOL_CAPACITY` | 32 | Capacity of semaphore buffer pool |
| `FLAGCX_KERNEL_FIFO_CAPACITY` | 128 | Kernel FIFO capacity |
| `FLAGCX_REDUCE_FIFO_CAPACITY` | 128 | Reduce operation FIFO capacity |
| `FLAGCX_MEM_ENABLE` | 0 | When set to 1, enables memory allocation via device adaptor |
| `FLAGCX_DMABUF_ENABLE` | 0 | When set to 1, enables DMA-BUF support for memory registration |

---

## Proxy and Runtime

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_RUNTIME_PROXY` | 0 | When set to 1, enables runtime proxy mode |
| `FLAGCX_PROGRESS_APPENDOP_FREQ` | 8 | Frequency of append operation in progress loop |
| `FLAGCX_P2P_DISABLE` | 0 | When set to 1, disables P2P transport |
| `FLAGCX_P2P_SCHEDULE_DISABLE` | 0 | When set to 1, disables P2P scheduling optimization |
| `FLAGCX_DEVICE_FUNC_PATH` | None | Path to device function library for async kernel loading |
| `FLAGCX_RMA_QUEUE_SIZE` | 256 | Per-peer circular buffer depth for the RMA proxy thread. Must be a power of two |
| `FLAGCX_RMA_BATCH_MAX` | 256 | Maximum number of RDMA PUT descriptors batched into a single `iputBatch` call |

---

## P2P Engine Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_P2P_QPS_PER_CONN` | 4 | QP connections per P2P connection |
| `FLAGCX_P2P_WORKERS_PER_POOL` | 4 | Worker threads per pool |
| `FLAGCX_P2P_SHARD_COUNT` | 8 | Shard count for load distribution |
| `FLAGCX_P2P_CQ_DEPTH` | 4096 | Completion queue depth |
| `FLAGCX_P2P_MAX_WR_PER_POST` | 256 | Maximum work requests per post |
| `FLAGCX_P2P_MAX_REQUESTS` | 256 | Maximum outstanding requests |
| `FLAGCX_P2P_BATCH_POLL_SIZE` | 64 | Batch poll size for completions |
| `FLAGCX_P2P_SLICE_SIZE` | 1073741824 (1GB) | Slice size for large transfers |
| `FLAGCX_P2P_FRAGMENT_LIMIT` | 4096 (4KB) | Fragment limit for slicing |
| `FLAGCX_P2P_MAX_SGE` | 4 | Maximum scatter-gather elements |
| `FLAGCX_P2P_MAX_INLINE` | 64 | Maximum inline data size |
| `FLAGCX_P2P_IB_PORT` | 1 | InfiniBand port number |
| `FLAGCX_P2P_GID_INDEX` | -1 | GID index for RoCE (-1 = auto-detect) |
| `FLAGCX_P2P_MTU` | 4096 | MTU size for IB transfers |
| `FLAGCX_P2P_IB_TC` | -1 | IB traffic class (-1 = off) |
| `FLAGCX_P2P_RETRY_CNT` | 7 | Retry count for failed operations |
| `FLAGCX_P2P_NOTIF_MAX_PEERS` | 64 | Maximum notification peers |
| `FLAGCX_P2P_DEST_DEV_AFFINITY` | 0 | When set to 1, enables destination device affinity |

**Note**: These variables configure the FlagCX P2P Engine for one-sided RDMA operations, primarily used when integrating with transfer frameworks like NIXL.

### ACCL/Barex transport

Environment variables change runtime behavior without rebuilding the library. The following settings apply only to deployments that build and use the ACCL/Barex transport adaptor:

| Variable | Description |
|----------|-------------|
| `FLAGCX_P2P_TRANSPORT` | Set to `accl` to select the ACCL/Barex path when the adaptor is available. |
| `FLAGCX_ACCL_MAX_MR_MB` | Limits ACCL/Barex registered-memory chunking. `0` disables this limit. |
| `FLAGCX_VMM_ENABLE` | The current ACCL/Barex integration path requires `0`. |

Build the adaptor with `USE_ACCL_BAREX=1`. These are deployment-specific settings, not universal defaults.

---

## Topology Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_TOPO_FILE` | None | Path to XML topology file for network/GPU topology |
| `FLAGCX_TOPO_DUMP_FILE` | None | Path to dump discovered topology as XML |
| `FLAGCX_INTERSERVER_ROUTE_FILE` | None | Path to inter-server routing configuration file |
| `FLAGCX_TOPO_DETECTION_DISABLE` | 0 | When set to 1, disables topology detection |

---

## Tuner Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_USE_TUNER` | 0 | When set to 1, enables the internal tuner |
| `FLAGCX_USE_COMM_TAG` | None | Specifies a communicator tag to use from config list |
| `FLAGCX_TUNER_SEARCH_NLOOPS` | 5 | Number of loops for tuner search (minimum 5) |
| `FLAGCX_TUNER_CONFIG_ID` | None | Current tuner configuration ID (for FlagScale tuning) |
| `FLAGCX_TUNER_BEST_CONFIG_ID` | None | Best tuner configuration ID (for FlagScale tuning) |
| `FLAGCX_TUNER_DONE` | None | Set to 1 when tuning is complete (set by system) |
| `FLAGCX_TUNE_FILE` | None | Path to tune file |
| `FLAGCX_TUNE_GROUP_IDX` | None | Tune group index |
| `FLAGCX_TUNING_WITH_FLAGSCALE` | 0 | When set to 1, enables tuning with FlagScale |
| `TUNNING_WITH_SINGLE_COMM` | 0 | When set to 1, uses a single communicator for tuning (note: no FLAGCX_ prefix) |

---

## HybridRunner Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_C2C_ALGO` | Sequential | C2C algorithm selection. Values: RING_PIPELINED, XML_INPUT |
| `FLAGCX_C2C_ALGO_EXPORT_PATH` | None | Directory path to export algorithm XML files |
| `FLAGCX_C2C_ALGO_EXPORT_PREFIX` | None | Prefix for exported algorithm XML files |
| `FLAGCX_C2C_ALGO_IMPORT_PATH` | None | Directory path to import algorithm XML files |
| `FLAGCX_C2C_ALGO_IMPORT_PREFIX` | None | Prefix for imported algorithm XML files |
| `FLAGCX_C2C_SEARCH_GRANULARITY` | None | Granularity for C2C algorithm search |

---

## UniRunner Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_P2P_EVENT_POOL_SIZE` | 1024 | Size of P2P event pool |
| `FLAGCX_UNIRUNNER_NSLICES` | 1 | Number of slices for uniRunner |
| `FLAGCX_UNIRUNNER_NTHREADS` | 32 | Number of threads per block for uniRunner |
| `FLAGCX_UNIRUNNER_NBLOCKS` | 1 | Number of blocks for uniRunner |
| `FLAGCX_UNIRUNNER_USE_LOCRED` | 0 | When set to 1, uses local reduction in uniRunner |
| `FLAGCX_UNIRUNNER_USE_RINGAG` | 0 | When set to 1, uses ring allgather in uniRunner |
| `FLAGCX_UNIRUNNER_USE_SLICEDAR` | 0 | When set to 1, uses sliced allreduce in uniRunner |
| `FLAGCX_UNIRUNNER_NREDSLICES` | 0 | Number of reduction slices for uniRunner (0 = auto) |
| `FLAGCX_UNIRUNNER_REDSLICESIZE` | 65536 | Reduction slice size in bytes for uniRunner |

---

## Network Configuration

### InfiniBand (IB) Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_IB_DISABLE` | 0 | When set to 1, disables InfiniBand |
| `FLAGCX_IB_HCA` | None | Specifies which IB HCA devices to use |
| `FLAGCX_IB_GID_INDEX` | -1 | GID index for RoCE. -1 means auto-detect |
| `FLAGCX_IB_ROCE_VERSION_NUM` | 2 | RoCE version number to use |
| `FLAGCX_IB_TIMEOUT` | 18 | IB timeout value (exponential, actual timeout = 4.096us * 2^value) |
| `FLAGCX_IB_RETRY_CNT` | 7 | Number of IB retry attempts |
| `FLAGCX_IB_PKEY` | 0 | IB partition key index |
| `FLAGCX_IB_USE_INLINE` | 0 | When set to 1, enables inline data for small messages |
| `FLAGCX_IB_SL` | 0 | IB Service Level |
| `FLAGCX_IB_TC` | 0 | IB Traffic Class |
| `FLAGCX_IB_AR_THRESHOLD` | 8192 | Threshold (bytes) above which adaptive routing is enabled |
| `FLAGCX_IB_PCI_RELAXED_ORDERING` | 2 | PCI relaxed ordering mode. 0=off, 1=on, 2=auto |
| `FLAGCX_IB_ADAPTIVE_ROUTING` | -2 | Adaptive routing setting. -2=auto, -1=off, 0+=on with value |
| `FLAGCX_IB_MERGE_VFS` | 1 | When set to 1, merges Virtual Functions |
| `FLAGCX_IB_MERGE_NICS` | 1 | When set to 1, merges multiple NICs into one logical device |
| `FLAGCX_IB_QPS_PER_CONNECTION` | 1 | Number of Queue Pairs per connection |
| `FLAGCX_IB_SPLIT_DATA_ON_QPS` | 0 | When set to 1, splits data across QPs |
| `FLAGCX_IB_ADDR_FAMILY` | None | Address family for IB. Values: AF_IB, AF_INET, AF_INET6 |
| `FLAGCX_IB_ADDR_RANGE` | None | IP address range for IB connections |
| `FLAGCX_GDR_FLUSH_DISABLE` | 0 | When set to 1, disables GDR flush operations |
| `FLAGCX_IBUC_SPLIT_DATA_ON_QPS` | 0 | When set to 1, splits data across QPs for IBUC |

### IB Retransmission

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_IB_RETRANS_ENABLE` | 0 | When set to 1, enables software retransmission |
| `FLAGCX_IB_RETRANS_TIMEOUT` | 5000 | Minimum RTO timeout in microseconds |
| `FLAGCX_IB_RETRANS_MAX_RETRY` | 10 | Maximum number of retransmission retries |
| `FLAGCX_IB_RETRANS_ACK_INTERVAL` | 16 | ACK interval for retransmission |
| `FLAGCX_IB_MAX_OUTSTANDING` | 16 | Maximum outstanding requests |

### Socket Network

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_SOCKET_FAMILY` | Auto | Socket address family. Values: AF_INET (IPv4), AF_INET6 (IPv6) |
| `FLAGCX_SOCKET_IFNAME` | Auto | Network interface name(s) to use. Prefix with ^ to exclude, = for exact match |
| `FLAGCX_NSOCKS_PERTHREAD` | -2 | Number of sockets per thread (-2=auto) |
| `FLAGCX_SOCKET_NTHREADS` | -2 | Number of socket threads (-2=auto) |
| `FLAGCX_FORCE_NET_SOCKET` | 0 | When set to 1, forces socket network instead of IB |

### UCX Network

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_UCX_DISABLE` | 0 | When set to 1, disables UCX network |
| `FLAGCX_UCX_TLS` | None | UCX transport layers to use. Falls back to UCX_TLS if not set |
| `FLAGCX_UCX_CUDA_DISABLE` | 1 | When set to 1, disables UCX CUDA support |

### Gloo Network

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_GLOO_IB_DISABLE` | 0 | When set to 1, disables IB support for Gloo transport |

### ACCL/Barex and PPU Integration

Build the ACCL/Barex network adaptor with `USE_ACCL_BAREX=1`. The PPU integration commonly uses `USE_PPU=1 USE_ACCL_BAREX=1`; integration environments may also select `FLAGCX_P2P_TRANSPORT=accl`, enable `FLAGCX_MEM_ENABLE=1`, and disable virtual memory with `FLAGCX_VMM_ENABLE=0`. These settings are integration prerequisites, not universal defaults.

---

## Plugin Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_DEVICE_ADAPTOR_PLUGIN` | None | Path to device adaptor plugin shared library |
| `FLAGCX_NET_ADAPTOR_PLUGIN` | None | Path to network adaptor plugin shared library |
| `FLAGCX_CCL_ADAPTOR_PLUGIN` | None | Path to CCL adaptor plugin shared library |

---

## Miscellaneous

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAGCX_IGNORE_CPU_AFFINITY` | 0 | (Commented out) When set to 1, ignores CPU affinity |

---

## Notes

- Boolean variables generally use 0 for false/disabled and 1 for true/enabled
- Variables with default -2 typically indicate "auto-detect" behavior
- The FLAGCX_ prefix is automatically added to variable names when using the FLAGCX_PARAM macro
- Some variables may only take effect at initialization time
- Debug logging can significantly impact performance; use with caution in production
