# FLIR：统一中间层

## 概述

FLIR 是一个多后端统一的中间层，作为将 Triton 扩展中间表示（例如 Hints、Ops 和 TLE）lowering 到硬件特定方言的中心枢纽。当你使用 Hints 和 TLE 特性时，FLIR 特性会自动使用，无需任何用户干预。

## 在编译管线中的位置

下图展示了 FLIR 在编译管线中的位置。

![alt text](../../assets/images/flagtree_position.png)

## 核心能力

| 能力 | 描述 |
|----------|-------------|
| **语言覆盖** | 支持 76 个 Triton 语言原语和 103 个算子。 |
| **内存访问** | - 结构化内存访问：提供统一的 lowering 路径和实现。<br>- 非结构化内存访问：提供有限数量的 lowering 路径。 |
| **张量计算** | NPU 和 DSA 后端分类特化，例如多元归约的不同算法实现。 |
| **硬件生态支持** | - 完全后端特化，例如扩展缓冲区辅助同步和传递硬件特定信息。<br>- 官方支持 AIPU、华为昇腾和清微智能，通过 `third_party/[backend]/backend/compiler.py` 进行标准化后端注册。 |
