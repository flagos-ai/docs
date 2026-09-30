# FlagBLAS User Guide

## Use FlagBLAS

FlagBLAS integrates directly with PyTorch. Import the package and call operators on CUDA tensors:

```python
import torch
import flag_blas

# Create tensors on CUDA
a = torch.randn(1024, 1024, device='cuda')
b = torch.randn(1024, 1024, device='cuda')

# Matrix multiplication (GEMM)
c = flag_blas.ops.sgemm(a, b)
```

## Operator list

The complete operator registry is maintained at [FlagBLAS conf/operators.yaml](https://github.com/flagos-ai/FlagBLAS/blob/master/conf/operators.yaml).
