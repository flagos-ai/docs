# Features

FlagTree includes the following main features:

- **Multi-backend support**
  FlagTree supports a wide range of hardware platforms and has been extensively tested across different hardware configurations. For more information, see [Supported hardware platforms](/getting_started/requirements.md#supported-hardware-platforms).
- **Three levels of compiler languages**
  FlagTree provides three levels of compiler languages tailored for different users:
  - TLE-Lite:
    - Design philosophy: Write once, run everywhere.
    - Core concept: By introducing high-level semantic hints rather than mandatory constraints, guide the compiler to perform heuristic optimization. It emphasizes backward compatibility, allowing developers to achieve cross-platform performance improvements with minimal code intrusiveness without disrupting the original Triton programming paradigm.
  - TLE-Struct:
    - Design philosophy: Architectural perception, fine tuning.
    - Core concept: Based on the hardware topological features, the backend is divided into clusters such as GPGPU and DSA, exposing a universal hierarchical parallel and storage structure. It allows developers to explicitly define the structured mapping relationship between computing and data (such as Warp Group control, pipeline orchestration), decoupling algorithmic logic from the physical implementation of specific hardware at the abstract level.
  - TLE-Raw:
    - Design philosophy: Native transmission, ultimate control.
    - Core concept: Break the abstract boundaries of DSL and support inline native code from vendors. It enables the direct generation of target instructions through the vendor's private compilation pipeline, bypassing the intermediate conversion overhead of general-purpose compilers and granting expert-level users absolute control over instruction scheduling, register allocation, and underlying synchronization primitives.
- **TLE-CPU**：TLE-CPU extends TLE's philosophy of layering hardware optimizations on top of `@triton.jit` to CPUs, providing a unified Triton programming model across Arm64, RISC-V, and x86 ISAs for edge-side inference. Correctness is shared across ISAs via plain Triton + LLVM, while per-ISA high-performance implementations are contributed separately and routed through FlagGems vendor dispatch. Arm64 is the first fully implemented backend with 6 TLE extension operations covering decode hotspots (GEMV, normalization, activation, attention), featuring self-managed OMP thread parallelism and tuning for significant decode performance gains.
- **FLIR**:
  FlagTree Linalg Intermediate Representation, which is a multi-backend unified intermediate layer that serves as the central hub for lowering TTIR Ext Triton extension intermediate representations (for example, Hints, Ops, and TLE) to hardware-specific dialect.
- **Hints**:
  The topmost-level compiler language, tailored for beginners, providing lightweight performance optimizations without altering program semantics or underlying hardware behavior. Hints is fully backward-compatible with native Triton code.