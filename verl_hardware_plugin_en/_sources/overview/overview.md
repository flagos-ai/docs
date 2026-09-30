# verl-hardware-plugin Overview

verl-hardware-plugin provides **reference implementations** of multi-chip hardware platforms and training engines for [verl](https://github.com/verl-project/verl), the RL post-training framework. It supplies platform abstractions and training engine extensions for non-CUDA accelerators, and serves as a template for hardware vendors to adapt verl to their own devices through a unified plugin interface.

The repository is jointly developed by the ByteDance verl team and the [FlagOS](https://github.com/flagos-ai) community.

```{note}
The platforms and engines in this repository are reference implementations. Full production support and maintenance require collaboration with the respective hardware vendors.
```

## Relationship to verl and verl-FL

- **verl** — the upstream RL post-training framework (HybridFlow). The platform/engine registry mechanism is implemented in [verl#6086](https://github.com/verl-project/verl/pull/6086).
- **verl-hardware-plugin** — an out-of-tree plugin discovered by verl through the `verl.plugins` entry-points group. No manual configuration in verl is required after `pip install`.
- **verl-FL** — FlagOS's fork of verl, which uses its own in-tree platform abstraction layer. verl-hardware-plugin targets the plugin mechanism of upstream verl.

## Architecture

```
verl (main framework)
    |
    +-- entry_points: verl.plugins -> verl_hardware_plugin
            |
            +-- platforms/  -> @PlatformRegistry.register(platform="vendor_name")
            |     +-- PlatformFlagOS   (device=cuda, vendor=flagos)
            |     +-- PlatformMetaX    (device=cuda, vendor=metax)
            |     +-- PlatformCUDAIluvatar (device=cuda, vendor=iluvatar)
            |     +-- PlatformMLU      (device=mlu,  vendor=cambricon)
            |     +-- PlatformXPU      (device=xpu,  vendor=intel)
            |     +-- PlatformENFLAME  (device=enflame)
            |
            +-- engines/    -> @EngineRegistry.register(device=..., vendor=...)
            |     +-- fsdp_flagos.py / megatron_flagos.py
            |     +-- fsdp_metax.py  / megatron_metax.py
            |     +-- fsdp_mlu.py    / megatron_mlu.py
            |     +-- fsdp_iluvatar.py / megatron_iluvatar.py
            |     +-- fsdp_enflame.py / megatron_enflame.py
            |     +-- fsdp_xpu.py    / megatron_xpu.py
            |
            +-- utils/      -> FLEnvManager (stage-scoped FlagGems / FlagCX config)
```

The plugin integrates with verl through two registries:

1. **PlatformRegistry** — registers hardware platform abstractions (device management, communication, memory).
2. **EngineRegistry** — registers training engines (hardware-specific variants of FSDP/Megatron).

Engine lookup uses a two-level key `(device, vendor)`:

1. Exact match `(device, vendor)` — a vendor-specific engine;
2. Fallback to a device-only key — the base engine for that device type;
3. For CUDA-compatible devices, fallback to the base CUDA engine.

See [Features](features.md) for details on the platform abstraction, the stage-scoped environment manager, and the dedicated FlagOS engines.

## Supported Hardware

| Platform | Device | Communication | Status |
|----------|--------|---------------|--------|
| FlagOS / NVIDIA | NVIDIA GPU (verified) | FlagCX / NCCL | Supported |
| MetaX | MetaX GPUs (CUDA-compatible) | MCCL | Supported |
| Iluvatar | BI-V150 (CUDA-compatible) | IXCCL | Supported |
| Cambricon MLU | MLU | CNCL | Reference implementation (tracked in [flagos-ai/community#73](https://github.com/flagos-ai/community/issues/73)) |
| Enflame GCU | GCU | ECCL / FlagCX | Example (requires vendor support) |
| Intel XPU | Data Center GPU Max / Arc | xccl (oneCCL) | Example (requires vendor support) |
| Huawei Ascend | Ascend 910B | HCCL | Built-in (verl core) |
