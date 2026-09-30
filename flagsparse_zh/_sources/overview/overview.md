# FlagSparse 概览

FlagSparse 是 [FlagOS](https://flagos.io/) 的组成部分。FlagSparse 是一个面向多芯片后端的稀疏矩阵运算库，定义了 SpMV、SpMM、SpGEMM、SDDMM 等核心稀疏操作，支持科学计算、工程仿真、机器学习和人工智能等领域的高性能计算。

FlagSparse 是使用 OpenAI 推出的 [Triton 编程语言](https://github.com/triton-lang/triton) 实现的高性能稀疏算子库。

## 算子

完整的算子注册表维护在 [FlagSparse conf/operators.yaml](https://github.com/flagos-ai/FlagSparse/blob/main/conf/operators.yaml)。

| 算子 | 描述 | 格式 |
|----------|-------------|---------|
| Gather | 按索引从稠密张量中收集值 | -- |
| Scatter | 按索引将值散布到稠密张量中 | -- |
| SpMV | 稀疏矩阵-向量乘法 | CSR、COO、COO-to-CSR |
| SpMM | 稀疏矩阵-稠密矩阵乘法 | CSR、COO、CSR-opt、CSR-opt-alg1、CSR-opt-alg2、AlphaSparse-alg1 |
| SpGEMM | 稀疏矩阵-稀疏矩阵乘法 | CSR |
| SDDMM | 采样稠密-稠密矩阵乘法 | CSR |
| SpSV | 稀疏三角求解（向量） | CSR、COO |
| SpSM | 稀疏三角求解（矩阵） | CSR、COO |

### 稀疏格式构造函数

create_csr_matrix、create_coo_matrix、create_csc_matrix、create_bsr_matrix、create_sell_matrix、create_blocked_ell_matrix、coo_to_csr、coo_to_csc、coo_to_bsr、coo_to_sell、coo_to_blocked_ell、generate_random_sparse_matrix、read_mtx_file

## 稀疏格式

- **CSR**（压缩稀疏行）—— 面向行稀疏操作的标准格式。
- **COO**（坐标格式）—— (行, 列, 值) 三元组。

## 架构

- `src/flagsparse/` —— 核心包。
- `tests/` —— Pytest 精度测试和基准测试。
- `benchmark/` —— 性能基准测试。
