# Release Notes

- **[2026/09]** Released [v.0.14.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.14.0):

  - Adds SHMEM Device API support with `USE_SHMEM` and `SHMEM_HOME` build controls.
  - Adds Scalar IR and Unified IR Device API test coverage, including split intra-node and inter-node test targets.
  - Adds ACCL/Barex network adaptor support and PPU backend integration controls.
  - Extends PyTorch plugin build detection for PPU and the canonical `USE_ILUVATAR` backend flag.
  - Updates Iluvatar build flag documentation: use `USE_ILUVATAR`; `USE_ILUVATAR_COREX` remains only as a deprecated compatibility alias.
  - Widens the lane-mask ABI to 64 bits for Device IR paths.
  - Updates packaging and dependency handling, including the NCCL 2.27 documentation floor for NVIDIA/NCCL wrapper usage.

- **[2026/06]** Released [v.0.13.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.13.0):

  - Introduces FlagCX P2P Engine for one-sided RDMA operations, designed for integration with transfer frameworks like NIXL.
  - Adds IBRC P2P adaptor for InfiniBand-based P2P communication.
  - Refactors Device API with symmetric memory (symmem) and multicast support.
  - Adds multi-FIFO support for Device API operations.
  - Introduces Device Pointer API for Triton integration.
  - Deprecates `flagcxHandlerGroup` in favor of separate `flagcxDeviceHandle` lifecycle management.
  - Adds new one-sided RDMA operations: `flagcxPut`, `flagcxBatchPut`, `flagcxReadCounter`, `flagcxWaitCounter`.
  - Optimizes RMA proxy with batched one-sided PUT operations for improved RDMA throughput.

- **[2026/05]** Released [v.0.12.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.12.0):

  - Adds support for Sunrise AI accelerators, including device adaptor `ptpuAdaptor` and CCL adaptor `pcclAdaptor`.
  - Extends PyTorch plugin support to PCCL backend.
  - Refactors one-sided memory registration with global handle indexing and HeteroComm isolation.
  - Adds P2P topology manager for optimized peer-to-peer communication.
  - Refactors P2P zerocopy implementation.
  - Adds device-side transport support for Device API.
  - Adds traits abstraction and DeviceAPI for unified vendor/fallback support.
  - Adds bootstrap extension for enhanced rendezvous capabilities.
  - Replaces C++17 features with C++11 equivalents for improved compatibility.

- **[2026/03]** Released [v.0.11.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.11.0):

  - Enables kernel-based communication on heterogeneous platforms, including NVIDIA and Hygon.
  - Adds support for both host-side and device-side one-sided communication semantics.
  - Introduces adaptor plugin support, enabling dynamic loading of user-defined Device, CCL, and Net adaptor implementations.

- **[2026/02]** Released [v.0.10.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.10.0):

  - Implements 11 chip-decoupled collective communication algorithms in uniRunner mode.
  - Refactors Device Intra-/Inter-node API and integrates NCCL Device API support on NVIDIA platforms.
  - Enhances usability with pip install support for FlagCX and an NCCL wrapper plugin for seamless adoption on NVIDIA platforms.

- **[2026/01]** Released [v.0.9.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.9.0):

  - Adds support for Enflame, including `topsAdaptor` and `ecclAdaptor`.
  - Extends flagcxCCLAdaptor to support symmetric operations.
  - Introduces the NCCL Device API in ncclAdaptor to enable customized AllReduce operations.
  - Refactors `glooAdaptor` to support both TCP and IB transports, with automatic NIC detection.

- **[2025/12]** Released [v.0.8.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.8.0):

  - Enables intra-node zero-copy to improve data transfer efficiency for small messages.
  - Supports a naive AllReduce implementation in uniRunner mode using a CPU-centric, device-assisted algorithm.
  - Adds one-sided communication primitives via the new APIs flagcxHeteroPut and flagcxHeteroPutSignal.

