# Features

## Hardware-Agnostic Platform Abstraction

Through the unified `PlatformBase` interface, hardware-specific logic for device management, collective communication, memory management, profiling, and rollout environment variables is abstracted into standard methods. A vendor only needs to implement one platform class and register it with `@PlatformRegistry.register` to integrate with verl.

For CUDA-compatible hardware such as MetaX and Iluvatar, `torch.cuda.is_available()` returns True on multiple chips. The platform layer introduces a `vendor_name` identifier and SMI-based hardware detection (for example `mx-smi` for MetaX and `ixsmi` for Iluvatar) to distinguish the actual hardware during first-time auto-detection and avoid mismatching the NVIDIA engine.

## Stage-Scoped Environment Manager (FLEnvManager)

RL post-training has different operator-acceleration and communication requirements in the training stage and the rollout stage. The environment manager manages FlagGems and FlagCX configuration per stage:

- **FlagGems operator acceleration** — supports independent operator allowlists / blocklists per stage to control which operators take the FlagGems accelerated path, and records operator hits for tuning and troubleshooting.
- **FlagCX unified communication** — the `USE_FLAGCX` switch enables the FlagCX heterogeneous communication library in multi-chip environments; when disabled, it falls back to the device-native backend (such as NCCL).

## Dedicated FlagOS Engines for FSDP and Megatron

FlagOS-specific engines are derived from verl's native FSDP and Megatron engines, covering the key roles in RL training:

- `FSDPFlagOSEngineWithLMHead` / `FSDPFlagOSEngineWithValueHead` — support fsdp / fsdp2 and cover the policy and value models.
- `MegatronFlagOSEngineWithLMHead` — supports large-scale Megatron parallel training.

The engines automatically inject FlagGems operator acceleration during the `initialize` stage based on the environment configuration, fully transparent to the upper-layer RL algorithm.

## Zero-Configuration Plugin Discovery

The plugin is discovered by verl through Python's `entry_points` mechanism. After `pip install`, verl imports the package registered under the `verl.plugins` group, which triggers registration of all platforms and engines. No changes to the verl main framework are required.
