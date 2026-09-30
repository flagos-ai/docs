# FlagSparse 发布说明

## v0.3.0

- **新增特性**

  - 新增稀疏算子与格式：SpMM CSR 扩展、col-major 与 COO 优化变体、SpMM CSC/BSR、SpMV CSC/BSR 及 BSR 优化变体、SpSV SELL。
  - 后端覆盖扩展至海光 DCU、MetaX（MACA）、摩尔线程（MUSA）与昇腾（CANN），可通过环境变量选择后端。

- **增强特性**

  - SpMV CSR、SpGEMM 与 SDDMM 性能优化。

## v0.2.0

- **新增功能**

  - **SpMM 算子** —— SpMM COO、SpMM CSR-opt、SpMM CSR-opt-alg2、AlphaSparse SpMM alg1（含 TLE 和 TLE-opt 变体）。
    - 在 NVIDIA 上支持。
  - **SpGEMM 算子** —— CSR 输入的稀疏矩阵-稀疏矩阵乘法。
    - 在 NVIDIA 上支持。
  - **SDDMM 算子** —— 基于 CSR 稀疏模式的采样稠密-稠密矩阵乘法。
    - 在 NVIDIA 上支持。
  - **SpSM 算子** —— 带稠密矩阵右侧的稀疏三角求解（CSR 和 COO）。
    - 在 NVIDIA 上支持。
  - **SpSV 描述符 API** —— 完整的描述符、缓冲区大小、分析、预处理和求解 API，用于 SpSV 工作流。
    - 在 NVIDIA 上支持。
  - **稀疏格式构造函数** —— create_csr_matrix、create_coo_matrix、create_csc_matrix、create_bsr_matrix、create_sell_matrix、create_blocked_ell_matrix、coo_to_csr、coo_to_csc、coo_to_bsr、coo_to_sell、coo_to_blocked_ell、generate_random_sparse_matrix、read_mtx_file。
    - 在 NVIDIA 上支持。
  - **算子注册表** —— 添加了 `conf/operators.yaml`，包含完整的算子元数据。
    - 在 NVIDIA 上支持。
  - **CI/CD 流水线** —— GPU CI 工作流、每夜 CPU 检查、发布草稿器、pre-commit 配置。
    - 在 NVIDIA 上支持。

- **增强功能**

  - SpMV CSR 和 COO 算子经过显著优化和精度改进。
  - SpSV CSR 和 COO 求解器扩展了全面的测试覆盖和基于描述符的 API。
  - Gather/Scatter 算子增强了 int64 支持。
  - 基准测试框架统一，具有标准化的形状配置。
  - pytest 精度套件扩展，为所有算子添加了专用测试文件。

## v0.1.0

FlagSparse 首次发布。

- **新增功能**

  - GPU 稀疏运算包，包含 SpMV、SpMM、SpGEMM、SDDMM、gather 和 scatter 算子。
  - CSR 和 COO 稀疏格式支持。
  - SpSV 和 SpSM 三角求解算子。
  - FlagGems 风格的算子接口注册表（`conf/operators.yaml`）。
  - 基于 CPU-FP64 金标准参考比较的 pytest 精度套件。
  - 具有两级加速比报告的性能基准测试框架。
