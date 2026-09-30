# Release Notes

This section includes the verl-FL release information.

## v0.2.0

- **Added Features**

  - Unified Platform Abstraction Layer — Strategy Pattern design under `verl/plugin/platform/` with `PlatformBase` ABC (16 device-agnostic methods) and concrete implementations for CUDA, MetaX (MACA), Ascend NPU, Moore Threads (MUSA), and CPU. Runtime platform selection via `VERL_PLATFORM` environment variable.

  - FlagOS Training Engine Integration — Pluggable backends via vllm-plugin-FL (rollout), TransformerEngine-FL (FSDP training), and Megatron-LM-FL (Megatron training) for multi-chip GRPO training.

  - MetaX Platform Support — Training validation on MetaX C500/C550 hardware via MACA software stack, with full environment configuration and performance tuning.

  - Moore Threads MUSA Platform Support — Heterogeneous CUDA+MUSA distributed training via FlagCX communication backend. NVIDIA nodes run actor/critic (FSDP), MUSA nodes run rollout (vLLM), with cross-device weight synchronization and device isolation via Ray runtime context.

  - Megatron-LM-FL Version Compatibility Fix — Correct parsing of `xxx+megatronxxx` version format used by Megatron-LM-FL (e.g., `0.1.0+megatron0.15.rc7`).

  - Docker Images — Pre-built Docker images for NVIDIA (`verl-fl:v0.2.0-rc2-nvidia`) and MetaX (`verl-fl:v0.2.0-rc2-metax`) platforms.

## v0.1.0

Initial release of verl-FL.

- **Added Features**

  - Unified Platform Abstraction Layer — Introduced the platform abstraction framework under `verl/plugin/platform/` with `PlatformBase` ABC for multi-chip support, decoupling business logic from hardware-specific calls.

  - FlagOS Backend Integration — Added vllm-plugin-FL as the rollout/inference backend and TransformerEngine-FL as the FSDP training backend, enabling FlagOS ecosystem integration for multi-chip GRPO training.

