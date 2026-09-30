# FlagFFT 发布说明

## v0.2.0

- **新增特性**

  - 支持全部六种变换类型的 rank-2 与 rank-3 变换（C2C、Z2Z、R2C、D2Z、C2R、Z2D）。
  - 素数长度与大尺寸 rank-1 变换加速。
  - 新增 MUSA 与 PPU 后端，构建时通过 `-DBACKEND=MUSA|PPU` 选择。
  - 新增 `flagfft-cli` 基准测试与 plan 检查工具。

- **增强特性**

  - 大尺寸 rank-1 变换的 plan 选择与 mixed-radix/四步算法路径优化。

## v0.1.0

FlagFFT 首次发布。

- **新增功能**

  - 实验性 C++ FFT 库，提供与 cuFFT 风格兼容的 C API。
  - 基于 Triton/TLE 生成的 CUDA 内核，在计划创建时进行 JIT 编译。
  - **一维复数到复数** —— C2C、Z2Z（complex64 和 complex128）。
  - **一维实数到复数** —— R2C、D2Z（float 和 double）。
  - **一维复数到实数** —— C2R、Z2D（float 和 double）。
  - **一维往返** —— R2C+C2R、D2Z+Z2D 往返变换。
  - **二维 FFT** —— C2C、Z2Z、R2C、D2Z、C2R、Z2D 二维变换。
  - 任意长度连续一维批量变换。
  - 融合四步路径支持超大复合长度。
  - Bluestein 回退支持任意一维复数长度。
  - 原生 CLI（`flagfft-cli`）用于基准测试测量和计划检查。
  - 使用 Google Test 和 cuFFT 参考比较的 C++ 测试套件。
  - 基于 pytest 的 Python 基准测试套件，支持性能测量。
  - 统一测试运行器（`tools/run_tests.py`），支持精度和性能报告。
  - 计划描述 API（`flagfftGetPlanDescription`）用于性能调试。
  - 预构建依赖的 Docker 开发环境。
  - 算子注册表（`conf/operators.yaml`），包含完整的算子元数据。