- **[2025/11]** Released [v.0.7.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.7.0):

  - Added support to TsingMicro, including device adaptor `tsmicroAdaptor` and CCL adaptor `tcclAdaptor`.
  - Implemented an experimental kernel-free non-reduce collective communication
    (*SendRecv*, *AlltoAll*, *AlltoAllv*, *Broadcast*, *Gather*, *Scatter*, *AllGather*)
    using device-buffer IPC/RDMA.
  - Enabled auto-tuning on NVIDIA, MetaX, and Hygon platforms, achieving 1.02×–1.26× speedups for
    *AllReduce*, *AllGather*, *ReduceScatter*, and *AlltoAll*.
  - Enhanced `flagcxNetAdaptor` with one-sided primitives (`put`, `putSignal`, `waitValue`) and added retransmission support for reliability improvement.

- **[2025/10]** Released [v.0.6.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.6.0):

  - Implemented device-buffer IPC communication to support intra-node *SendRecv* operations.
  - Introduced _device-initiated, host-launched device-side primitives_, enabling kernel-based communication directly from devices.
  - Enhanced auto-tuning with 50% performance improvement on MetaX platforms for the *AllReduce* operations.

- **[2025/09]** Released [v.0.5.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.5.0):

  - Added support for AMD GPUs, including a device adaptor `hipAdaptor` and a CCL adaptor `rcclAdaptor`.
  - Introduced `flagcxNetAdaptor` to unify network backends, currently supporting socket, IBRC, UCX and IBUC (experimental).
  - Enabled zero-copy device-buffer RDMA (user-buffer RDMA) to boost performance for small messages.
  - Supported auto-tuning in homogeneous scenarios via `flagcxTuner`.
  - Added test automation in CI/CD for PyTorch APIs.

- **[2025/08]** Released [v.0.4.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.4.0):

  - Supported heterogeneous training of ERNIE4.5 (Baidu) on NVIDIA and Iluvatar GPUs with Paddle + FlagCX.
  - Improved heterogeneous communication across arbitrary NIC configurations,
    with more robust and flexible deployments.
  - Introduced an experimental network plugin interface with extended supports for IBRC and SOCKET.
    Device buffer registration now can be done via DMA-BUF.
  - Added an InterOp-level DSL to enable customized C2C algorithm design.
  - Provided user documentation under `docs/`.

- **[2025/07]** Released [v.0.3.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.3.0):

  - Integrated three additional native communication libraries: HCCL (Huawei), MUSACCL (Moore Threads) and MPI.
  - Enhanced heterogeneous collective communication operations with pipeline optimizations. 
  - Introduced _device-side_ functions to enable device-buffer RDMA, complementing the existing _host-side_ functions.
  - Delivered a full-stack open-source solution, FlagScale + FlagCX, for efficient heterogeneous prefilling-decoding disaggregation.

- **[2025/05]** Released [v.0.2.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.2.0):

  - Integrated 3 additional native communications libraries, including MCCL (Moore Threads), XCCL (Mellanox) and DUCCL (BAAI).
  - Improved 11 heterogeneous collective communication operations with automatic topology detection and
    full support to single-NIC and multi-NIC environments.

- **[2025/04]** Released [v.0.1.0](https://github.com/flagos-ai/FlagCX/releases/tag/v0.1.0):

  - Added 5 native communications libraries including CCL adaptors for 
    NCCL (NVIDIA), IXCCL (Iluvatar), and CNCL (Cambricon), 
    and Host CCL adaptors GLOO and Bootstrap.
  - Supported 11 heterogeneous collective communication operations using the C2C (Cluster-to-Cluster) algorithm.
  - Provided a full-stack open-source solution, FlagScale + FlagCX, for efficient heterogeneous training.
  - Natively integrated into PaddlePaddle [v3.0.0](https://github.com/PaddlePaddle/Paddle/tree/v3.0.0),
    with support for both dynamic and static graphs.
