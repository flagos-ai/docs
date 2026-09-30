# FlagTree 可扩展框架

FlagTree 可扩展框架专门设计用于支持多后端编译和三级编译器语言，如[特性](features.md)部分所述。

- **后端扩展**：FlagTree 遵循基于插件的架构，每个后端自包含在 `third_party/[backend_name]/` 中。每个后端实现 BaseBackend 接口，通过 `add_stages()` 定义其编译管线，并提供后端特定的优化和代码生成。这种设计允许在不修改核心 Triton 代码的情况下添加新的后端。

- **语言和编译器优化扩展**：对于现有的 Triton 代码，FlagTree 采用增量扩展的方式，以完全兼容原生 Triton。这些扩展包括对通用架构的以下修改：
  - 对现有 Triton 文件的修改：FlagTree 通过修改现有文件来增量扩展 Triton 的编译管线。例如，`python/triton/runtime/jit.py` 被扩展以解析 `#@hint:` 注释并路由 TLE 语法，将提示附加到 AST 节点。TTIR 方言定义文件（`.td`）被扩展了新的属性定义，以将提示编码为 `tt.load` 等操作上的 MLIR 属性。后端编译器文件（例如 `backend/compiler.py`）被扩展以注册处理提示和 TLE 操作的新优化 Pass，并与现有的 Pass 管理基础设施集成。

  - 新增文件：FlagTree 在 `third_party/tle/` 中以新文件的形式引入了完整的 TLE 模块，包括方言定义（如 `tle.dsl_region` 等操作）、转换 Pass 实现（内存空间分配、异步加载 lowering 等）、LLVM 转换 Pass 以及 Python 语言绑定。这种模块化设计使 TLE 独立于核心 Triton，同时通过扩展的 TTIR 属性和后端 Pass 注册机制进行集成，从而在不修改通用架构的情况下实现共享内存管理和流水线优化等功能。

对于 TLE，FlagTree 最大程度地分离了 TLE 语言扩展（`python/triton/experimental/tle/`）和 TLE MLIR 方言（`third_party/tle/`）。TLE 语言构造在 Python 中定义，并通过 AST 处理管线集成；而 TLE 方言操作在 C++/MLIR 中实现，并通过编译管线集成。这种分离使语言特性和 IR 转换能够独立演进，提高了可维护性，并使不同的后端能够在编译管线的不同阶段采用 TLE 特性。

以下代码结构展示了 FlagTree 如何组织其扩展：

```{code-block} python
flagtree/
├── python/
│   ├── triton/                # Triton 核心（现有）
│   │   ├── compiler/              
│   │   │   ├── code_generator.py  # [已扩展] TLE 模块调度、Hints 提取
│   │   │   └── compiler.py       
│   │   ├── language/              
│   │   │   ├── core.py            # [已扩展] Hints
│   │   │   └── semantic.py        # [已扩展] Hints
│   │   ├── runtime/               
│   │   │   └── jit.py             # [已扩展] Hints
│   │   └── experimental/          # 语言扩展
│   │       └── tle/               # TLE（Triton 语言扩展）
│   │           ├── language/      # TLE 语言定义（扩展 AST 处理）
│   │           │   ├── core.py    # TLE-Lite：核心 TLE 语言特性（例如 tle.load）
│   │           │   ├── [gpu/npu]/ # TLE-Struct：GPU 特定和 NPU 特定构造
│   │           │   │   ├── core.py    
│   │           │   │   ├── semantic.py 
│   │           │   │   └── types.py   
│   │           │   └── raw/       # TLE-Raw：原始 MLIR 编程接口
│   │           │       ├── core.py    
│   │           │       └── semantic.py
│   │           └── raw/           # TLE-Raw 实现（扩展 AST 处理）
│   │               ├── mlir/      # TLE-Raw 的 MLIR 代码生成
│   │               │   ├── codegen.py  
│   │               │   └── runtime.py 
│   │               └── runtime.py # TLE-Raw 的运行时支持
│   ├── tutorials/             # 教程和示例（不在代码路径中）
│   │   └── tle/                # TLE 示例
│   │       ├── 01-sparse-mla.py
│   │       └── raw/            # TLE-Raw 示例
│   └── test/                   # 测试代码（不在代码路径中）
│       └── tle/                # TLE 测试
│           ├── integration/    # 集成测试
│           ├── unit/           # 单元测试
│           └── run_tests.py
│
└── third_party/              
    ├── [backend_name]/       # 后端特定扩展
    │   ├── backend/           
    │   │   └── compiler.py    # [已扩展] TLE 和 HINTS Pass 分发
    │   ├── include/           # TTIR 方言定义（可能用属性扩展 tt.load）
    │   └── lib/                           
    ├── tle/                  # TLE MLIR 扩展
    │   └── dialect/           # TLE 方言实现
    │       ├── include/IR/    
    │       ├── lib/IR/       
    │       ├── lib/Conversion/  
    │       └── lib/Transforms/
    └── flir/                 # FLIR：FlagTree 维护的通用 Linalg，包含 HINTS Pass

```

```{note}
上述代码结构仅展示了与 FlagTree 扩展相关的关键文件和目录。代码库中的许多其他文件和子目录为清晰起见已被省略。
```
