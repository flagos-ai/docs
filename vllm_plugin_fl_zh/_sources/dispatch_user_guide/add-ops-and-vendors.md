# 添加新算子和厂商后端

## 添加新算子

添加新算子时，需要修改以下文件：

- `backends/flaggems/impl/*.py` - 添加 FlagGems 实现
- `backends/flaggems/flaggems.py` - 向后端类添加方法
- `backends/flaggems/register_ops.py` - 注册 OpImpl
- `backends/reference/impl/*.py` - 添加 PyTorch 实现（如适用）
- `backends/reference/reference.py` - 向后端类添加方法
- `backends/reference/register_ops.py` - 注册 OpImpl
- `backends/vendor/<vendor>/impl/*.py` - 添加厂商特定实现（可选）
- `backends/vendor/<vendor>/<vendor>.py` - 向厂商后端类添加方法
- `backends/vendor/<vendor>/register_ops.py` - 注册厂商 OpImpl
- `ops.py` - 添加抽象方法声明

**注意：**并非所有算子都需要参考实现。例如，`attention_backend` 只有 FlagGems 和厂商实现，因为它返回的是后端类路径而非执行计算。

### 添加厂商后端

调度系统支持三种方式集成厂商后端：

1. **内置厂商后端** - 位于 `backends/vendor/`（推荐用于核心厂商）
2. **外部插件包** - 作为独立的 Python 包分发
3. **基于环境的插件** - 通过 `VLLM_FL_PLUGIN_MODULES` 加载

#### 选项 1：内置厂商后端

目录结构：

```
backends/vendor/<vendor_name>/
├── __init__.py
├── <vendor_name>.py        # 后端类
├── register_ops.py         # 注册函数
└── impl/                   # 算子实现
    ├── __init__.py
    ├── activation.py
    ├── normalization.py
    ├── rotary.py
    └── attention.py        # （可选）厂商特定注意力后端
```

**步骤 1：创建后端类**（`<vendor_name>.py`）：

```python
from ...base import Backend

class <VendorName>Backend(Backend):
    _available = None

    @property
    def name(self) -> str:
        return "<vendor_name>"

    @property
    def vendor(self) -> str:
        return "<vendor_name>"  # 厂商后端必需

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

**步骤 2：创建注册模块**（`register_ops.py`）：

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

**步骤 3：在 builtin_ops.py 中注册**：

```python
try:
    from .backends.vendor.<vendor_name>.register_ops import register_builtins as register_<vendor>
    register_<vendor>(registry)
except Exception as e:
    logger.debug(f"<Vendor> operators not available: {e}")
```

#### 选项 2：外部插件包

创建带有入口点的独立包：

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

安装并使用：

```bash
pip install vllm-plugin-<vendor>
# 插件通过入口点自动发现
```

#### 选项 3：基于环境的插件

```bash
export VLLM_FL_PLUGIN_MODULES=my_custom_backend.register_ops
```

模块应提供 `register_builtins(registry)` 函数。

#### 优先级级别

使用 `types.py` 中的常量：

- `BackendPriority.DEFAULT`（150）- FlagGems
- `BackendPriority.VENDOR`（100）- 厂商后端
- `BackendPriority.REFERENCE`（50）- PyTorch

#### 测试后端

```python
from vllm_fl.dispatch import get_default_manager

manager = get_default_manager()
manager.ensure_initialized()

# 检查注册
snap = manager.registry.snapshot()
for op_name, impls in snap.impls_by_op.items():
    for impl in impls:
        if impl.vendor == "<vendor_name>":
            print(f"{op_name}: {impl.impl_id}, available={impl.is_available()}")
```

启用调试输出：

```bash
export VLLM_FL_LOG_LEVEL=DEBUG
```

#### 厂商后端检查清单

- [ ] 后端类继承自 `Backend`
- [ ] `vendor` 属性返回厂商名称（不为 None）
- [ ] `is_available()` 检查硬件/库可用性
- [ ] `register_ops.py` 使用 `BackendImplKind.VENDOR`
- [ ] `impl_id` 遵循格式：`vendor.<vendor_name>`
- [ ] 优先级设置为 `BackendPriority.VENDOR`（100）
- [ ] 缺失依赖的错误处理
- [ ] （可选）`attention_backend()` 返回厂商特定注意力后端类路径

#### 当前厂商后端

| 厂商 | 设备 | 可用性探测 | 注意力后端 |
|--------|--------|--------------------|-------------------|
| `cuda` | NVIDIA GPU | FlagGems 厂商探测（排除 CUDA 类设备） | vLLM 原生（`FLASH_ATTN`、`FLASHMLA`、`FLASHMLA_SPARSE`） |
| `ascend` | 华为 Ascend NPU | `torch.npu.is_available()` | `AscendAttentionBackend`、`AscendMLABackend` |
| `gcu` | 燧原 GCU | `torch.gcu.is_available()` | `AttentionGCUBackend` |
| `iluvatar` | 天数智芯 GPU | vLLM 平台厂商 | vLLM 原生（`FLASH_ATTN`、`FLASHMLA`、`TRITON_ATTN`） |
| `kunlunxin` | 昆仑芯 XPU | `import torch_xmlir` + `torch.cuda.is_available()` | `KunlunxinAttentionBackend` |
| `metax` | 沐曦（MACA） | `torch.cuda.is_available()` | vLLM 原生，配合 FlagGems 时为 `TRITON_ATTN` |
| `musa` | 摩尔线程（MUSA） | `torch.musa.is_available()` | `TRITON_ATTN`、`TRITON_MLA` |
| `sunrise` | 曦望 PPU | `torch.ptpu.is_available()` | `AttentionFLBackend` |
| `thead` | T-Head PPU | `PPU_SDK` 环境变量 | `FLASH_ATTN`（FA3 wheel） |
| `txda` | 清微智能 TXDA | `torch.txda.is_available()` | `AttentionFLBackend`、`MLAFLBackend`、`TritonAttentionBackend` |

后端上报的厂商名是 `allow_vendors`、`deny_vendors` 以及 `vendor:<name>` 令牌所匹配的值，它不一定等于目录名：沐曦后端的厂商名是 `maca`，燧原后端是 `gcu`，清微智能后端是 `txda`。

参见 `backends/vendor/template/` 获取创建新厂商后端的模板。

## 多进程安全

OpManager 支持多进程环境：

- 使用 `os.register_at_fork()` 在 fork 后自动重置状态
- PID 检测确保每个进程独立初始化
- 线程安全的注册表和缓存操作
