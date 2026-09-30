# FlagTree 0.5.0 Release

- **Added Features**
  - Officially released TLE feature, supporting 31 core primitives for TLE-Lite and TLE-Struct:
    - TLE-Lite: 
      - NVIDIA: `tle.load(is_async=True)`，`tle.extract_tile`，`tle.insert_tile`，`tle.device_mesh`,`tle.sharding`，`tle.distributed_barrier`，`tle.remote`，`tl.load`（for local_ptr），`tl.store`（for local_ptr），`tl.atomic_add/and/cas/max/min/or/xchg/xor`（for local_ptr）.
      - Tsingmicro: `tle.device_mesh`, `tle.sharding`, `tle.remote`, and `tl.store`（for local_ptr）.
    - TLE-Struct:
      - NVIDIA: `tle.gpu.memory_space`, `tle.gpu.alloc`, `tle.gpu.copy`, `tle.gpu.local_ptr`, and `tle.gpu.local_ptr` (for remote).
      - Huawei Ascend: `tle.dsa.alloc`, `tle.dsa.copy`, `tle.dsa.local_ptr`, `tle.dsa.local_ptr` (for remote), `tle.dsa.to_tensor`, `tle.dsa.to_buffer`, `tle.add`/`sub`/`mul`/`div`/`max`/`min`, `tle.dsa.pipeline`, `tle.dsa.parallel`, `tle.dsa.hint`, `tle.dsa.extract_slice`, `tle.dsa.insert_slice`, `tle.dsa.extract_element`, `tle.dsa.subview`, `tle.dsa.ascend.{UB,L1,L0A,L0B,L0C}`.
      - Tsingmicro: `tle.dsa.alloc`, `tle.dsa.local_ptr`, and `tle.dsa.local_ptr` (for remote).
  - Officially released FLIR (FlagTree Intermediate Representation) feature.
    - Supports 76 Triton language primitives and 103 operators.
    - Enabled shared compiler passes across backends
    - Supported hardware platforms: AIPU, Huawei Ascend, and Tsingmicro
