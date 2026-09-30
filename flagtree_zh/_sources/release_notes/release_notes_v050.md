# FlagTree 0.5.0 发布

- **新增特性**
  - 正式发布 TLE 特性，支持 TLE-Lite 和 TLE-Struct 共 31 个核心原语：
    - TLE-Lite： 
      - NVIDIA：`tle.load(is_async=True)`，`tle.extract_tile`，`tle.insert_tile`，`tle.device_mesh`，`tle.sharding`，`tle.distributed_barrier`，`tle.remote`，`tl.load`（用于 local_ptr），`tl.store`（用于 local_ptr），`tl.atomic_add/and/cas/max/min/or/xchg/xor`（用于 local_ptr）。
      - Tsingmicro：`tle.device_mesh`，`tle.sharding`，`tle.remote`，以及 `tl.store`（用于 local_ptr）。
    - TLE-Struct：
      - NVIDIA：`tle.gpu.memory_space`，`tle.gpu.alloc`，`tle.gpu.copy`，`tle.gpu.local_ptr`，以及 `tle.gpu.local_ptr`（用于 remote）。
      - 华为昇腾：`tle.dsa.alloc`，`tle.dsa.copy`，`tle.dsa.local_ptr`，`tle.dsa.local_ptr`（用于 remote），`tle.dsa.to_tensor`，`tle.dsa.to_buffer`，`tle.add`/`sub`/`mul`/`div`/`max`/`min`，`tle.dsa.pipeline`，`tle.dsa.parallel`，`tle.dsa.hint`，`tle.dsa.extract_slice`，`tle.dsa.insert_slice`，`tle.dsa.extract_element`，`tle.dsa.subview`，`tle.dsa.ascend.{UB,L1,L0A,L0B,L0C}`。
      - Tsingmicro：`tle.dsa.alloc`，`tle.dsa.local_ptr`，以及 `tle.dsa.local_ptr`（用于 remote）。
  - 正式发布 FLIR（FlagTree 中间表示）特性。
    - 支持 76 个 Triton 语言原语和 103 个算子。
    - 启用跨后端共享编译器 pass
    - 支持的硬件平台：AIPU、华为昇腾和 Tsingmicro
