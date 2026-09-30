# 快速入门

## 概览

FlagScale 使用 [Hydra](https://github.com/facebookresearch/hydra) 进行配置管理。配置分为两个层级：外层实验级 YAML 文件和内层任务级 YAML 文件。

- 实验级 YAML 文件定义实验目录、后端引擎、任务类型及其他相关环境配置。

- 任务级 YAML 文件指定模型、数据集以及训练或推理等具体任务的参数。

任务级 YAML 文件中的所有有效配置均对应 Megatron-LM、vllm 等后端引擎所使用的参数，其中连字符（`-`）替换为下划线（`_`）。完整的可用配置列表请参阅后端引擎文档。您可以直接复制并修改 [examples](https://github.com/flagos-ai/FlagScale/tree/main/examples) 文件夹中的现有 YAML 文件即可开始使用。

本节涵盖安装和运行 FlagScale 的要求，指导您完成 FlagScale 的安装，并演示如何运行训练、推理、服务和强化学习任务。

```{toctree}
:maxdepth: 2
  
requirements.md
install.md
user-guide.md
```
