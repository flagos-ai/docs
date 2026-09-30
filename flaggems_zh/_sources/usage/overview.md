# 概述

*FlagGems* 支持多种使用模式。你可以根据自己的需要作出选择。
这些使用模式并非全部是互斥的。在不同的上下文，你可以使用不同的模式。

- **[启用 FlagGems](../usage/basic)**

  在使用 *FlagGems* 中的算子之前，你需要在你的程序中启用 `flag_gems` 包。
  *FlagGems* 支持全局性的启用，也支持基于上下文管理器的局部启用。

- **[选择性启用](../usage/selective)**:

  如果你在自己的程序中对启用、禁用某些算子有一些特殊的需求，可以选择性地启用、禁用它们。
  通常，这类选择的依据之一是算子在你所使用的硬件平台上展现出来的性能，
  另一个依据则是你所运行的工作负载的性质。

- **[启用日志输出](../usage/debugging)**:

  如果希望检视算子调用的轨迹，你可以在启用 `flag_gems` 时添加日志输出选项。

- **[启用实验性算子](../usage/experimental)**

  *FlagGems* 算子库中有一些算子仍然处于实验性阶段，尚未经过严格的产品环境检验。
  即便如此，如果你希望尝试这些算子，也可以在你的工作流中启用它们。

- **[在非 NVIDIA 平台上使用 FlagGems](../usage/non-nvidia)**

  如果你在使用非 NVIDIA 的硬件平台运行自己的工作负载，你仍然可以查看 *FlagGems*
  是否已经支持你所使用的硬件平台。
  使用 *FlagGems* 的好处之一是你不需要过度担心跨平台的可移植性问题。

- **[运行多 GPU 或分布式环境](../usage/distributed)**

  如果你在多 GPU 或者分布式环境下运行自己的 AI 应用，例如基于 vLLM 的分布式推理平台，
  你可以查阅如何在这类环境中启用 *FlagGems*。你可能需要在启用 *FlagGems*
  之前完成一些环境准备工作。

- **[与常用框架集成](../usage/frameworks)**

  *FlagGems* 算字库可以与常见的训练或推理框架集成，例如
  [Hugging Face Transformers](https://huggingface.co/docs/transformers/index)、
  [vLLM](https://docs.vllm.ai/en/latest/)、
  [Metatron-LM](https://github.com/NVIDIA/Megatron-LM)
  等等。

- **[构建自己的模型](../usage/modules)**

  *FlagGems* 项目提供一组可以被直接集成到你的模型当中的模块，这个集合仍在持续扩大。
  这里所说的模型可以是一个从头开发的模型，也可以是一个适配的模型。

- **[启用预优化获得更好的性能](../usage/tuning)**

  *FlagGems* 提供 [`LibTuner`](https://github.com/flagos-ai/FlagGems/blob/v4.2.0/src/flag_gems/utils/libentry.py#L206) 类，
  作为对 Triton 的自动调优系统的轻量级增强。
  这个类可以帮助你优化 Triton 自动调优过程中存在的运行时开销。

- **[使用 C++ 封装的算子实现更佳性能](../usage/cpp)**

  *FlagGems* 还提供一个使用 C++ 语言深度优化的算子集合，这个集合也在持续增长中。
  如果其中的算子适合于你的应用场景，不妨尝试使用这类算子。
