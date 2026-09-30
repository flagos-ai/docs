# 通用架构

本节介绍 FlagTree 与 Triton 之间的通用架构。该通用架构包含 **AST 处理**、**后端编译**和**运行时系统**模块，负责处理编译过程。

以下列表介绍了 FlagTree 中的目录以及各模块的功能：

- **AST 处理**：
  - 目录：`python/triton/compiler/` 和 `python/triton/language/`
  - 功能：理解你的代码，并将 Python 内核代码转换为 MLIR（多层中间表示）格式的 TTIR（Triton IR）。
  该模块包含以下子模块：
  - **语言定义**：
    - 目录：`python/triton/language/`
    - 功能：定义 Triton 的语言构造，包括核心类型（`core.py`）、标准操作（`standard.py`）、数学函数（`math.py`）和语义规则（`semantic.py`）。这些提供了内核使用的基本构建块。
  - **代码生成**：
    - 目录：`python/triton/compiler/code_generator.py`
    - 功能：通过识别 Triton 语言构造（在 `python/triton/language/` 中定义）并生成初始中间表示（IR），将 Python AST（抽象语法树）转换为 TTIR（即 Triton IR）操作。
  - **编译器协调**：
    - 目录：`python/triton/compiler/compiler.py`
    - 功能：编排编译过程，管理 AST 源、IR 源，并与后端协调。

- **后端编译**：
  - 目录：`third_party/[backend]/backend/compiler.py`
  - 功能：每个后端通过 `add_stages()` 方法定义其编译管线，该方法指定如何将 TTIR 转换为可执行代码。典型流程包括：TTIR → TTGPU IR/ Linalg IR → LLVM IR → 目标汇编 → 二进制。每个后端通过硬件特定的优化和代码生成来实现这些阶段。

- **运行时系统**：
  - 目录：`python/triton/runtime/`
  - 功能：处理 JIT 编译、内核缓存和内核启动。运行时在首次调用时按需编译内核，缓存编译结果以避免重复编译，并通过后端驱动管理 GPU 上的内核执行。
