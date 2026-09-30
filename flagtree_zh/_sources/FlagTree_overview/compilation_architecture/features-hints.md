# Hints

本节介绍 Hints 以及 Hints 在编译过程中的处理方式。

## Hints 简介

Hints 提供了一种非侵入式的性能提示注入机制，能够在保持与原生 Triton 代码完全兼容的同时，实现硬件感知的优化。其机制很简单：程序员在相应的 Triton 操作（例如 `tl.load`）旁添加行内注释（`#@hint: <hint_name>`），以提供硬件感知的优化提示。这些提示在编译过程中被编码为 MLIR（多层中间表示）属性，使中端和后端能够基于弹性验证策略应用硬件感知优化和多平台动态适配。

该机制具有以下特点：

- 原生兼容：Hints 是可选的——内核仍然是有效的 Triton 代码，并且可以在原始 Triton 编译器上正确运行。

- 低学习成本：Hints 通过轻量级的注释（`flagtree_hints`）添加，无需更改核心 Triton 语法。

- 增强编译器可扩展性：可以通过演进提示模式和 MLIR 属性来引入新的优化，避免语言级别的操作/语法扩展。

- 增强性能能力：硬件感知的提示解锁了额外的编译器优化，以更好地利用硬件特性。

有关如何使用 Hints，请参见[使用 Hints](/user_guide/use-hints.md)。

## Hints 在编译过程中的处理

Hints 通过为 TTIR 操作扩展属性来实现硬件感知优化。其实现涉及 AST 处理、TTIR 属性编码和后端 Pass 分发。

- **AST 处理**：Hints 的处理分为两个阶段：
  - **解析**（`python/triton/runtime/jit.py`）：`parse()` 方法使用 Python 的 `tokenize` 模块扫描源代码中的 `#@hint:` 注释，提取提示名称，并将其映射到行号。这些提示存储在 `line_flagtree_hints` 字典中，并附加到 AST 函数定义节点上。
  - **创建操作**（`python/triton/compiler/code_generator.py`、`python/triton/language/core.py` 和 `python/triton/language/semantic.py`）：在代码生成过程中，当遇到 `tl.load` 调用时，代码生成器从行号映射中检索提示，并将其作为 `flagtree_hints` 参数传递给 `load()`。语义层随后将该参数转发给 builder 的 `create_load()` 方法，该方法将提示编码为 TTIR 操作属性。

- **TTIR 属性扩展**：Hints 被编码为 TTIR 操作上的属性（例如，`tt.load` 操作携带提示属性），使中端和后端 Pass 能够访问和处理它们。

- **后端 Pass 分发**：Hints 处理 Pass 在后端编译器（例如 `third_party/[backend_name]/backend/compiler.py`）中进行分发。每个后端根据其支持的提示注册相应的 Pass（例如，NVIDIA 后端的 `add_process_shared_memory_hint()`）。

- **Pass 实现位置**：Hints 处理 Pass 在以下目录中实现：
  - 后端特定目录：每个后端可以在自己的目录中实现提示特定的 Pass（例如 `third_party/nvidia/`）
  - Linalg/FLIR 目录：在结构化到 memref 转换过程中处理提示的通用 Linalg Pass。
  - TLE 目录：在转换过程中可能与提示交互的 TLE 相关 Pass。
