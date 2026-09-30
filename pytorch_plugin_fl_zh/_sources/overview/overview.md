# PyTorch-Plugin-FL 概览

`torch_fl` 是基于 `PrivateUse1` 扩展机制的自定义 PyTorch 设备插件。它将 [FlagGems](https://github.com/flagos-ai/FlagGems) 高性能 Triton 算子、厂商原生算子库和 CUDA 兼容内核统一注册到同一个设备名称下：`flagos`。

不同加速器厂商提供的运行时、编译器栈和 PyTorch 集成方式各不相同。PyTorch-Plugin-FL 通过统一的运行时和算子路由层屏蔽这些差异：用户只使用标准 PyTorch API 和单一设备名称，插件根据平台能力与配置为每个算子选择内核实现。

## 设计理念

PyTorch-Plugin-FL 遵循五项原则：

1. **PyTorch 原生接口** — 标准 PyTorch API 无需修改；用户面向 `flagos` 设备编程，而不是使用厂商专用扩展。
2. **统一逻辑设备** — 单一设备名称（`flagos`）抽象厂商差异，平台相关路由在算子层透明完成。
3. **分层算子后端** — 每个操作可以分发到不同实现。路由决策以算子为粒度，而不是以设备或模型为粒度。
4. **优先复用而非重写** — 在 dispatch 和 ABI 边界允许的情况下集成成熟内核与编译器栈，避免重复实现已有能力。
5. **明确能力边界** — 对不支持的操作和 CPU 回退路径进行明确说明，不将其描述为完整原生覆盖；通过状态等级区分已验证支持与实验性集成。

## 快速开始

```python
import torch
import torch_fl

# 在 flagos 设备上创建张量
x = torch.randn(4, 4, device="flagos:0")

# 算子路由到与平台匹配的内核
y = torch.relu(x @ x)

# 结果传回 CPU
print(y.cpu())
```

算子路由（FlagGems 编译器内核、厂商原生内核、兼容性 boxing 或 CPU 回退）由平台探测和运行期配置决定。上述代码在所有已支持的加速器上保持不变。

## 状态定义

| 状态 | 含义 |
|---|---|
| 稳定 | 关键路径持续接受测试，并已记录受支持的版本组合。 |
| Beta | 主要路径已经验证，但覆盖范围、打包或发布流程尚未稳定。 |
| 实验性 | 已在特定配置、模型或硬件环境中完成验证；接口或构建流程仍可能变化。 |
| 仅运行时 | 已提供设备运行时支持，但该平台不是通用 eager 算子后端。 |

某项功能存在于 PyTorch-Plugin-FL 代码库中，并不代表每个平台都已实现或验证该功能。分平台详情请参阅 {doc}`兼容性矩阵 <../reference/compatibility>`。

```{toctree}
:maxdepth: 2

features.md
architecture.md
```
