# TE-FL 自定义后端示例

本文档介绍添加自定义后端的两种方式。

## 两种方式

| 方式 | 适用场景 | 示例文件 |
|------|----------|----------|
| **In-tree** | 开源贡献，直接集成 | `example_intree.py` |
| **Out-of-tree** | 闭源/第三方插件，独立包 | `example_outtree.py` |

## 快速开始

```bash
cd transformer_engine/plugin/examples

# In-tree 方式
python example_intree.py

# Out-of-tree 方式
python example_outtree.py
```

## In-tree 方式（3 步）

```python
from transformer_engine.plugin.core import (
    OpRegistry, OpManager, OpImpl, BackendImplKind
)

# 1. 定义算子实现
def my_rmsnorm(input, weight, eps=1e-5, **kwargs):
    variance = input.pow(2).mean(-1, keepdim=True)
    return input * torch.rsqrt(variance + eps) * weight, torch.rsqrt(variance + eps)

# 2. 注册到注册表
registry = OpRegistry()
registry.register_impl(OpImpl(
    op_name="rmsnorm_fwd",
    impl_id="vendor.mybackend",
    kind=BackendImplKind.VENDOR,
    vendor="mybackend",
    fn=my_rmsnorm,
    priority=200,
))

# 3. 通过管理器调用
manager = OpManager(registry)
output, rsigma = manager.call("rmsnorm_fwd", input, weight)
```

## Out-of-tree 方式（插件包）

### 插件包结构

```
my_vendor_plugin/
├── __init__.py      # 包含 register(registry) 函数
└── setup.py         # 或 pyproject.toml
```

### \\_\\_init\\_\\_.py

```python
from transformer_engine.plugin.core import OpImpl, BackendImplKind

def my_rmsnorm(input, weight, eps=1e-5, **kwargs):
    # 您的实现
    ...

def register(registry):
    """由 TE-FL 自动调用"""
    registry.register_impl(OpImpl(
        op_name="rmsnorm_fwd",
        impl_id="vendor.myvendor",
        kind=BackendImplKind.VENDOR,
        vendor="myvendor",
        fn=my_rmsnorm,
        priority=200,
    ))
```

### 加载方式

```bash
# 方式 1：环境变量
export TE_FL_PLUGIN_MODULES=my_vendor_plugin
python your_script.py

# 方式 2：pip install（需要配置 entry_points）
pip install my-vendor-plugin
python your_script.py
```

## 环境变量

### 后端选择

| 变量 | 描述 | 值 | 默认值 |
|------|------|-----|--------|
| `TE_FL_PREFER` | 首选后端类型（最高优先级） | `flagos` / `vendor` / `reference` | `flagos` |
| `TE_FL_PREFER_VENDOR` | 优先使用供应商后端（旧版，优先级低于 `TE_FL_PREFER`） | `1` = 优先供应商，`0` = 优先 flagos | `0` |
| `TE_FL_STRICT` | 严格模式 — 如果首选实现失败则报错，不回退 | `1` = 严格，`0` = 允许回退 | `0` |

### 供应商过滤

| 变量 | 描述 | 示例 |
|------|------|------|
| `TE_FL_ALLOW_VENDORS` | 允许的供应商白名单（逗号分隔） | `nvidia,amd` |
| `TE_FL_DENY_VENDORS` | 拒绝的供应商黑名单（逗号分隔） | `vendor_a,vendor_b` |

### 逐算子配置

| 变量 | 描述 | 示例 |
|------|------|------|
| `TE_FL_PER_OP` | 逐算子后端排序 | `rmsnorm_fwd=vendor:acme\|flagos;rope_fwd=flagos\|reference` |

格式：`op_name=backend1|backend2;op_name2=backend3|backend4`

### 插件发现

| 变量 | 描述 | 示例 |
|------|------|------|
| `TE_FL_PLUGIN_MODULES` | 要加载的插件模块（逗号分隔） | `my_plugin,another_plugin` |

### 构建配置

| 变量 | 描述 | 值 | 默认值 |
|------|------|-----|--------|
| `TE_FL_SKIP_CUDA` | 跳过 CUDA 后端（构建时和运行时） | `1` = 跳过，`0` = 启用 | `0` |
| `CUDA_HOME` | CUDA 安装路径 | `/usr/local/cuda` | 自动检测 |
| `CUDA_PATH` | 替代 CUDA 路径变量 | `/usr/local/cuda` | 自动检测 |

### 日志

| 变量 | 描述 | 值 | 默认值 |
|------|------|-----|--------|
| `TEFL_LOG_LEVEL` | TE-FL 日志级别 | `DEBUG` / `INFO` / `WARNING` / `ERROR` | `INFO` |

## 示例

### 优先使用供应商后端

```bash
export TE_FL_PREFER=vendor
python your_script.py
```

### 仅允许特定供应商

```bash
export TE_FL_ALLOW_VENDORS=nvidia,acme
python your_script.py
```

### 自定义逐算子排序

```bash
# rmsnorm 使用 acme 供应商，其他使用 flagos
export TE_FL_PER_OP="rmsnorm_fwd=vendor:acme|flagos"
python your_script.py
```

### 跳过 CUDA，仅使用 FlagOS

```bash
export TE_FL_SKIP_CUDA=1
export TE_FL_PREFER=flagos
python your_script.py
```

### 启用调试日志

```bash
export TEFL_LOG_LEVEL=DEBUG
python your_script.py
```

## 预期输出

运行时，您应该看到类似以下的日志：

```
[TE-FL manager.py:133 INFO] Registered impl_ids: ['default.flagos', 'reference.torch', 'vendor.mybackend']
[TE-FL manager.py:390 INFO] Op 'rmsnorm_fwd' using 'vendor.mybackend' (kind=vendor, vendor=mybackend)
```
