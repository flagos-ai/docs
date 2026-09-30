# FlagSparse Overview

FlagSparse is part of [FlagOS](https://flagos.io/). FlagSparse is a computing library that provides sparse matrix operations and is oriented towards multiple chip backends. It defines core sparse operations such as SpMV, SpMM, SpGEMM, and SDDMM, supporting high-performance computing in fields such as scientific computing, engineering simulation, machine learning, and artificial intelligence.

FlagSparse is a high-performance sparse operator library implemented using the [Triton programming language](https://github.com/triton-lang/triton) launched by OpenAI.

## Operators

The complete operator registry is maintained at [FlagSparse conf/operators.yaml](https://github.com/flagos-ai/FlagSparse/blob/main/conf/operators.yaml).

| Operator | Description | Formats |
|----------|-------------|---------|
| Gather | Gather values from dense tensor by index | -- |
| Scatter | Scatter values into dense tensor by index | -- |
| SpMV | Sparse matrix-vector multiplication | CSR, COO, COO-to-CSR |
| SpMM | Sparse matrix-dense matrix multiplication | CSR, COO, CSR-opt, CSR-opt-alg1, CSR-opt-alg2, AlphaSparse-alg1 |
| SpGEMM | Sparse matrix-matrix multiplication | CSR |
| SDDMM | Sampled Dense-Dense Matrix Multiplication | CSR |
| SpSV | Sparse triangular solve (vector) | CSR, COO |
| SpSM | Sparse triangular solve (matrix) | CSR, COO |

### Sparse Format Constructors

create_csr_matrix, create_coo_matrix, create_csc_matrix, create_bsr_matrix, create_sell_matrix, create_blocked_ell_matrix, coo_to_csr, coo_to_csc, coo_to_bsr, coo_to_sell, coo_to_blocked_ell, generate_random_sparse_matrix, read_mtx_file

## Sparse Formats

- **CSR** (Compressed Sparse Row) -- Standard format for row-oriented sparse operations.
- **COO** (Coordinate format) -- Triples of (row, column, value).

## Architecture

- `src/flagsparse/` -- Core package.
- `tests/` -- Pytest accuracy tests and benchmarks.
- `benchmark/` -- Performance benchmarks.
