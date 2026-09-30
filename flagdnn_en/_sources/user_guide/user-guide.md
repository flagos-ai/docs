# FlagDNN User Guide

## Use FlagDNN

FlagDNN integrates directly with PyTorch. Import the package and call operators on CUDA tensors:

```python
import torch
import flag_dnn

# Create a tensor on CUDA
x = torch.randn(1024, device='cuda')

# Apply ReLU activation
y = flag_dnn.ops.relu(x)
```

## Operator List

The complete operator registry is maintained at [FlagDNN conf/operators.yaml](https://github.com/flagos-ai/FlagDNN/tree/master/conf).

### Tensor Operations

identity, reshape, transpose, slice, concatenate, gen_index, binary_select, one_hot, embedding

### Neural Network — Activation

relu, gelu, gelu_approx_tanh, silu, swish, leaky_relu, leaky_relu_, prelu, elu, elu_, rrelu, rrelu_, mish, softplus, softsign, softshrink, hardswish, relu6, selu, glu, celu, tanh, sigmoid, sigmoid_backward, logsigmoid, hardtanh, hardtanh_, threshold, threshold_

### Neural Network — Normalization

batch_norm, batchnorm, batchnorm_inference, layernorm, layer_norm, rms_norm, rmsnorm, group_norm

### Neural Network — Softmax

softmax, softmin, log_softmax

### Neural Network — Pooling

max_pool1d, max_pool2d, max_pool3d, avg_pool1d, avg_pool2d, avg_pool3d, adaptive_avg_pool1d, adaptive_avg_pool2d, adaptive_avg_pool3d, adaptive_max_pool1d, adaptive_max_pool2d, adaptive_max_pool3d

### Neural Network — Convolution

conv1d, conv2d, conv3d, conv_fprop, conv_dgrad, conv_wgrad, causal_conv1d

### Neural Network — Attention

sdpa, sdpa_backward

### Neural Network — Other

interpolate

### Math — Unary

sqrt, abs, neg, clamp, isinf, isnan, square, rsqrt, positive, log, exp, bitwise_not, ceil, floor, reciprocal, sin, cos, tan, erf

### Math — Binary

add, sub, mul, div, pow, mod, max, min, scale, eq, ne, lt, le, gt, ge, minimum, maximum, fmin, fmax

### Math — Comparison

cmp_eq, cmp_neq, cmp_lt, cmp_le, cmp_gt, cmp_ge

### Math — Bitwise

bitwise_and, bitwise_or, bitwise_xor

### Math — Logical

logical_and, logical_or, logical_not

### Linear Algebra

mv, mm, matmul, dot

### Reduction

sum, mean, prod, reduction, cumsum, cumprod, cummin, cummax, any, all

### Loss

kl_div, mse_loss, l1_loss

### Fused

add_square, rmsnorm_rht_amax
