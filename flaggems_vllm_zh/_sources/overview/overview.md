# FlagGems-vLLM 概览

FlagGems-vLLM 是 [FlagOS](https://flagos.io/Home) 的一部分。FlagGems-vLLM 是一个面向多种硬件后端的高性能算子库。它提供了常用 vLLM 算子的优化实现，并支持多种广泛使用的模型进行高性能推理和部署。

FlagGems-vLLM 是一个使用 OpenAI 推出的 [Triton 编程语言](https://github.com/openai/triton) 实现的高性能深度学习算子库。

通过与 vLLM 集成，FlagGems-vLLM 通过优化的 Triton 内核替代默认算子实现来加速推理工作负载，在多种硬件平台上提供显著的性能提升。

```{toctree}

features.md

```
