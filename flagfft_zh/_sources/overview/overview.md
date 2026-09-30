# FlagFFT 概览

FlagFFT 是一个实验性的 C++ FFT 库，提供与 cuFFT 风格兼容的 API 以及基于 Triton/TLE 生成的 CUDA 内核。公开的运行时接口为 C 语言；Python 仅用于 Triton/TLE JIT 源码生成（内部代码生成）。

FlagFFT 是 [FlagOS](https://flagos.io/) 生态系统的组成部分，为科学计算、信号处理和机器学习工作负载提供高性能 FFT 计算。

## 特性

- **cuFFT 风格 API** —— 为从 cuFFT 迁移的开发者提供熟悉的计划创建和执行接口。
- **JIT 内核编译** —— 内核在计划创建时通过 Triton/TLE 生成，消除执行时的 Python 编译延迟。
- **任意长度的一维和二维变换** —— 通过融合四步路径支持任意复合长度，包括超大尺寸（如 n = 2^23），无需回退到 Bluestein。二维 FFT 支持全部六种变换类型。
- **多种变换类型** —— C2C、Z2Z（复数），R2C、D2Z、C2R、Z2D（实数到复数及其逆变换）。
- **计划描述** —— `flagfftGetPlanDescription` 返回计划节点树、内核名称和编译详情的详细信息，用于性能调试。
- **原生 CLI** —— `flagfft-cli` 提供基准测试测量和计划检查功能，无需 Python 开销。

## 架构

### C++ 运行时

| 模块 | 描述 |
|---|---|
| `include/flagfft.h` | cuFFT 风格的不透明句柄 API，后端中立的 `flagfftStream_t` |
| `src/exec/` | `flagfftHandle` 生命周期、计划创建、流状态、计划缓存、原始指针执行调度 |
| `src/plan/` | 将 `FFTRequest` 映射为 `PlanNode` 树 —— 节点、因子分解、成本、自动候选、调优候选 |
| `src/codegen/` | 在计划创建期间调用 Python Triton/TLE 源码生成，通过 libtriton_jit 编译 |
| `python/flagfft_codegen/` | 可通过 pip 安装的源码生成器和绑定的 codelet |
| `src/adaptor/` | 设备分配、流/事件操作、目标标识、能力查询（CUDA Driver 后端） |
| `src/utils/` | 共享的请求/键工具、JSON/SQLite 调优支持 |

### 原始执行节点

- `CompiledRawLeafNode` —— 使用计划拥有的旋转因子和 DFT 表分配启动连续叶子内核。
- `CompiledRawFourStepFusedNode` —— 带有行和列叶子子节点的四步路径，拥有旋转因子和中间缓冲区。
- `CompiledRawBluesteinNode` —— 通过 JIT 准备、逐点、最终化和卷积 FFT 子内核处理质数和复杂复合长度。
- `CompiledRaw2DNode` —— 连续复数二维计划，采用 RTRT 路径（行 FFT → 分块转置 → 行 FFT → 分块转置回）。

### CLI 工具

`src/cli_tools/common/` 拥有 `CaseSpec`、确定性缓冲区生成、FlagFFT/cuFFT 调度和比较。cuFFT 仅在 CLI 中用作 CUDA 验证/性能基准。

- `bench` —— 在预热和计时前将 FlagFFT 和 cuFFT 参考计划绑定到一个适配器流。
- `tune` —— 占位符；退出并返回 `FLAGFFT_NOT_SUPPORTED`。

### 构建选项

| 选项 | 默认值 | 描述 |
|---|---|---|
| `FLAGFFT_BUILD_CLI` | `OFF` | 构建 `flagfft-cli` 及其 cuFFT 依赖 |
| `FLAGFFT_BUILD_TESTS` | `OFF` | 构建 `ctest/` 下的 Google Test 目标 |
| `BACKEND` | `CUDA` | GPU 后端选择器（目前仅支持 `CUDA`） |

### Python 边界

原生运行时调用 `python -m flagfft_codegen.jit_source`；所选的 Python 环境必须提供兼容的 Triton/TLE 依赖。生成的 JIT 源码/元数据存放在可执行文件旁边的 `.flagfft` 中。

### 测试

- `ctest/` —— 所有算子的 Google Test 精度测试。
- `tools/run_tests.py` —— 统一测试运行器，协调多 GPU 的精度和性能测试。
- `tests/python/` —— 代码生成测试。

## 工作流程

1. 使用 `flagfftPlan1d`（或 `flagfftPlanMany` 用于批量变换）创建 FFT 计划。
2. 可选地使用 `flagfftSetStream` 附加 CUDA 流。
3. 使用 `flagfftExec*` 函数执行变换。
4. 使用 `flagfftDestroy` 销毁计划。
