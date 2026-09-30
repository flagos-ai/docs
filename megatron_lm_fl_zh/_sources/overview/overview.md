# Megatron-LM-FL 概览

Megatron-LM-FL 是 [NVIDIA Megatron-LM](https://github.com/NVIDIA/Megatron-LM) 的一个分支，引入了**基于插件的架构**以支持多种 AI 芯片，构建在 [FlagOS](https://github.com/flagos-ai)（统一开源 AI 系统软件栈）之上。

上游 Megatron-LM 专为 NVIDIA GPU 优化，而 Megatron-LM-FL 通过硬件抽象层将其扩展，使其能够在多个平台上进行训练 — 包括 NVIDIA（CUDA）、MetaX、Moore Threads（MUSA）、TXDA（Tsingmicro）和 NPU（Ascend）— 同时对核心库的代码侵入最小。
