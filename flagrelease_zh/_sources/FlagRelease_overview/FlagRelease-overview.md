# FlagRelease 概述

FlagRelease 是一个致力于跨不同 AI 硬件平台实现大模型自动迁移、适配和发布的平台。

FlagRelease 基于统一开源的 AI 系统软件栈 FlagOS 构建，提供跨硬件适配能力。FlagRelease 建立了一套标准化的流程，支持：

- 大模型向不同硬件架构的自动迁移
- 迁移结果的自动化评测
- 内置自动化部署和调优
- 多芯片模型打包和发布

通过 FlagRelease 平台发布的制品在以下平台以 FlagRelease 组织名义发布：

- [ModelScope](https://modelscope.cn/organization/FlagRelease?tab=model)
- [Hugging Face](https://huggingface.co/FlagRelease)
- [AI 焕新](https://aihuanxin.cn/#/model?path=/model)

用户可以获取不同硬件特定版本的开源大模型。这些模型可以直接在相应的硬件环境中下载和使用，无需用户自行进行模型迁移。

FlagRelease 平台的输出包括经过验证、硬件适配的模型文件和集成的 Docker 镜像。每个镜像包含 FlagOS 的核心组件以及所有必需的模型依赖，允许用户直接在目标芯片上部署和使用模型。此外，每个模型发布都提供评测结果作为技术参考，让用户能够清晰了解模型在不同硬件平台上的正确性和性能特征。

此外，每个发布的模型都附带 AnythingLLM 的配置和使用说明，帮助用户快速验证迁移模型的可用性，并便于基于这些模型进行下游开发和应用。

您可以在以下场景中使用 FlagRelease 进行快速部署和执行：

- 研究和实验：快速部署大模型进行推理，无需关注底层硬件差异。
- 生产环境：直接部署硬件特定版本的模型作为服务，确保在不同 AI 芯片上的性能和稳定性。