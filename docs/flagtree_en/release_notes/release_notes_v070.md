# FlagTree 0.7.0 Release

- **Added Features**
  - 3.6.x branch:
    - TLE-Lite:
      - Added the `tle.shard_id` op for querying the coordinate of the current program along a device-mesh axis. Supported on NVIDIA.
      - Added the following distributed ops: `tle.signal` and `tle.signal_wait`. Supported on NVIDIA.
      - Extended `tle.remote` with the `space` (cluster / device / node), `dtype`, `offset`, `coopkind`, and `netidx` parameters, covering remote access within a thread-block cluster (DSMEM), between GPUs in a node (NVLink P2P), and across nodes (FlagCX/RDMA). Supported on NVIDIA.
      - Extended `tle.distributed_barrier` with the `space`, `group_kind`, `barrier_kind`, and `order` parameters. Supported on NVIDIA.
    - TLE-Struct:
      - Added GPU buffer aliasing through `tle.gpu.alloc(..., alias=...)`, providing typed shared-memory views with static validation of aliased views.
      - Added the `tle.gpu.set_layout` op for explicit distributed-layout assignment, together with the `BlockEncoding`, `MmaEncoding`, `DotOperandEncoding`, and `SlicedEncoding` layout objects.
      - Added the following barrier ops: `tle.gpu.alloc_barrier`, `tle.gpu.alloc_barriers`, `tle.gpu.barrier_wait`, and `tle.gpu.barrier_arrive`; added the `barrier` and `mask` parameters to `tle.gpu.copy`. Supported on NVIDIA.
      - Added the `tle.gpu.wgmma` and `tle.gpu.wgmma_wait` ops. Supported on NVIDIA.
      - Added the `tle.gpu.buffered_tensor.slot` and `tle.gpu.buffered_tensor.reshape` ops. Supported on NVIDIA.
      - Added the `init_value` and `alias_offset_bytes` parameters to `tle.gpu.alloc`. Supported on NVIDIA.
    - TLE-Raw:
      - Added the `library` and `compiler` parameters, enabling NVSHMEM device-side interfaces to be inlined into TLE-Raw kernels via `@dialect(..., library="nvshmem", compiler="clang")`. Supported on NVIDIA.

  - Backends:
    - Added the following backend integrations (based on Triton 3.6) and added CI/CD: [tileir](/getting_started/multi-backend-prebuilt-docker-image-install/install-tileir.md) (NVIDIA TileIR), [ppu](/getting_started/multi-backend-prebuilt-docker-image-install/install-ppu.md) (T-Head), and [spacemit](/getting_started/multi-backend-prebuilt-docker-image-install/install-spacemit.md) (SpacemiT).
    - Upgraded the following backends to Triton 3.6 and added CI/CD: [sunrise](/getting_started/multi-backend-prebuilt-docker-image-install/install-sunrise.md), [xpu](/getting_started/multi-backend-prebuilt-docker-image-install/install-xpu.md), [iluvatar](/getting_started/multi-backend-prebuilt-docker-image-install/install-iluvatar.md), and [tsingmicro](/getting_started/multi-backend-prebuilt-docker-image-install/install-tsingmicro.md).
    - Added TLE support for the [amd](/getting_started/multi-backend-prebuilt-docker-image-install/install-amd.md) backend and added CI/CD.
    - [rpu](/getting_started/multi-backend-prebuilt-docker-image-install/install-rpu.md) (Huixi Intelligence, Triton 3.6) is also supported. On the 3.3.x branch, [ARM64 CPU](/getting_started/install-arm64-cpu.md) provides [TLE-CPU](/user_guide/use-tle-cpu.md).

- **DevTools (Debugger & Profiler)**
  - FlagPrism ([flagos-ai/FlagPrism](https://github.com/flagos-ai/FlagPrism)) provides debugging and performance-analysis tools for Triton programs, containing `flagtree.debugger` and `flagtree.profiler`, and is integrated into FlagTree as the `third_party/FlagPrism` submodule. It initially supports a subset of backends: Huawei Ascend, Iluvatar, and Moore Threads.
