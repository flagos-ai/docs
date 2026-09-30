# FlagDNN 用户指南

## 使用 FlagDNN

FlagDNN 直接与 PyTorch 集成。导入包并对 CUDA 张量调用算子：

```python
import torch
import flag_dnn

# 在 CUDA 上创建张量
x = torch.randn(1024, device='cuda')

# 应用 ReLU 激活
y = flag_dnn.ops.relu(x)
```

## 算子列表

完整的算子注册表维护在 [FlagDNN conf/operators.yaml](https://github.com/flagos-ai/FlagDNN/tree/master/conf)。

### 张量操作

identity, reshape, transpose, slice, concatenate, gen_index, binary_select, one_hot, embedding

### 神经网络 — 激活

relu, gelu, gelu_approx_tanh, silu, swish, leaky_relu, leaky_relu_, prelu, elu, elu_, rrelu, rrelu_, mish, softplus, softsign, softshrink, hardswish, relu6, selu, glu, celu, tanh, sigmoid, sigmoid_backward, logsigmoid, hardtanh, hardtanh_, threshold, threshold_

### 神经网络 — 归一化

batch_norm, batchnorm, batchnorm_inference, layernorm, layer_norm, rms_norm, rmsnorm, group_norm

### 神经网络 — Softmax

softmax, softmin, log_softmax

### 神经网络 — 池化

max_pool1d, max_pool2d, max_pool3d, avg_pool1d, avg_pool2d, avg_pool3d, adaptive_avg_pool1d, adaptive_avg_pool2d, adaptive_avg_pool3d, adaptive_max_pool1d, adaptive_max_pool2d, adaptive_max_pool3d

### 神经网络 — 卷积

conv1d, conv2d, conv3d, conv_fprop, conv_dgrad, conv_wgrad, causal_conv1d

### 神经网络 — 注意力

sdpa, sdpa_backward

### 神经网络 — 其他

interpolate

### 数学 — 一元

sqrt, abs, neg, clamp, isinf, isnan, square, rsqrt, positive, log, exp, bitwise_not, ceil, floor, reciprocal, sin, cos, tan, erf

### 数学 — 二元

add, sub, mul, div, pow, mod, max, min, scale, eq, ne, lt, le, gt, ge, minimum, maximum, fmin, fmax

### 数学 — 比较

cmp_eq, cmp_neq, cmp_lt, cmp_le, cmp_gt, cmp_ge

### 数学 — 位运算

bitwise_and, bitwise_or, bitwise_xor

### 数学 — 逻辑

logical_and, logical_or, logical_not

### 线性代数

mv, mm, matmul, dot

### 归约

sum, mean, prod, reduction, cumsum, cumprod, cummin, cummax, any, all

### 损失

kl_div, mse_loss, l1_loss

### 融合算子

add_square, rmsnorm_rht_amax
