# Overview

FlagCX is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.

FlagCX leverages native collective communication libraries to provide full single-chip communication support across platforms. Beyond its native x-CCL integrations, FlagCX introduces original device-buffer IPC and device-buffer RDMA technologies, enabling high-performance P2P operations for both cross-chip and single-chip scenarios. These mechanisms can be seamlessly combined with native x-CCL backends to deliver optimized performance for cross-chip collective communications.

## Architecture

FlagCX is organized into three layers:

### User Interface Layer (UIL)

The public C API defined in `flagcx/include/flagcx.h`. It exposes:

- Communicator lifecycle: `flagcxCommInitRank`, `flagcxCommDestroy`, `flagcxCommFinalize`
- Collective operations: AllReduce, AllGather, ReduceScatter, Broadcast, Reduce, Gather, Scatter, AlltoAll, AlltoAllv, Send, Recv
- One-sided RDMA operations: `flagcxGet`, `flagcxPutSignal`, `flagcxSignal`, `flagcxWaitSignal`
- Memory registration: `flagcxMemAlloc`, `flagcxCommRegister`, `flagcxCommWindowRegister`
- Group semantics: `flagcxGroupStart` / `flagcxGroupEnd`

### Communication Runtime Layer (CRL)

The runtime implements four execution strategies (runners), selected based on communicator type and environment configuration:

| Runner | Mode | Activation |
|--------|------|------------|
| **homoRunner** | Homogeneous communication (same chip type) | Default for homogeneous communicators |
| **hostRunner** | Host-side (CPU) communication | `FLAGCX_USE_HOST_COMM=1` |
| **hybridRunner** | Multi-cluster heterogeneous communication | `FLAGCX_CLUSTER_SPLIT_LIST=...` |
| **uniRunner** | Unified heterogeneous communication | `FLAGCX_USE_HETERO_COMM=1` |

The CRL also includes topology detection, proxy threads for async communication, P2P transport, an auto-tuner (`flagcxTuner`) for algorithm/protocol selection, and a cost model.

### Portable Abstraction Layer (PAL)

Hardware abstraction via the adaptor pattern. Each build selects exactly one device adaptor and two CCL adaptors (host + device):

- **CCL adaptors** (`flagcx/adaptor/ccl/`): One per vendor CCL library — NCCL, HCCL, IXCCL, CNCL, MCCL, DUCCL, MUSACCL, RCCL, TCCL, ECCL
- **Device adaptors** (`flagcx/adaptor/device/`): One per hardware runtime — CUDA, CANN, IXCUDA, MLU, MACA, MUSA, HIP, TOPS, etc.
- **Net adaptors** (`flagcx/adaptor/net/`): Network transport — InfiniBand, socket, UCX
- **Tuner adaptors** (`flagcx/adaptor/tuner/`): Tuning strategy plugins

Starting from v0.11, FlagCX supports **adaptor plugins** — user-defined Device, CCL, and Net adaptor implementations that are dynamically loaded at runtime via `dlopen`. See the `adaptor_plugin/` directory in the FlagCX repository for the SDK documentation and examples.

```{toctree}

backend-support.md
application-integration.md
```
