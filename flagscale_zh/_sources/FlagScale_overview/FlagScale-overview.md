# FlagScale 概览

FlagScale 是 [FlagOS](https://flagos.io/) 的核心组件——一个统一的开源 AI 系统软件栈，通过无缝集成各种模型、系统和芯片，培育开放技术生态。遵循"一次开发，跨芯片迁移"的原则，FlagOS 旨在充分释放硬件的计算潜力，打破不同芯片软件栈之间的壁垒，有效降低迁移成本。

作为该生态系统的核心工具集，FlagScale 提供统一接口，覆盖大语言模型、多模态模型和具身智能模型的完整生命周期。它在单一配置和 CLI 接口下集成了多个开源后端引擎，支持模型训练、强化学习和推理等关键工作流——可在不同芯片厂商间一致运行。

在 FlagOS 生态系统中，FlagScale 与以下组件协同工作：

- FlagOS 插件 – 上游 AI 框架的硬件适配集成

- [FlagCX](https://docs.flagos.io/projects/FlagCX/en/latest/) – 可扩展的自适应跨芯片通信库

- [FlagOS-Robo](https://github.com/flagos-ai/FlagOS-Robo) – 具身智能工作负载的基础设施

FlagOS 插件项目构建在广泛使用的上游开源框架之上，并将其扩展以支持多种 AI 芯片。这些插件为训练、强化学习和推理提供硬件兼容性和运行时集成。

下表列出了 FlagOS 插件与其对应上游项目的映射关系。

| 任务                    | FlagOS 插件项目                            | 上游项目                       |
|-------------------------|--------------------------------------------|-------------------------------|
| 训练                    | [Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL)<br>[TransformerEngine-FL](https://github.com/flagos-ai/TransformerEngine-FL) | [Megatron-LM](https://github.com/NVIDIA/Megatron-LM)<br>[TransformerEngine](https://github.com/NVIDIA/TransformerEngine) |
| 强化学习                | [VeRL-FL](https://github.com/flagos-ai/verl-FL)                                  | [veRL](https://github.com/verl-project/verl)                        |
| 服务 / 推理             | [vllm-plugin-FL](https://github.com/flagos-ai/vllm-plugin-FL)                           | [vllm](https://github.com/vllm-project/vllm)                        |


```{toctree}

features.md
workflow.md

```
