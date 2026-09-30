# FlagDNN 概览

FlagDNN 是 [FlagOS](https://flagos.io/) 的组成部分。FlagDNN 是一个面向多芯片后端的深度神经网络计算库，提供常见深度学习算子的高性能实现，支持深度学习、计算机视觉、自然语言处理和人工智能等领域的高效计算。

FlagDNN 是使用 OpenAI 推出的 [Triton 编程语言](https://github.com/openai/triton) 实现的高性能深度学习算子库。

## 特性

- **深度性能调优** —— 所有算子均在支持的后端上经过广泛的吞吐量和延迟优化。
- **Triton 内核调用优化** —— 内核启动模式经过调优，以最小化开销并最大化硬件利用率。
- **灵活的多后端支持** —— 可插拔的后端机制使 FlagDNN 能够通过统一 API 面向不同芯片厂商。
- **常见深度学习算子** —— 包含 ReLU 等广泛使用的算子实现，更多算子正在规划中。

## 架构

FlagDNN 采用分层架构：

1. **Python API 层** —— 面向用户的接口（`flag_dnn.ops.*`），与 PyTorch 张量集成。
2. **Triton 内核层** —— 使用 Triton 编写的芯片无关的内核实现。
3. **后端调度层** —— 将内核执行路由到相应的硬件特定运行时。

## 工作流程

1. 安装 FlagDNN 及其构建依赖。
2. 在 Python 代码中与 PyTorch 一起导入 `flag_dnn`。
3. 对 CUDA 张量调用算子（例如 `flag_dnn.ops.relu(x)`）。
4. FlagDNN 将优化后的 Triton 内核调度到当前后端。
