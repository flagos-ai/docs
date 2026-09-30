# Override Plugin Mechanism

This document describes how to use the `@overridable` / `register()` plugin system in FlagScale, which supports replacing `megatron.core` (Megatron-LM-FL side) and `megatron.training` (FlagScale side) implementations.

Three replacement scenarios are supported:

- Replacing a class method
- Replacing a module-level function
- Replacing an entire class

---

## Core Concepts

| Role | Description |
|------|-------------|
| `@overridable` | Decorates a function/method/class in megatron core, marking it as replaceable by a plugin |
| `register()` | Declares target → impl mapping in `override_registry.py` (lazy loading) |
| Plugin Implementation | The actual replacement logic, written under the corresponding path in `megatron/plugin/` |

---

## 1. Replacing a Class Method

**Scenario**: Replace a single method in a class while keeping other methods unchanged.

### Core Side — Mark as Overridable

```python
# megatron/core/optimizer/optimizer.py
from megatron.plugin.decorators import overridable

class MixedPrecisionOptimizer:
    def __init__(self, ...):
        ...

    @overridable
    def _unscale_main_grads_and_check_for_nan(self):
        """Original implementation"""
        # ... original logic ...
        return found_inf_flag
```

### Register Mapping

```python
# megatron/plugin/override_registry.py
from megatron.plugin.decorators import register

register(
    target="megatron.core.optimizer.optimizer.MixedPrecisionOptimizer._unscale_main_grads_and_check_for_nan",
    impl="megatron.plugin.optimizer.optimizer._unscale_main_grads_and_check_for_nan",
)
```

### Plugin Side — Implement Replacement Function

```python
# megatron/plugin/optimizer/optimizer.py
import torch

def _unscale_main_grads_and_check_for_nan(self):
    """Plugin implementation: supports CPU communication and multi-group mode"""
    if not self.is_stub_optimizer:
        main_grads = self._collect_main_grad_data_for_unscaling()

    self.found_inf.fill_(0.0)

    if not self.is_stub_optimizer:
        torch._amp_foreach_non_finite_check_and_unscale_(
            main_grads, self.found_inf, self.grad_scaler.inv_scale
        )

    # Custom: support list-type groups
    groups = self.get_grad_stats_parallel_group()
    if not isinstance(groups, list):
        groups = [groups]
    for group in groups:
        torch.distributed.all_reduce(
            self.found_inf, op=torch.distributed.ReduceOp.MAX, group=group
        )

    return self.found_inf.item() > 0
```

> **Note**: When replacing a class method, the first parameter of the plugin function must be `self`, which receives the instance of the original class.

---

## 2. Replacing a Module-Level Function

**Scenario**: Replace a standalone function in a module.

### Core Side — Mark as Overridable

```python
# megatron/core/optimizer/clip_grads.py
from megatron.plugin.decorators import overridable

@overridable
def get_grad_norm_fp32(
    grads_for_norm,
    norm_type=2,
    grad_stats_parallel_group=None,
):
    """Original implementation"""
    # ... original logic ...
    return total_norm
```

### Register Mapping

```python
# megatron/plugin/override_registry.py
from megatron.plugin.decorators import register

register(
    target="megatron.core.optimizer.clip_grads.get_grad_norm_fp32",
    impl="megatron.plugin.optimizer.clip_grads.get_grad_norm_fp32",
)
```

### Plugin Side — Implement Replacement Function

```python
# megatron/plugin/optimizer/clip_grads.py
import torch

def get_grad_norm_fp32(grads_for_norm, norm_type=2, grad_stats_parallel_group=None):
    """Plugin implementation: supports list-type parallel groups and CPU communication"""
    if isinstance(grads_for_norm, torch.Tensor):
        grads_for_norm = [grads_for_norm]

    # ... custom grad norm calculation logic ...

    return total_norm
```

---

## 3. Replacing an Entire Class

**Scenario**: Completely replace an original class with a new class. All places that instantiate the original class automatically receive the replacement class.

### Core Side — Mark as Overridable

