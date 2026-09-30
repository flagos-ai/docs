# FlagTree 0.6.0 发布


- **新增特性**
  - 3.6.x 分支：
    - TLE-Lite：
      - 新增 `tle.cumsum` 扫描和排序操作。在 NVIDIA 上支持。
      - 新增以下流水线操作：`tle.pipe`，`tle.pipe.reader`，`tle.pipe.reader.wait`，`tle.pipe.reader.release`，`tle.pipe.writer.acquire`，`tle.pipe.writer.commit`，以及 `tle.pipe.writer.close`。在 NVIDIA 上支持。
    - TLE-Struct：
      - 新增 `tle.gpu.warp_specialize` 执行编排操作。在 NVIDIA 上支持。
    - TLE-Raw：
      - 新增将 CUDA kernel 集成到 LLVM 内联路径的方法，以实现最大程度的细粒度控制。在 NVIDIA 上支持。
    - 将以下后端升级至 Triton 3.6：enflame、hcu 和 mthreads。
    - 新增 damoacademy 作为新后端。
  
    - 在 3.6.x 分支中新增摩尔线程作为新后端，支持以下 TLE 原语：
      - TLE-Lite：
        - 新增以下操作：`tle.load(is_async=True)`，`tl.load`/`tl.store`（用于 `local_ptr`），以及 `tl.atomic_add/and/cas/max/min/or/xchg/xor`（用于 `local_ptr`）。在摩尔线程上支持。
      - TLE-Struct：
        - 新增以下操作：`tle.gpu.alloc`，`tle.gpu.local_ptr`，`tle.gpu.copy`，以及 `tle.gpu.memory_space`。在摩尔线程上支持。

  - 3.3.x 分支：
    - 新增 [ARM64 CPU](/getting_started/install-arm64-cpu.md) 作为新后端，支持 [TLE-CPU](/user_guide/use-tle-cpu.md)。

- **增强特性**
  - 增强 FLIR。
