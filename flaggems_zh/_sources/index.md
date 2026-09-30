[![](_static/images/banner-20260130.png)](https://flagos.io/)

# FlagGems 简介

[![GitHub](https://img.shields.io/badge/GitHub-flagos--ai/FlagGems-blue)](https://github.com/flagos-ai/FlagGems)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](https://github.com/flagos-ai/FlagGems/blob/master/LICENSE)

## 关于 FlagGems

*FlagGems* 是一个高性能的通用算子库，使用 [Triton](https://github.com/openai/triton)
编程语言实现。项目的目标是提供一套核心（kernel）函数来加速 LLM 训练与推理。

通过将自身算子实现注册到 PyTorch 的 ATen 后端，*FlagGems* 可以实现无缝的衔接，
方便用户在不需要修改自身模型代码的前提下迁移到 Triton 函数库。

*FlagGems* 可以被 OpenAI 的 Triton 编译器（针对 NVIDIA 和 AMD 芯片）和
[FlagTree 编译器](https://github.com/flagos-ai/FlagTree) 支持；
后者可以支持多种不同的 AI 硬件平台。
用户可以像往常一样使用 ATen 后端，同时藉由 *FlagGems* 算子库实现性能上的提升。
Triton 编程语言在代码可读性、用户友好性上都有很好表现，并且所获得的性能与 CUDA
原生平台具有可比较性。Triton 所提供的这种便利使得开发者能够很快学会并参与到
*FlagGems* 算子的开发工作中。

## 下一步

- 阅读[功能特性概览](overview/features)
- 了解[FlagGems 所支持的平台](overview/platforms)
- [开始使用 FlagGems](getting-started/install)
- 查看项目的[变更历史](references/changelog)
- 查看[支持的算子列表](references/operators)

```{toctree}
:hidden:
:caption: 快速开始
:maxdepth: 2

getting-started/install
```

```{toctree}
:hidden:
:caption: 概览
:maxdepth: 2

overview/features
overview/platforms
overview/pointwise-dynamic
```

```{toctree}
:hidden:
:caption: 使用指南
:maxdepth: 2

usage/overview
usage/basic
usage/selective
usage/debugging
usage/experimental
usage/non-nvidia
usage/distributed
usage/frameworks
usage/modules
usage/tuning
usage/cpp
usage/precision
```

```{toctree}
:hidden:
:caption: 性能测试与优化
:maxdepth: 2

performance/overview
performance/benchmark
performance/results
performance/database
```

```{toctree}
:hidden:
:caption: 测试
:maxdepth: 2

testing/unittest
testing/coverage
```

```{toctree}
:hidden:
:caption: 参考信息
:maxdepth: 2

references/operators
references/operators-search
references/changelog
references/experimental
references/project_structure
references/release
references/test/index
```

```{toctree}
:hidden:
:caption: 参与项目
:maxdepth: 2

contribution/overview
contribution/backend
contribution/cpp-wrapper
```

## 支持的模型

- Bert-base-uncased
- Llama-2-7b
- Llava-1.5-7b

## 参与开发

如果你对 *FlagGems* 项目的愿景感兴趣，愿意参与其开发活动，
请阅读[贡献指南](contribution/overview) 小节。
我们欢迎任何形式的贡献。

## 联系我们

如果你对 *FlagGems* 有任何问题，请在 GitHub 代码仓库上登记你的问题，
或者通过 <a href="mailto:flaggems@baai.ac.cn">flaggems@baai.ac.cn</a>
邮箱与我们联系。

我们还为 *FlagGems* 创建了微信群。你可以微信扫描下面的二维码，参与群聊。
要想了解项目的最新进展、新版本的规划特性，或者提出任何问题与建议，
请考虑加入我们！

```{raw} html
<img src="https://github.com/user-attachments/assets/69019a23-0550-44b1-ac42-e73f06cb55d6" alt="WeChat Group" width="200">
```

## 许可协议

*FlagGems* 项目使用
[Apache 2.0](https://github.com/flagos-ai/FlagGems/blob/master/LICENSE)
许可协议。