```python
# megatron/core/optimizer/lr_scheduler.py
from megatron.plugin.decorators import overridable

@overridable
class CosineAnnealingLR:
    def __init__(self, optimizer, max_steps, min_lr=0.0):
        self.optimizer = optimizer
        self.max_steps = max_steps
        self.min_lr = min_lr
        self.current_step = 0

    def step(self):
        """Cosine annealing"""
        import math
        progress = self.current_step / self.max_steps
        lr = self.min_lr + 0.5 * (1 + math.cos(math.pi * progress))
        for group in self.optimizer.param_groups:
            group['lr'] = lr
        self.current_step += 1

    def get_lr(self):
        return self.optimizer.param_groups[0]['lr']
```

### Register Mapping

```python
# megatron/plugin/override_registry.py
from megatron.plugin.decorators import register

register(
    target="megatron.core.optimizer.lr_scheduler.CosineAnnealingLR",
    impl="megatron.plugin.optimizer.lr_scheduler.WSDScheduler",
)
```

### Plugin Side — Implement Replacement Class

```python
# megatron/plugin/optimizer/lr_scheduler.py
from megatron.core.optimizer.lr_scheduler import CosineAnnealingLR

class WSDScheduler(CosineAnnealingLR):
    """Plugin implementation: Warmup-Stable-Decay scheduler"""

    def __init__(self, optimizer, max_steps, min_lr=0.0, warmup_steps=1000):
        super().__init__(optimizer, max_steps, min_lr)
        self.warmup_steps = warmup_steps

    def step(self):
        if self.current_step < self.warmup_steps:
            # Warmup phase
            lr = (self.current_step / self.warmup_steps)
        elif self.current_step < self.max_steps * 0.9:
            # Stable phase
            lr = 1.0
        else:
            # Decay phase
            decay_progress = (self.current_step - self.max_steps * 0.9) / (self.max_steps * 0.1)
            lr = max(self.min_lr, 1.0 * (0.5 ** decay_progress))

        for group in self.optimizer.param_groups:
            group['lr'] = lr
        self.current_step += 1
```

> **Requirement**: The replacement class **must inherit from the original class** to ensure `isinstance(obj, CosineAnnealingLR)` still returns `True`.

### Transparent to Callers

```python
# Business code requires no modification
from megatron.core.optimizer.lr_scheduler import CosineAnnealingLR

scheduler = CosineAnnealingLR(optimizer, max_steps=10000)
# Actually receives a WSDScheduler instance
scheduler.step()
```

---

## Multi-Vendor Support

Multiple vendor implementations can be registered for the same target, selected via environment variable:

```python
# override_registry.py
register(
    target="megatron.core.optimizer.clip_grads.get_grad_norm_fp32",
    impl="megatron.plugin.optimizer.clip_grads.get_grad_norm_fp32",
)
register(
    target="megatron.core.optimizer.clip_grads.get_grad_norm_fp32",
    impl="megatron.plugin.optimizer.clip_grads.get_grad_norm_fp32_musa",
    vendor="musa",
)
```

Runtime selection:

```bash
export MG_FL_PREFER=musa   # Use MUSA vendor implementation
```

When `MG_FL_PREFER` is not set, the `vendor="default"` implementation is used.

---

## method_key Generation Rules

The `target` parameter of `register()` is automatically converted to an internal method_key:

| target path | method_key |
|---|---|
| `megatron.core.optimizer.clip_grads.get_grad_norm_fp32` | `clip_grads.get_grad_norm_fp32` |
| `megatron.core.optimizer.optimizer.MixedPrecisionOptimizer._unscale_main_grads_and_check_for_nan` | `MixedPrecisionOptimizer._unscale_main_grads_and_check_for_nan` |
| `megatron.core.optimizer.lr_scheduler.CosineAnnealingLR` | `lr_scheduler.CosineAnnealingLR` |

Rules:
- **Module-level function / Class**: module basename before the last segment + `.` + name
- **Class method**: If the second-to-last segment starts with an uppercase letter, it is treated as a class name → `ClassName.method_name`

---

## Quick Start Checklist

1. Add `@overridable` to the target in core code
2. Add `register(...)` in `megatron/plugin/override_registry.py`
3. Write the implementation under the corresponding path in `megatron/plugin/` (pure function or subclass, no `@override` decorator needed)
4. Done — takes effect automatically at runtime
