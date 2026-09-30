# Release Notes

<!-- NEW in v0.2.0 -->
## v0.2.0

This release expands sglang-plugin-FL's dispatch, platform configuration, and runtime configuration surface for `v0.1.0 → v0.2.0`.

- Added features
  - Expanded platform configuration through platform YAML defaults under `sglang_fl/dispatch/config/`.
  - Expanded dispatch policy controls, including global backend preference, per-operation backend ordering, vendor allow/deny filtering, strict mode, fallback behavior, and dispatch cache invalidation.
  - Empty-mode installation/runtime assembly boundary for vendor-specific runtime stacks. Empty mode is not a no-device mode; the target platform still provides vendor torch, drivers, firmware, device runtime, communication libraries, and uncovered operators.
  - Multinode and pipeline-parallel inference examples, Qwen3.6 MTP workflow coverage, and throughput benchmark infrastructure.

- Documentation scope

  - Vendor-specific framework selection, runtime images, validation status, installation commands, and adaptation procedures are centralized outside this English plugin documentation: [centralized vendor/framework/image-selection page](https://flagos.io/resourcedownload?lang=en).
  - This documentation keeps the generic plugin architecture, dispatch configuration, and workflow shape without maintaining a full vendor support or image matrix.
<!-- END NEW -->

## v0.1.0


Initial release of sglang-plugin-FL.

- Added features

  - Three-layer operator replacement architecture for SGLang:
    - **Layer 1**: ATen operator replacement via FlagGems Triton kernels
    - **Layer 2**: SGLang fused kernel dispatch (SiluAndMul, RMSNorm, RotaryEmbedding)
    - **Layer 3**: Distributed communication via CommunicatorFL (FlagCX / torch.distributed)
  - Non-intrusive plugin architecture using SGLang entry_points
  - Per-operator backend selection with automatic fallback
  - YAML configuration and environment variable control
  - Bridge layer decoupling framework-specific parameters from standardized op signatures
  - Vendor auto-discovery mechanism — same backends work for both sglang-plugin-FL and vllm-plugin-FL
  - Support for NVIDIA CUDA, Huawei Ascend, and extensible to other hardware
  - Verified models: Qwen3.6-27B, Qwen3.6-35B-A3B, Qwen2.5-14B-Instruct
  - Dispatch logging and ATen replacement logging for debugging
  - Precision bisection workflow for numerical debugging
