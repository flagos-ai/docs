# 使用 TLE-CPU

本节介绍如何使用 TLE-CPU。TLE-CPU 在 trition_3.3.x 分支上可用。

TLE-CPU 提供统一的编程范式，覆盖多样化的边缘端 CPU 算力。将 TLE "在 `@triton.jit` 之上分层硬件深度优化"的理念扩展到 CPU。针对边缘 AI 碎片化的 CPU 生态（Arm64 / RISC-V / x86，多种 ISA 并存），使用相同的 Triton 编程模型和集成框架来支持不同的 ISA：编程模型和正确性跨 ISA 共享（普通 Triton 通过 LLVM 落到任意 ISA），而每个 ISA 的高性能实现（intrinsic / C 运行时）则分别贡献。模型代码通过算子库（FlagGems）的 vendor 分发路由到对应的 ISA 实现，无需感知具体 ISA。CPU 与 GPU 的差异决定了它需要一个独立的扩展面：

| 维度 | GPU（参考） | CPU |
|---|---|---|
| 并行单元 | SIMT / Block | OMP 线程 + SIMD 向量（两级） |
| 内存层级 | 显式共享内存 | 缓存隐式管理，通过分块 + 权重重排优化 |
| 主战场 | 大 batch 吞吐为主 | batch=1 解码（边缘端），M=1 GEMV 是热点 |
| 性能关键 | Occupancy / 内存合并 | 指令选择（i8mm/SVE2/BF16）+ 线程调度 |

## 架构概览

```Plain Text
@triton.jit  （Triton 编程模型；可混合使用 TLE 扩展操作和通用算子）
                                │
                    ┌───────────┴────────────┐
            TLE-CPU 扩展操作           Triton 通用算子
            (create_cpu_*)               (tl.load / tl.dot / …)
                    └───────────┬────────────┘
                                ▼
     FlagTree CPU 后端  （编译/分发层；tle_<arch> 插件注入 create_cpu_*）
                                ▼
     flagtree-cpu  （TritonCPU MLIR 方言 + 各 ISA C 运行时 / lowering）
                                ▼
                        LLVM  →  目标 ISA 指令
              （各 ISA lowering 路径参见相应子页面，如 Arm64）
```

- 扩展操作以 builder 方法（`create_cpu_*`）的形式注入 Triton IR 构建器，在编译时 lowering 到 TritonCPU 方言，然后映射到各 ISA 对应的实现（LLVM codegen 或 C 运行时库调用）。各 ISA lowering 路径参见相应[子页面](/user_guide/arm64.md)。

- 算子库层由 FlagGems 处理，按 vendor（如 `arm`）选择 CPU 后端算子集。

- 添加新 ISA = 增量贡献 C 运行时 + 注册扩展操作。

## 支持的 CPU 架构

- Arm64 是首个完整实现的 CPU 后端，可端到端运行 LLM 推理。

- RISC-V (RVV) / x86 (AVX-512) 仍在规划中，将使用相同的 MLIR 和 TLE 路径。

## Arm64 CPU 相关链接

以下是 TLE-CPU 和 Arm64 的相关链接：

- [在 ARM64 CPU 上安装 FlagTree](../getting_started/install-arm64-cpu.md)

- Github 站点：
  - [FlagTree](https://github.com/flagos-ai/FlagTree)（`triton_v3.3.x` 分支包含 `cpu` 后端）

  - [FlagTree-CPU](https://github.com/flagos-ai/flagtree-cpu)

  - [FlagGems](https://github.com/flagos-ai/FlagGems)（`5.3.0-rc2` 版本包含 `_arm` 后端）

关于如何在 Arm64 上使用 TLE-CPU 的更多信息，请参见以下子页面：

```{toctree}
:maxdepth: 1

arm64.md
```
