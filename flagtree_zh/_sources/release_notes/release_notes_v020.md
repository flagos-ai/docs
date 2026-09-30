# FlagTree 0.2.0 发布

## 亮点

FlagTree 继承前一版本的能力，持续集成新后端，扩展 Triton 版本支持，并提供硬件感知优化能力。项目目前处于早期阶段，旨在兼容现有各 AI 芯片后端的适配方案，统一代码仓库，构建代码共建平台，快速实现单仓库多后端支持。

## 新特性

* 新增多后端支持

目前支持的后端包括 triton_shared cpu、iluvatar、xpu (klx)、mthreads、__metax__、__aipu__(arm npu)、__ascend__ npu & cpu、__tsingmicro__、cambricon，其中 __粗体__ 表示新增。<br>
每个新后端均保持前一版本的能力：跨平台编译与快速验证、基于插件的高差异模块、CI/CD 和质量管理能力。<br>
与后端厂商联合开发中间件层的通用扩展，并开源标准化的 PyTorch 后端扩展，以支持 Triton / FlagTree 实践。<br>

* 双编译路径支持

支持 TritonGPU 和 Linalg 编译路径。为非 GPGPU 后端提供多种集成范式，新增 FLIR 仓库支持 Linalg 方言扩展和后端编译的 MLIR 扩展。

* 新增 Triton 版本支持

目前支持的 Triton 版本包括 3.0.x、3.1.x、__3.2.x__、__3.3.x__，其中 __粗体__ 表示新增。

* 硬件感知优化支持

支持为后端通用或特定硬件特性提供引导式编程接口。通过兼容扩展，在前端添加引导信息，为算子编写和性能调优提供灵活性。

* 与 FlagGems 算子库联合共建

与 [FlagGems](https://github.com/FlagOpen/FlagGems) 算子库协作，在版本适配、后端接口、注册机制和测试修改方面支持相关功能。

## 展望

GPGPU 后端代码将被整合，将后端差异化变更与 TritonGPU 解耦；非 GPGPU 后端将在 FLIR 基础上进行横向整合，统一设计通用 pass。<br>
为后端厂商提供 Triton 适配版本升级指南：3.0 -> 3.1 -> 3.2 -> 3.3。<br>
CI/CD 将新增 FlagGems 算子库功能测试。<br>
集成 C++ Runtime 功能，降低 kernel 之外的运行时开销，使其与 CUDA 持平。<br>
