# Add new operators and vendor backends

## Add new operators

When adding a new operator, modify these files:

- `backends/flaggems/impl/*.py` - Add FlagGems implementation
- `backends/flaggems/flaggems.py` - Add method to backend class
- `backends/flaggems/register_ops.py` - Register OpImpl
- `backends/reference/impl/*.py` - Add PyTorch implementation (if applicable)
- `backends/reference/reference.py` - Add method to backend class
- `backends/reference/register_ops.py` - Register OpImpl
- `backends/vendor/<vendor>/impl/*.py` - Add vendor-specific implementation (optional)
- `backends/vendor/<vendor>/<vendor>.py` - Add method to vendor backend class
- `backends/vendor/<vendor>/register_ops.py` - Register vendor OpImpl
- `ops.py` - Add abstract method declaration

**Note:** Not all operators require a reference implementation. For example, `attention_backend` only has FlagGems and vendor implementations since it returns a backend class path rather than executing a computation.

### Add vendor backends

The dispatch system supports three ways to integrate vendor backends:

1. **Built-in vendor backends** - Located in `backends/vendor/` (recommended for core vendors)
2. **External plugin packages** - Distributed as separate Python packages
3. **Environment-based plugins** - Loaded via `VLLM_FL_PLUGIN_MODULES`

#### Option 1: Built-in vendor backend

Directory structure:

```
backends/vendor/<vendor_name>/
├── __init__.py
├── <vendor_name>.py        # Backend class
├── register_ops.py         # Registration function
└── impl/                   # Operator implementations
    ├── __init__.py
    ├── activation.py
    ├── normalization.py
    ├── rotary.py
    └── attention.py        # (optional) Vendor-specific attention backend
```

**Step 1: Create backend class** (`<vendor_name>.py`):

```python
from ...base import Backend

class <VendorName>Backend(Backend):
    _available = None

    @property
    def name(self) -> str:
        return "<vendor_name>"

    @property
    def vendor(self) -> str:
        return "<vendor_name>"  # Required for vendor backends

    def is_available(self) -> bool:
        if <VendorName>Backend._available is None:
            try:
                import <vendor_library>
                <VendorName>Backend._available = True
            except ImportError:
                <VendorName>Backend._available = False
        return <VendorName>Backend._available

    def silu_and_mul(self, x):
        from .impl.activation import silu_and_mul_<vendor>
        return silu_and_mul_<vendor>(x)
```

**Step 2: Create registration module** (`register_ops.py`):

```python
from ....types import OpImpl, BackendImplKind, BackendPriority

def register_builtins(registry):
    from .<vendor_name> import <VendorName>Backend
    backend = <VendorName>Backend()

    impls = [
        OpImpl(
            op_name="silu_and_mul",
            impl_id="vendor.<vendor_name>",
            kind=BackendImplKind.VENDOR,
            fn=backend.silu_and_mul,
            vendor="<vendor_name>",
            priority=BackendPriority.VENDOR,  # 100
        ),
    ]
    registry.register_many(impls)
```

**Step 3: Register in builtin_ops.py**:

```python
try:
    from .backends.vendor.<vendor_name>.register_ops import register_builtins as register_<vendor>
    register_<vendor>(registry)
except Exception as e:
    logger.debug(f"<Vendor> operators not available: {e}")
```

#### Option 2: External plugin package

Create a separate package with entry points:

```python
# setup.py
setup(
    name="vllm-plugin-<vendor>",
    entry_points={
        "vllm_fl.plugin": [
            "<vendor> = vllm_fl_<vendor>.register_ops:register_builtins",
        ],
    },
)
```

Install and use:

```bash
pip install vllm-plugin-<vendor>
# Plugin auto-discovered via entry points
```

#### Option 3: Environment-based plugin

```bash
export VLLM_FL_PLUGIN_MODULES=my_custom_backend.register_ops
```

The module should provide a `register_builtins(registry)` function.

#### Priority levels

Use constants from `types.py`:

- `BackendPriority.DEFAULT` (150) - FlagGems
- `BackendPriority.VENDOR` (100) - Vendor backends
- `BackendPriority.REFERENCE` (50) - PyTorch

#### Test your backend

```python
from vllm_fl.dispatch import get_default_manager

manager = get_default_manager()
manager.ensure_initialized()

# Check registration
snap = manager.registry.snapshot()
for op_name, impls in snap.impls_by_op.items():
    for impl in impls:
        if impl.vendor == "<vendor_name>":
            print(f"{op_name}: {impl.impl_id}, available={impl.is_available()}")
```

Enable debug output:

```bash
export VLLM_FL_LOG_LEVEL=DEBUG
```

#### Vendor backend checklist

- [ ] Backend class inherits from `Backend`
- [ ] `vendor` property returns vendor name (not None)
- [ ] `is_available()` checks hardware/library availability
- [ ] `register_ops.py` uses `BackendImplKind.VENDOR`
- [ ] `impl_id` follows format: `vendor.<vendor_name>`
- [ ] Priority set to `BackendPriority.VENDOR` (100)
- [ ] Error handling for missing dependencies
- [ ] (Optional) `attention_backend()` returns vendor-specific attention backend class path

#### Current vendor backends

| Vendor | Device | Availability probe | Attention backend |
|--------|--------|--------------------|-------------------|
| `cuda` | NVIDIA GPU | FlagGems vendor detection (excludes CUDA-like devices) | vLLM native (`FLASH_ATTN`, `FLASHMLA`, `FLASHMLA_SPARSE`) |
| `ascend` | Huawei Ascend NPU | `torch.npu.is_available()` | `AscendAttentionBackend`, `AscendMLABackend` |
| `gcu` | Enflame GCU | `torch.gcu.is_available()` | `AttentionGCUBackend` |
| `iluvatar` | Iluvatar GPU | vLLM platform vendor | vLLM native (`FLASH_ATTN`, `FLASHMLA`, `TRITON_ATTN`) |
| `kunlunxin` | Kunlunxin XPU | `import torch_xmlir` + `torch.cuda.is_available()` | `KunlunxinAttentionBackend` |
| `metax` | MetaX (MACA) | `torch.cuda.is_available()` | vLLM native, `TRITON_ATTN` with FlagGems |
| `musa` | Moore Threads (MUSA) | `torch.musa.is_available()` | `TRITON_ATTN`, `TRITON_MLA` |
| `sunrise` | Sunrise PPU | `torch.ptpu.is_available()` | `AttentionFLBackend` |
| `thead` | T-Head PPU | `PPU_SDK` environment variable | `FLASH_ATTN` (FA3 wheel) |
| `txda` | Tsingmicro TXDA | `torch.txda.is_available()` | `AttentionFLBackend`, `MLAFLBackend`, `TritonAttentionBackend` |

The vendor name reported by a backend is what `allow_vendors`, `deny_vendors`, and the `vendor:<name>` tokens match. It is not always the directory name: the MetaX backend is `maca`, the Enflame backend is `gcu`, and the Tsingmicro backend is `txda`.

See `backends/vendor/template/` for a template to create new vendor backends.

## Multi-process safety

OpManager supports multi-process environments:

- Uses `os.register_at_fork()` to automatically reset state after fork
- PID detection ensures independent initialization per process
- Thread-safe registry and cache operations
