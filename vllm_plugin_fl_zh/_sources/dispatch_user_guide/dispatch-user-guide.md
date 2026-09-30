# 算子调度用户指南

本指南介绍如何使用算子调度系统，该系统在 FlagGems、厂商特定实现和 PyTorch 参考实现之间进行选择。选择遵循优先级层级，从高到低：

- 用户指定的配置文件（YAML）
- 项目特定的环境变量
- 平台配置文件（例如 ascend.yaml 和 cuda.yaml）
- 内置默认值

```{toctree}
:maxdepth: 2

quick-start.md
configure-backend-selection.md
configure-policy.md
add-ops-and-vendors.md

```
