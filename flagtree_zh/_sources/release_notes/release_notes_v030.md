# FlagTree 0.3.0 发布

## 亮点

FlagTree 继承前一版本的能力，持续集成新后端，并强化生态矩阵。项目目前处于早期阶段，旨在兼容现有各芯片后端的适配方案，统一代码仓库，打造代码共建平台，快速实现单仓库多后端支持。同时，持续开发统一编程接口扩展，构建中间层表示与转换扩展（FLIR），增强硬件感知和编译引导支持的能力与范围（flagtree_hints）。

## 新特性

* 新增多后端支持

目前支持的后端包括 triton_shared cpu、iluvatar、xpu (klx)、mthreads、metax、aipu(arm npu)、ascend npu & cpu、tsingmicro、cambricon、__hcu__，其中 __粗体__ 表示新增。<br>
每个新后端均保持前一版本的能力：跨平台编译与快速验证、基于插件的高差异模块、CI/CD 和质量管理能力。<br>

* 持续对接上游生态

感谢合作伙伴的技术支持，FlagTree 新增了对 Paddle 框架、OpenAnolis 操作系统和北京超级云计算中心的兼容。

* FLIR 持续开发

持续扩展 DSL、TTIR 扩展、Linalg 中间表示与转换扩展以及 MLIR 扩展，以提供编程灵活性、丰富表达能力并提升转换能力。

* 建立编译引导规范，新增多后端编译统一管理模块

flagtree_hints 为硬件单元映射和编译转换优化选择提供引导，并通过统一模块管理后端引导差异。

* 与 FlagGems 算子库联合共建

与 [FlagGems](https://github.com/FlagOpen/FlagGems) 算子库在版本兼容、后端接口、注册机制和测试修改方面协作，支持相关功能。

## 展望

完善 GPGPU 后端集成，将后端特化与主代码实现解耦，为 FlagTree 的通用扩展和优化奠定工程基础。<br>
力争全面覆盖算子库中的各类实现风格，提升 FLIR 编译完备度以匹配多后端需求，使更多后端能够编译。<br>
flagtree_hints 将继续沿 TritonGPU 和 Linalg 两条编译路径探索不同后端上的算子性能优化潜力。<br>
