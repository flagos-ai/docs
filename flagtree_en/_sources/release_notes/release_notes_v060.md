# FlagTree 0.6.0 Release


- **Added Features**
  - 3.6.x branch:
    - TLE-Lite:
      - Added the `tle.cumsum` scan and sort op. Supported on NVIDIA.
      - Added the following pipeline ops: `tle.pipe`, `tle.pipe.reader`, `tle.pipe.reader.wait`, `tle.pipe.reader.release`, `tle.pipe.writer.acquire`, `tle.pipe.writer.commit`, and `tle.pipe.writer.close`. Supported on NVIDIA.
    - TLE-Struct:
      - Added the `tle.gpu.warp_specialize` execution orchestration op. Supported on NVIDIA.
    - TLE-Raw:
      - Added a new method of integrating CUDA kernel into LLVM inline path for maximum fine-grained control. Supported on NVIDIA.
    - Upgraded the following backends to Triton 3.6: enflame, hcu, and mthreads.
    - Added damoacademy as a new backend.
  
    - Added Moore Threads as a new backend to the 3.6.x branch with support of the following TLE primitives:
      - TLE-Lite:
        - Added the following ops: `tle.load(is_async=True)`, `tl.load`/`tl.store` (for `local_ptr`), and `tl.atomic_add/and/cas/max/min/or/xchg/xor` (for `local_ptr`). Supported on Moore Threads.
      - TLE-Struct:
        - Added the following ops: `tle.gpu.alloc`, `tle.gpu.local_ptr`, `tle.gpu.copy`, and `tle.gpu.memory_space`. Supported on Moore Threads.

  - 3.3.x branch:
    - Added [ARM64 CPU](/getting_started/install-arm64-cpu.md) as a new backend that supports [TLE-CPU](/user_guide/use-tle-cpu.md).

- **Enhanced Features**
  - Enhanced FLIR.