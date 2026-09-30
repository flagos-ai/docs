# verl-FL Overview

verl-FL is a fork of verl designed to support diverse AI accelerators. It is built on top of [FlagOS](https://github.com/flagos-ai), a unified open-source AI system software stack, and integrates key components including the training engines [Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL) and [Transformer-Engine-FL](https://github.com/flagos-ai/TransformerEngine-FL), as well as the inference engine [vllm-plugin-FL](https://github.com/flagos-ai/vllm-plugin-FL).

While upstream verl is tightly coupled to CUDA, verl-FL introduces a platform abstraction layer and integrates FlagOS ecosystem components to enable heterogeneous distributed training without modifying upstream business logic.


## Architecture

### Platform Abstraction Layer

verl-FL introduces a Strategy Pattern platform abstraction under `verl/plugin/platform/`:

```
verl/plugin/platform/
├── __init__.py
├── platform_base.py        # PlatformBase ABC (16 device-agnostic methods)
├── platform_cuda.py        # CUDA + FlagCX auto-detection
├── platform_metax.py       # MetaX MACA
├── platform_npu.py         # Ascend NPU
├── platform_musa.py        # Moore Threads MUSA + FlagCX
├── platform_cpu.py         # CPU fallback
├── platform_manager.py     # Singleton, VERL_PLATFORM env var override
└── README.md               # Guide for adding new backends
```

The `PlatformBase` abstract base class defines 16 device-agnostic methods covering device allocation, memory management, stream operations, and distributed initialization. All scattered `torch.cuda.*` calls in business logic are replaced with the platform API. Runtime platform selection is controlled via the `VERL_PLATFORM` environment variable.

### Engine Plugin Architecture

```
verl/plugin/engine/
├── __init__.py             # Engine registry
├── fsdp_fl/
│   ├── __init__.py
│   └── transformer_impl.py # TE-FL based FSDP engine
└── megatron_fl/
    └── __init__.py         # Megatron-LM-FL based engine
```

### Heterogeneous Training Architecture

[FlagCX](https://github.com/flagos-ai/FlagCX) serves as the unified cross-vendor communication backend, replacing NCCL for heterogeneous setups. This enables weight synchronization and device isolation across CUDA and MUSA nodes via Ray runtime context:

```
┌─────────────────────────┐              ┌─────────────────────────┐
│  NVIDIA Nodes           │              │  MUSA Nodes             │
│  (Actor / Critic)       │◄── FlagCX ──►│  (Rollout / vLLM)       │
│  FSDP + NCCL            │              │  torch_musa             │
└─────────────────────────┘              └─────────────────────────┘
```
