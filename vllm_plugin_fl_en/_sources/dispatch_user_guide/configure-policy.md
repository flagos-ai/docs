# Policy context management

Supports temporary policy override in code:

```python
from vllm_fl.dispatch import (
    with_strict_mode,
    with_preference,
    with_allowed_vendors,
    with_denied_vendors,
)

# Temporarily enable strict mode
with with_strict_mode():
    result = call_op("silu_and_mul", x)

# Temporarily switch preferred backend
with with_preference("reference"):
    result = call_op("rms_norm", x, residual, weight, epsilon)

# Temporarily restrict allowed vendors
with with_allowed_vendors("vendor_a"):
    result = call_op("rotary_embedding", query, key, cos, sin, position_ids)
```