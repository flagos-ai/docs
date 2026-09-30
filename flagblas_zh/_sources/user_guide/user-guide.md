# FlagBLAS 用户指南

## 使用 FlagBLAS

FlagBLAS 直接与 PyTorch 集成。导入包并对 CUDA 张量调用算子：

```python
import torch
import flag_blas

# 在 CUDA 上创建张量
a = torch.randn(1024, 1024, device='cuda')
b = torch.randn(1024, 1024, device='cuda')

# 矩阵乘法 (GEMM)
c = flag_blas.ops.sgemm(a, b)
```

## 算子列表

完整的算子注册表维护在 [FlagBLAS conf/operators.yaml](https://github.com/flagos-ai/FlagBLAS/blob/master/conf/operators.yaml)。
