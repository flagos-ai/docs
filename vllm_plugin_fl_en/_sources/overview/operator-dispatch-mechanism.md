# Operator dispatch mechanism

This directory implements the operator dispatch mechanism for vllm-plugin-FL, providing a flexible operator dispatch system that selects between different backend implementations (FlagGems, PyTorch, vendor-specific) based on availability and policy configuration.

## Directory structure

```
dispatch/
├── __init__.py              # Module entry point, exports public API
├── types.py                 # Core type definitions (OpImpl, BackendImplKind)
├── registry.py              # Thread-safe operator registry
├── policy.py                # Selection policy management
├── manager.py               # Core dispatch manager
├── builtin_ops.py           # Built-in operator registration
├── ops.py                   # Backend base interface
├── discovery.py             # Plugin discovery mechanism
├── logger_manager.py        # Centralized logging configuration
├── config/                  # Platform-specific configurations
│   ├── __init__.py          # Config loader module
│   ├── ascend.yaml          # Ascend NPU default configuration
│   └── cuda.yaml            # CUDA default configuration
└── backends/                # Backend implementations
    ├── base.py              # Backend abstract base class
    ├── flaggems/            # FlagGems backend (DEFAULT, priority 150)
    │   ├── flaggems.py      # Backend class
    │   ├── register_ops.py  # Registration function
    │   └── impl/            # Operator implementations
    │       ├── activation.py
    │       ├── normalization.py
    │       ├── rotary.py
    │       ├── attention.py       # AttentionFLBackend, AttentionFLImpl
    │       ├── mla.py             # MLAFLBackend, MLAFLImpl
    │       └── custom_attention.py # Attention backend registration
    ├── reference/           # Reference backend (PyTorch, priority 50)
    └── vendor/              # Vendor-specific backends (priority 100)
        ├── cuda/            # NVIDIA CUDA backend
        │   └── impl/
        │       ├── activation.py
        │       ├── normalization.py
        │       └── rotary.py
        └── ascend/          # Huawei Ascend NPU backend
            └── impl/
                ├── activation.py
                ├── normalization.py
                ├── rotary.py
                ├── attention.py       # AscendAttentionBackend
                └── attention_mask.py  # Attention mask utilities
```

## Core concepts

### 1. Backend implementation kind (BackendImplKind)

`types.py` includes backend implementation kinds as follows:

- **DEFAULT**: Default implementation (FlagGems), priority 150
- **VENDOR**: Vendor-specific implementation, priority 100
- **REFERENCE**: Reference implementation (PyTorch native), priority 50

### 2. Operator implementation (OpImpl)

`types.py` includes operator implementation，each operator implementation contains:

- `op_name`: Operator name (e.g., "silu_and_mul", "rms_norm")
- `impl_id`: Unique implementation identifier (e.g., "default.flagos")
- `kind`: Implementation type
- `fn`: Actual implementation function
- `vendor`: Vendor name (required for VENDOR type)
- `priority`: Selection priority (higher value = preferred)

### 3. Selection policy

`policy.py` includes selection policy.

Policy controls operator implementation selection:

- `prefer`: Preferred implementation type
- `strict`: Strict mode, whether to raise error when primary implementation fails
- `per_op_order`: Custom selection order for each operator
- `deny_vendors`: List of denied vendors
- `allow_vendors`: Whitelist of allowed vendors

## Architecture overview

### Dispatch flow diagram

1. **Cache Check**: Check if dispatch cache hits
2. **Get Implementations**: Retrieve all registered implementations from registry
3. **Vendor Filtering**: Filter by policy's allow/deny lists
4. **Availability Check**: Call `is_available()` to check if implementation is available
5. **Priority Sorting**: Select best implementation based on per-op order or default order
6. **Cache Result**: Cache selection result to speed up subsequent calls

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Code                                │
│                 call_op("rms_norm", x, ...)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       OpManager                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. Check Cache                                            │  │
│  │ 2. Get Policy (from env or context)                      │  │
│  │ 3. Query Registry for all implementations                │  │
│  │ 4. Filter by vendor allow/deny list                      │  │
│  │ 5. Check availability (is_available())                   │  │
│  │ 6. Sort by priority & selection order                    │  │
│  │ 7. Cache & return selected implementation                │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        OpRegistry                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   FlagGems   │  │    Vendor    │  │  Reference   │         │
│  │ Priority: 150│  │ Priority: 100│  │ Priority: 50 │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Priority selection flow


```
┌─────────────────────────────────────────────────────────────────┐
│                     VLLM_FL_PREFER=flagos                       │
│                    (Default Behavior)                            │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────┴────────────────────┐
        │                                          │
        ▼                                          ▼
┌──────────────┐  Available?  ┌──────────────┐  Available?
│   FlagGems   │─────No──────▶│    Vendor    │─────No──────▶
│ Priority: 150│              │ Priority: 100│
└──────────────┘              └──────────────┘
        │                              │
       Yes                            Yes
        │                              │
        ▼                              ▼
    ✓ Selected                    ✓ Selected

                                                  ┌──────────────┐
                                                  │  Reference   │
                                                  │ Priority: 50 │
                                                  └──────────────┘
                                                         │
                                                        Yes
                                                         │
                                                         ▼
                                                    ✓ Selected
```

### Plugin integration points

```
┌─────────────────────────────────────────────────────────────────┐
│                    Plugin Discovery                              │
│                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │   Built-in     │  │  Entry Points  │  │  Environment   │   │
│  │   backends/    │  │  (setuptools)  │  │  PLUGIN_MODULES│   │
│  │   vendor/      │  │                │  │                │   │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘   │
│           │                   │                    │            │
│           └───────────────────┴────────────────────┘            │
│                               │                                  │
└───────────────────────────────┼──────────────────────────────────┘
                                │
                                ▼
                        ┌───────────────┐
                        │   Registry    │
                        │  register()   │
                        └───────────────┘
```
