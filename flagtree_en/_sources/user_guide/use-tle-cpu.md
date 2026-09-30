# Use TLE-CPU

This section introduces how to use TLE-CPU. TLE-CPU is available on trition_3.3.x branch.

TLE-CPU allows a unified programming paradigm covering diverse edge-side CPU compute power. Extends TLE's philosophy of "layering hardware deep optimizations on top of `@triton.jit`" to CPUs. Targeting the fragmented CPU ecosystem for edge AI (Arm64 / RISC-V / x86 with multiple coexisting ISAs), it uses the same Triton programming model and integration framework to support diverse ISAs: programming model and correctness are shared across ISAs (plain Triton lands on any ISA via LLVM), while each ISA's high-performance implementation (intrinsic / C runtime) is contributed separately. Model code is routed to the corresponding ISA implementation through the operator library (FlagGems) vendor dispatch, eliminating the need to be aware of the specific ISA. The differences between CPU and GPU dictate that it requires an independent extension surface:

| Dimension | GPU (Reference) | CPU |
|---|---|---|
| Parallel Unit | SIMT / Block | OMP threads + SIMD vectors (two-level) |
| Memory Hierarchy | Explicit shared memory | Cache implicit management, optimization via tiling + weight reordering |
| Main Battlefield | Large batch throughput primarily | batch=1 decoding (edge-side), M=1 GEMV is the hotspot |
| Performance Key | Occupancy / memory coalescing | Instruction selection (i8mm/SVE2/BF16) + thread scheduling |

## Architecture Overview

```Plain Text
@triton.jit  (Triton programming model; can mix TLE extension ops and general operators)
                                │
                    ┌───────────┴────────────┐
            TLE-CPU Extension Ops        Triton General Ops
            (create_cpu_*)               (tl.load / tl.dot / …)
                    └───────────┬────────────┘
                                ▼
     FlagTree CPU backend  (compilation/dispatch layer; tle_<arch> plugins inject create_cpu_*)
                                ▼
     flagtree-cpu  (TritonCPU MLIR dialect + per-ISA C runtime / lowering)
                                ▼
                        LLVM  →  Target ISA instructions
              (See corresponding sub-pages for per-ISA lowering paths, e.g., Arm64)
```

- Extension operations are injected into the Triton IR builder as builder methods (`create_cpu_*`), lowered at compile time to the TritonCPU dialect, then mapped to the corresponding implementation per ISA (LLVM codegen or C runtime library calls). See corresponding [sub-page](/user_guide/arm64.md) for per-ISA lowering paths.

- The operator library layer is handled by FlagGems, which selects the CPU backend operator set by vendor (e.g., `arm`).

- Adding a new ISA = incremental contribution of C runtime + registering extension operations.

## Supported CPU architectures

- Arm64 is the first fully implemented CPU backend, running LLM inference end-to-end.

- RISC-V (RVV) / x86 (AVX-512) is still in planning, and will use the same MLIR and TLE path.

## Arm64 CPU related links

Below are the relevant links for TLE-CPU and Arm64:

- [Install FlagTree on ARM64 CPU](../getting_started/install-arm64-cpu.md)

- Github sites:
  - [FlagTree](https://github.com/flagos-ai/FlagTree) (`triton_v3.3.x` branch includes `cpu` backend)

  - [FlagTree-CPU](https://github.com/flagos-ai/flagtree-cpu)

  - [FlagGems](https://github.com/flagos-ai/FlagGems) (`5.3.0-rc2` version includes the `_arm` backend)

For more information on how to use TLE-CPU on Arm64, see the following sub-page:

```{toctree}
:maxdepth: 1

arm64.md
```