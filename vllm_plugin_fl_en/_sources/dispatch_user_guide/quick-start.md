# Quick start

## Basic usage

```{code-block} python
from vllm_fl.dispatch import call_op, resolve_op

# Method 1: Call operator directly
result = call_op("silu_and_mul", x)

# Method 2: Resolve first, then call
fn = resolve_op("rms_norm")
result = fn(x, residual, weight, epsilon)
```

## Use the Manager

```{code-block} python
from vllm_fl.dispatch import get_default_manager

manager = get_default_manager()

# Resolve operator
fn = manager.resolve("rotary_embedding")
result = fn(query, key, cos, sin, position_ids)

# Or call directly
result = manager.call("silu_and_mul", x)
```

For API explanations, see [Dispatch API Reference](../reference/dispatch-api-reference.md).