# 运行测试和基准测试

## 算子测试运行器

```bash
python run_flagsparse_accuracy.py --list-ops
python run_flagsparse_accuracy.py --mode quick --gpus 0
python run_flagsparse_performance.py --ops spmv_csr,spmm_csr --benchmark-input matrix --benchmark-warmup 5 --benchmark-iters 20
python run_flagsparse_pytest.py --phase both --mode quick --gpus 0 --benchmark-input matrix --results-dir pytest_results
```

## 直接 pytest 精度套件

```bash
pytest tests/pytest --mode quick
pytest tests/pytest --mode normal -m "spmv_csr or spmm_csr"
```

## 独立测试脚本

### test_gather.py / test_scatter.py —— gather/scatter 基准测试

```bash
python tests/test_gather.py --csv-summary gather_summary.csv
python tests/test_scatter.py --csv-summary scatter_summary.csv
```

### test_spmv.py —— CSR SpMV

```bash
python tests/test_spmv.py <dir_or_file.mtx>
python tests/test_spmv.py --synthetic
python tests/test_spmv.py <dir/> --csv-csr results.csv
```

### test_spmv_coo.py —— COO SpMV

```bash
python tests/test_spmv_coo.py <dir_or_file.mtx>
python tests/test_spmv_coo.py --synthetic
python tests/test_spmv_coo.py <dir/> --csv-csr results.csv
```

### test_spmm.py —— CSR SpMM

```bash
python tests/test_spmm.py <dir_or_file.mtx>
python tests/test_spmm.py --synthetic
python tests/test_spmm.py <dir/> --csv results.csv
```

### test_spmm_coo.py —— COO SpMM

```bash
python tests/test_spmm_coo.py <dir_or_file.mtx>
python tests/test_spmm_coo.py --synthetic
python tests/test_spmm_coo.py <dir/> --csv results.csv
```

### test_sddmm.py —— CSR SDDMM

```bash
python tests/test_sddmm.py <dir_or_file.mtx> --k 64
python tests/test_sddmm.py <dir/> --csv out.csv
```

### test_spgemm.py —— CSR SpGEMM

```bash
python tests/test_spgemm.py <dir_or_file.mtx> --input-mode auto
python tests/test_spgemm.py <dir/> --csv results.csv
```

### test_spsv.py —— SpSV（三角求解）

```bash
python tests/test_spsv.py --synthetic
python tests/test_spsv.py <dir/> --csv-csr spsv.csv
```

### test_spsm.py —— SpSM（三角矩阵-矩阵求解）

```bash
python tests/test_spsm.py --synthetic --n 512 --rhs 1024
python tests/test_spsm.py <dir/> --csv-csr spsm_csr.csv --rhs 1024
```

## CI/CD

- `.github/workflows/ci.yml` —— 仅 CPU：编译、格式检查、lint、构建、安装、冒烟测试。
- `.github/workflows/gpu-ci.yml` —— 手动 GPU 精度冒烟（自托管运行器）。
- `.github/workflows/gpu-benchmark.yml` —— 手动 GPU 基准测试（自托管运行器）。
- `.github/workflows/release.yml` —— 在 `v*` 标签上构建源码和 wheel 工件。
- `.github/workflows/nightly-cpu.yml` —— 仅 main 分支的每夜 CPU 检查，重复包、lint 和共享运行时冒烟测试。
- `.github/workflows/triton-smoke.yml` —— triton 依赖冒烟检查的手动选择加入作业。
- `.github/workflows/release-drafter.yml` —— 从合并的 PR 中保持草稿发布说明最新。
- `.github/workflows/build-deb.yml` —— 在 `v*` 标签或打包路径 PR 更改时构建 Debian 包。
- `.github/workflows/build-rpm.yml` —— 在 `v*` 标签或打包路径 PR 更改时构建 RPM 包。
