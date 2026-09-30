# 快速开始

本节介绍从下载开源模型权重到部署执行模型的通用步骤。

FlagRelease 的输出包括经过验证的大模型文件和集成的 FlagOS Docker 镜像。通过使用这些制品，用户可以快速在不同硬件平台上部署和运行大模型，无需自行进行模型迁移或配置复杂的软件环境。

## 通用流程

通用流程如下：

1. 下载开源模型权重

   {style=lower-alpha}
    1. 访问 FlagRelease 在 [ModelScope](https://modelscope.cn/organization/FlagRelease?tab=model)、[Hugging Face](https://huggingface.co/FlagRelease) 或 [AI 焕新](https://aihuanxin.cn/#/model?path=/model) 的页面。
    2. 选择所需的大模型及对应的硬件特定版本，直接下载模型权重文件。

2. 下载 FlagOS 镜像

   获取官方提供的集成 FlagOS Docker 镜像，其中包含统一的软件栈和内置的硬件适配支持。

3. 部署执行

   将下载的模型权重与 FlagOS 镜像结合，直接在目标硬件上运行模型。FlagOS 自动管理硬件资源并支持多芯片并行执行，无需手动配置环境。

## 操作步骤

1. 访问 FlagRelease 在 [ModelScope](https://modelscope.cn/organization/FlagRelease?tab=model)、[Hugging Face](https://huggingface.co/FlagRelease) 或 [AI 焕新](https://aihuanxin.cn/#/model?path=/model) 的页面。
2. 选择所需的大模型及对应的硬件特定版本。
3. 按照模型介绍页面中描述的步骤进行操作。