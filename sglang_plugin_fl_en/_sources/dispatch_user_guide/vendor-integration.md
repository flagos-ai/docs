# Vendor integration

Chip vendors integrate by adding a backend directory under `dispatch/backends/vendor/`:

```{code-block} python
cp -r sglang_fl/dispatch/backends/vendor/template/ \
      sglang_fl/dispatch/backends/vendor/my_chip/
```

<!-- CHANGED: v0.2.0 keeps this page as a generic integration contract rather than a complete vendor inventory or validation matrix. -->
Vendor-specific framework selection, runtime images, validation status, installation commands, and adaptation procedures are maintained on the centralized page: [centralized vendor/framework/image-selection page](https://flagos.io/resourcedownload?lang=en). The generic contract below does not imply that every backend supports every operation or model.

To integrate with a new vendor, implement the backend contract and registration described below. The three operations in the example are a minimal illustration, not the complete v0.2.0 operation surface.

## 1. Backend class (my_chip.py)

```{code-block} python
from sglang_fl.dispatch.backends import Backend


class MyChipBackend(Backend):
    _available = None

    @property
    def name(self) -> str:
        return "my_chip"

    def is_available(self) -> bool:
        if MyChipBackend._available is None:
            try:
                import my_chip_sdk
                MyChipBackend._available = my_chip_sdk.device_count() > 0
            except ImportError:
                MyChipBackend._available = False
        return MyChipBackend._available

    def silu_and_mul(self, obj, x):
        from .impl.activation import silu_and_mul_my_chip
        return silu_and_mul_my_chip(obj, x)

    def rms_norm(self, obj, x, residual=None):
        from .impl.normalization import rms_norm_my_chip
        return rms_norm_my_chip(obj, x, residual)

    def rotary_embedding(self, obj, query, key, cos, sin, position_ids,
                         rotary_interleaved=False, inplace=True):
        from .impl.rotary import rotary_embedding_my_chip
        return rotary_embedding_my_chip(
            obj, query, key, cos, sin, position_ids, rotary_interleaved, inplace
        )
```

## 2. Registration (register_ops.py)

```{code-block} python
import functools
from sglang_fl.dispatch.types import OpImpl, BackendImplKind, BackendPriority


def _bind_is_available(fn, is_available_fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    wrapper._is_available = is_available_fn
    return wrapper


def register_builtins(registry) -> None:
    from .my_chip import MyChipBackend

    backend = MyChipBackend()
    is_avail = backend.is_available

    impls = [
        OpImpl(
            op_name="silu_and_mul",
            impl_id="vendor.my_chip",
            kind=BackendImplKind.VENDOR,
            fn=_bind_is_available(backend.silu_and_mul, is_avail),
            vendor="my_chip",
            priority=BackendPriority.VENDOR,
        ),
        OpImpl(
            op_name="rms_norm",
            impl_id="vendor.my_chip",
            kind=BackendImplKind.VENDOR,
            fn=_bind_is_available(backend.rms_norm, is_avail),
            vendor="my_chip",
            priority=BackendPriority.VENDOR,
        ),
        OpImpl(
            op_name="rotary_embedding",
            impl_id="vendor.my_chip",
            kind=BackendImplKind.VENDOR,
            fn=_bind_is_available(backend.rotary_embedding, is_avail),
            vendor="my_chip",
            priority=BackendPriority.VENDOR,
        ),
    ]
    registry.register_many(impls)
```

## 3. Operator implementations (impl/)

Each op function receives standardized arguments (same as vllm-plugin-FL):

| Op | Signature |
| :--- | :--- |
| `silu_and_mul` | `fn(obj, x: Tensor) -> Tensor` |
| `rms_norm` | `fn(obj, x: Tensor, residual: Optional[Tensor] = None) -> Tensor \| tuple[Tensor, Tensor]` |
| `rotary_embedding` | `fn(obj, query, key, cos, sin, position_ids, rotary_interleaved=False, inplace=True) -> tuple[Tensor, Tensor]` |

The `obj` parameter provides access to layer attributes (`obj.weight`, `obj.variance_epsilon`, etc.). These attribute names are identical between SGLang and vLLM, so the same impl works for both frameworks.

## Vendor backend auto-discovery

The plugin scans `dispatch/backends/vendor/*/register_ops.py` at startup. If `is_available()` returns True, the vendor's ops are registered. No other files need modification.

<!-- NEW in v0.2.0 -->
Optional integration hooks can add platform-specific behavior when needed:

- `patch.py` can apply framework patches required to expose a backend or transfer path.
- `register_platform.py` can register platform identity and runtime behavior.
- A platform YAML under `sglang_fl/dispatch/config/` can provide default dispatch policy for the detected platform.

These files extend the generic integration contract; they do not establish a universal vendor support or validation claim. Detailed adaptation procedures remain on the centralized page: [centralized vendor/framework/image-selection page](https://flagos.io/resourcedownload?lang=en).
<!-- END NEW -->
