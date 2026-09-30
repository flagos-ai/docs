# 策略上下文管理

支持在代码中临时覆盖策略：

```python
from vllm_fl.dispatch import (
    with_strict_mode,
    with_preference,
    with_allowed_vendors,
    with_denied_vendors,
)

# 临时启用严格模式
with with_strict_mode():
    result = call_op("silu_and_mul", x)

# 临时切换首选后端
with with_preference("reference"):
    result = call_op("rms_norm", x, residual, weight, epsilon)

# 临时限制允许的厂商
with with_allowed_vendors("vendor_a"):
    result = call_op("rotary_embedding", query, key, cos, sin, position_ids)
```
