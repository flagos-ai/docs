# 厂商集成

芯片厂商通过在 `dispatch/backends/vendor/` 下添加后端目录进行集成：

```{code-block} python
cp -r sglang_fl/dispatch/backends/vendor/template/ \
      sglang_fl/dispatch/backends/vendor/my_chip/
```

<!-- CHANGED: v0.2.0 keeps this page as a generic integration contract rather than a complete vendor inventory or validation matrix. -->
厂商特定的框架选择、运行时镜像、验证状态、安装命令和适配流程维护在集中式页面：[集中式厂商 / 框架 / 镜像选择页面](https://flagos.io/resourcedownload?lang=en)。下面的通用契约并不意味着每个后端都支持所有算子或模型。

要集成新厂商，请实现下面所述的后端契约和注册逻辑。示例中的三个算子只是最小示例，并非 v0.2.0 的完整算子范围。

## 1. 后端类（my_chip.py）

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

## 2. 注册（register_ops.py）

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

## 3. 算子实现（impl/）

每个算子函数接收标准化参数（与 vllm-plugin-FL 相同）：

| 算子 | 签名 |
| :--- | :--- |
| `silu_and_mul` | `fn(obj, x: Tensor) -> Tensor` |
| `rms_norm` | `fn(obj, x: Tensor, residual: Optional[Tensor] = None) -> Tensor \| tuple[Tensor, Tensor]` |
| `rotary_embedding` | `fn(obj, query, key, cos, sin, position_ids, rotary_interleaved=False, inplace=True) -> tuple[Tensor, Tensor]` |

`obj` 参数提供对层属性的访问（`obj.weight`、`obj.variance_epsilon` 等）。这些属性名称在 SGLang 和 vLLM 之间完全相同，因此同一实现可同时用于两个框架。

## 厂商后端自动发现

插件在启动时扫描 `dispatch/backends/vendor/*/register_ops.py`。如果 `is_available()` 返回 True，该厂商的算子即被注册。无需修改其他文件。

<!-- NEW in v0.2.0 -->
如有需要，可选集成钩子可以添加平台特定行为：

- `patch.py` 可以应用公开后端或传输路径所需的框架补丁。
- `register_platform.py` 可以注册平台标识和运行时行为。
- `sglang_fl/dispatch/config/` 下的平台 YAML 可以为检测到的平台提供默认调度策略。

这些文件扩展了通用集成契约；它们不构成普遍的厂商支持或验证声明。详细适配流程仍维护在集中式页面：[集中式厂商 / 框架 / 镜像选择页面](https://flagos.io/resourcedownload?lang=en)。
<!-- END NEW -->
