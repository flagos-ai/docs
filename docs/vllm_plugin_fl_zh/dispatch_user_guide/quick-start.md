# 快速开始

## 基本用法

```{code-block} python
from vllm_fl.dispatch import call_op, resolve_op

# 方法 1：直接调用算子
result = call_op("silu_and_mul", x)

# 方法 2：先解析，再调用
fn = resolve_op("rms_norm")
result = fn(x, residual, weight, epsilon)
```

## 使用管理器

```{code-block} python
from vllm_fl.dispatch import get_default_manager

manager = get_default_manager()

# 解析算子
fn = manager.resolve("rotary_embedding")
result = fn(query, key, cos, sin, position_ids)

# 或直接调用
result = manager.call("silu_and_mul", x)
```

API 说明请参见 [调度 API 参考](../reference/dispatch-api-reference.md)。
