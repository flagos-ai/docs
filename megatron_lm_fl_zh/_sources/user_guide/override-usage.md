# Override 插件机制

本文档介绍如何在 FlagScale 中使用 `@overridable` / `register()` 插件系统，该系统支持替换 `megatron.core`（Megatron-LM-FL 侧）和 `megatron.training`（FlagScale 侧）的实现。

支持三种替换场景：

- 替换类方法
- 替换模块级函数
- 替换整个类

---

## 核心概念

| 角色 | 描述 |
|------|------|
| `@overridable` | 装饰 megatron core 中的函数/方法/类，将其标记为可被插件替换 |
| `register()` | 在 `override_registry.py` 中声明 target → impl 映射（延迟加载） |
| 插件实现 | 实际的替换逻辑，写在 `megatron/plugin/` 下对应的路径中 |

---

## 1. 替换类方法

**场景**：替换类中的单个方法，同时保持其他方法不变。

### Core 侧 — 标记为 Overridable

```python
# megatron/core/optimizer/optimizer.py
from megatron.plugin.decorators import overridable

class MixedPrecisionOptimizer:
    def __init__(self, ...):
        ...

    @overridable
    def _unscale_main_grads_and_check_for_nan(self):
        """原始实现"""
        # ... 原始逻辑 ...
        return found_inf_flag
```

### 注册映射

```python
# megatron/plugin/override_registry.py
from megatron.plugin.decorators import register

register(
    target="megatron.core.optimizer.optimizer.MixedPrecisionOptimizer._unscale_main_grads_and_check_for_nan",
    impl="megatron.plugin.optimizer.optimizer._unscale_main_grads_and_check_for_nan",
)
```

### 插件侧 — 实现替换函数

```python
# megatron/plugin/optimizer/optimizer.py
import torch

def _unscale_main_grads_and_check_for_nan(self):
    """插件实现：支持 CPU 通信和多组模式"""
    if not self.is_stub_optimizer:
        main_grads = self._collect_main_grad_data_for_unscaling()

    self.found_inf.fill_(0.0)

    if not self.is_stub_optimizer:
        torch._amp_foreach_non_finite_check_and_unscale_(
            main_grads, self.found_inf, self.grad_scaler.inv_scale
        )

    # 自定义：支持列表类型组
    groups = self.get_grad_stats_parallel_group()
    if not isinstance(groups, list):
        groups = [groups]
    for group in groups:
        torch.distributed.all_reduce(
            self.found_inf, op=torch.distributed.ReduceOp.MAX, group=group
        )

    return self.found_inf.item() > 0
```

> **注意**：替换类方法时，插件函数的第一个参数必须是 `self`，它接收原始类的实例。

---

## 2. 替换模块级函数

**场景**：替换模块中的独立函数。

### Core 侧 — 标记为 Overridable

```python
# megatron/core/optimizer/clip_grads.py
from megatron.plugin.decorators import overridable

@overridable
def get_grad_norm_fp32(
    grads_for_norm,
    norm_type=2,
    grad_stats_parallel_group=None,
):
    """原始实现"""
    # ... 原始逻辑 ...
    return total_norm
```

### 注册映射

```python
# megatron/plugin/override_registry.py
from megatron.plugin.decorators import register

register(
    target="megatron.core.optimizer.clip_grads.get_grad_norm_fp32",
    impl="megatron.plugin.optimizer.clip_grads.get_grad_norm_fp32",
)
```

### 插件侧 — 实现替换函数

```python
# megatron/plugin/optimizer/clip_grads.py
import torch

def get_grad_norm_fp32(grads_for_norm, norm_type=2, grad_stats_parallel_group=None):
    """插件实现：支持列表类型并行组和 CPU 通信"""
    if isinstance(grads_for_norm, torch.Tensor):
        grads_for_norm = [grads_for_norm]

    # ... 自定义梯度范数计算逻辑 ...

    return total_norm
```

---

## 3. 替换整个类

**场景**：用新类完全替换原始类。所有实例化原始类的地方都会自动获得替换类。

### Core 侧 — 标记为 Overridable

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
        """余弦退火"""
        import math
        progress = self.current_step / self.max_steps
        lr = self.min_lr + 0.5 * (1 + math.cos(math.pi * progress))
        for group in self.optimizer.param_groups:
            group['lr'] = lr
        self.current_step += 1

    def get_lr(self):
        return self.optimizer.param_groups[0]['lr']
```

### 注册映射

```python
# megatron/plugin/override_registry.py
from megatron.plugin.decorators import register

register(
    target="megatron.core.optimizer.lr_scheduler.CosineAnnealingLR",
    impl="megatron.plugin.optimizer.lr_scheduler.WSDScheduler",
)
```

### 插件侧 — 实现替换类

```python
# megatron/plugin/optimizer/lr_scheduler.py
from megatron.core.optimizer.lr_scheduler import CosineAnnealingLR

class WSDScheduler(CosineAnnealingLR):
    """插件实现：Warmup-Stable-Decay 调度器"""

    def __init__(self, optimizer, max_steps, min_lr=0.0, warmup_steps=1000):
        super().__init__(optimizer, max_steps, min_lr)
        self.warmup_steps = warmup_steps

    def step(self):
        if self.current_step < self.warmup_steps:
            # 预热阶段
            lr = (self.current_step / self.warmup_steps)
        elif self.current_step < self.max_steps * 0.9:
            # 稳定阶段
            lr = 1.0
        else:
            # 衰减阶段
            decay_progress = (self.current_step - self.max_steps * 0.9) / (self.max_steps * 0.1)
            lr = max(self.min_lr, 1.0 * (0.5 ** decay_progress))

        for group in self.optimizer.param_groups:
            group['lr'] = lr
        self.current_step += 1
```

> **要求**：替换类**必须继承原始类**，以确保 `isinstance(obj, CosineAnnealingLR)` 仍然返回 `True`。

### 对调用者透明

```python
# 业务代码无需修改
from megatron.core.optimizer.lr_scheduler import CosineAnnealingLR

scheduler = CosineAnnealingLR(optimizer, max_steps=10000)
# 实际接收到的是 WSDScheduler 实例
scheduler.step()
```

---

## 多供应商支持

可以为同一 target 注册多个供应商实现，通过环境变量选择：

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

运行时选择：

```bash
export MG_FL_PREFER=musa   # 使用 MUSA 供应商实现
```

当 `MG_FL_PREFER` 未设置时，使用 `vendor="default"` 的实现。

---

## method_key 生成规则

`register()` 的 `target` 参数会自动转换为内部的 method_key：

| target 路径 | method_key |
|---|---|
| `megatron.core.optimizer.clip_grads.get_grad_norm_fp32` | `clip_grads.get_grad_norm_fp32` |
| `megatron.core.optimizer.optimizer.MixedPrecisionOptimizer._unscale_main_grads_and_check_for_nan` | `MixedPrecisionOptimizer._unscale_main_grads_and_check_for_nan` |
| `megatron.core.optimizer.lr_scheduler.CosineAnnealingLR` | `lr_scheduler.CosineAnnealingLR` |

规则：
- **模块级函数 / 类**：最后一个段之前的模块基名 + `.` + 名称
- **类方法**：如果倒数第二个段以大写字母开头，则视为类名 → `ClassName.method_name`

---

## 快速入门清单

1. 在 core 代码中为目标添加 `@overridable`
2. 在 `megatron/plugin/override_registry.py` 中添加 `register(...)`
3. 在 `megatron/plugin/` 下对应的路径中编写实现（纯函数或子类，无需 `@override` 装饰器）
4. 完成 — 运行时自动生效
