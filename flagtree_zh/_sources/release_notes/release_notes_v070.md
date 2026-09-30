# FlagTree 0.7.0 发布

- **新增特性**
  - 3.6.x 分支：
    - TLE-Lite：
      - 新增 `tle.shard_id` 操作，用于查询当前 program 在 device mesh 指定轴上的坐标。在 NVIDIA 上支持。
      - 新增以下分布式操作：`tle.signal` 和 `tle.signal_wait`。在 NVIDIA 上支持。
      - 为 `tle.remote` 扩展 `space`（cluster / device / node）、`dtype`、`offset`、`coopkind` 和 `netidx` 参数，覆盖线程块 cluster 内（DSMEM）、节点内 GPU 之间（NVLink P2P）以及跨节点（FlagCX/RDMA）的远程访问。在 NVIDIA 上支持。
      - 为 `tle.distributed_barrier` 扩展 `space`、`group_kind`、`barrier_kind` 和 `order` 参数。在 NVIDIA 上支持。
    - TLE-Struct：
      - 通过 `tle.gpu.alloc(..., alias=...)` 新增 GPU 缓冲区别名（buffer aliasing），提供带类型的共享内存视图，并对别名视图进行静态校验。
      - 新增 `tle.gpu.set_layout` 操作，用于显式分布式布局赋值，并提供 `BlockEncoding`、`MmaEncoding`、`DotOperandEncoding` 和 `SlicedEncoding` 布局对象。
      - 新增以下 barrier 操作：`tle.gpu.alloc_barrier`、`tle.gpu.alloc_barriers`、`tle.gpu.barrier_wait` 和 `tle.gpu.barrier_arrive`；为 `tle.gpu.copy` 新增 `barrier` 和 `mask` 参数。在 NVIDIA 上支持。
      - 新增 `tle.gpu.wgmma` 和 `tle.gpu.wgmma_wait` 操作。在 NVIDIA 上支持。
      - 新增 `tle.gpu.buffered_tensor.slot` 和 `tle.gpu.buffered_tensor.reshape` 操作。在 NVIDIA 上支持。
      - 为 `tle.gpu.alloc` 新增 `init_value` 和 `alias_offset_bytes` 参数。在 NVIDIA 上支持。
    - TLE-Raw：
      - 新增 `library` 与 `compiler` 参数，支持通过 `@dialect(..., library="nvshmem", compiler="clang")` 将 NVSHMEM 设备端接口内联进 TLE-Raw kernel。在 NVIDIA 上支持。

  - 后端：
    - 新增以下后端集成（基于 Triton 3.6）并新增 CI/CD：[tileir](/getting_started/multi-backend-prebuilt-docker-image-install/install-tileir.md)（NVIDIA TileIR）、[ppu](/getting_started/multi-backend-prebuilt-docker-image-install/install-ppu.md)（平头哥）和 [spacemit](/getting_started/multi-backend-prebuilt-docker-image-install/install-spacemit.md)（进迭时空）。
    - 将以下后端升级至 Triton 3.6 并新增 CI/CD：[sunrise](/getting_started/multi-backend-prebuilt-docker-image-install/install-sunrise.md)、[xpu](/getting_started/multi-backend-prebuilt-docker-image-install/install-xpu.md)、[iluvatar](/getting_started/multi-backend-prebuilt-docker-image-install/install-iluvatar.md) 和 [tsingmicro](/getting_started/multi-backend-prebuilt-docker-image-install/install-tsingmicro.md)。
    - 为 [amd](/getting_started/multi-backend-prebuilt-docker-image-install/install-amd.md) 后端新增 TLE 支持并新增 CI/CD。
    - 另外还支持 [rpu](/getting_started/multi-backend-prebuilt-docker-image-install/install-rpu.md)（辉羲智能，Triton 3.6）。在 3.3.x 分支上，[ARM64 CPU](/getting_started/install-arm64-cpu.md) 提供 [TLE-CPU](/user_guide/use-tle-cpu.md)。

- **DevTools（调试器与性能分析器）**
  - FlagPrism（[flagos-ai/FlagPrism](https://github.com/flagos-ai/FlagPrism)）为 Triton 程序提供调试与性能分析工具，包含 `flagtree.debugger` 与 `flagtree.profiler`，以 `third_party/FlagPrism` 子模块集成在 FlagTree 中。先支持部分后端：华为昇腾、天数智芯、摩尔线程。
