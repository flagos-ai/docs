# Project structure

<!-- CHANGED: v0.2.0 moves platform YAML defaults under dispatch/config and expands vendor backends without maintaining a full support matrix here. -->
```{code-block} python
sglang_fl/
├── pyproject.toml                    # Package config + entry_points registration
└── sglang_fl/
    ├── __init__.py                   # Plugin entry: FlagGems + dispatch init + communicator hooks
    ├── platform.py                   # PlatformFL (device identity, memory, graph capture)
    ├── distributed/                  # Communication module (aligned with vllm-plugin-FL)
    │   ├── __init__.py
    │   ├── communicator.py           # CommunicatorFL (FlagCX / torch.distributed wrapper)
    │   └── device_communicators/
    │       └── flagcx.py             # FlagCX-specific communicator
    └── dispatch/                     # Op dispatch system (aligned with vllm-plugin-FL)
        ├── __init__.py               # Public API: call_op(), resolve_op()
        ├── types.py                  # OpImpl, BackendImplKind, BackendPriority
        ├── registry.py               # Thread-safe OpRegistry
        ├── policy.py                 # SelectionPolicy + env var / YAML config
        ├── manager.py                # OpManager: resolve, call, cache, fallback
        ├── builtin_ops.py            # Registration orchestrator
        ├── ops.py                    # FLBackendBase ABC (op signature definitions)
        ├── logger_manager.py         # Logging with SGLANG_FL_LOG_LEVEL
        ├── config/                   # Platform YAML defaults and dispatch configuration
        │   ├── ascend.yaml
        │   ├── gcu.yaml
        │   ├── hygon.yaml
        │   ├── iluvatar.yaml
        │   ├── kunlunxin.yaml
        │   ├── musa.yaml
        │   ├── nvidia.yaml
        │   └── tsingmicro.yaml
        ├── bridge/                   # SGLang ↔ dispatch parameter translation
        │   ├── __init__.py
        │   ├── silu_and_mul.py       # forward_cuda(self, x) → call_op("silu_and_mul", obj, x)
        │   ├── rms_norm.py           # Handles post_residual_addition
        │   └── rotary_embedding.py   # Extracts cos/sin from cos_sin_cache, handles offsets
        └── backends/
            ├── __init__.py           # Backend ABC
            ├── flaggems/             # DEFAULT backend (FlagGems Triton kernels)
            │   ├── flaggems.py
            │   ├── register_ops.py
            │   └── impl/             # activation.py, normalization.py, rotary.py
            ├── reference/            # REFERENCE backend (PyTorch native, always available)
            │   ├── reference.py
            │   ├── register_ops.py
            │   └── impl/             # activation.py, normalization.py, rotary.py
            └── vendor/               # VENDOR backends (auto-discovered)
                ├── <vendor>/         # Vendor-specific backend package
                └── template/         # Template for new vendors
```

<!-- NEW in v0.2.0 -->
Platform YAML files provide default dispatch policy for a detected platform. They are not a vendor validation matrix. Vendor-specific framework selection, runtime images, validation status, installation commands, and adaptation procedures are maintained on the centralized page: [centralized vendor/framework/image-selection page](https://flagos.io/resourcedownload?lang=en).
<!-- END NEW -->
