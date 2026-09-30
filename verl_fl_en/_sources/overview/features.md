# Features

## Unified Platform Abstraction Layer

Strategy Pattern design under `verl/plugin/platform/` decouples business logic from hardware-specific calls, enabling support for CUDA, Ascend NPU, MetaX (MACA), Moore Threads (MUSA), CPU, and future accelerators.

- **PlatformBase ABC** — 16 device-agnostic methods covering device allocation, memory management, stream operations, and distributed initialization
- **PlatformManager** — Singleton with `VERL_PLATFORM` environment variable override for runtime platform selection
- **Hardware-agnostic business logic** — All `torch.cuda.*` calls replaced with platform API

## FlagOS Training Engine Integration

Pluggable backends via FlagOS ecosystem components for multi-chip GRPO training:

- **vllm-plugin-FL** — vLLM-based inference/rollout engine with multi-vendor dispatch
- **TransformerEngine-FL** — FSDP training engine with FP8 support and multi-backend operator dispatch
- **Megatron-LM-FL** — Megatron-based training engine with platform abstraction for large-scale distributed training

## Multi-Vendor Hardware Support

verl-FL supports NVIDIA, Huawei Ascend, MetaX, Moore Threads, and CPU platforms. See [Supported Hardwares](../getting_started/requirements.md#supported-hardwares) for details.

## Heterogeneous Distributed Training

Cross-vendor collective communication via FlagCX enables heterogeneous training across NVIDIA GPU and Moore Threads MUSA nodes. One node runs actor/critic (NVIDIA, FSDP), the other runs rollout (Moore Threads MUSA, vLLM), with weight synchronization and device isolation managed through Ray runtime context.