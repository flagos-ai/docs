# FlagDNN Release Notes

## v0.3.0

- **Added Features**

  - New hardware backends: Ascend, Hygon DCU, Moore Threads (MUSA) and Iluvatar, plus an updated T-Head backend.
  - New convolution operators: `conv_dgrad` and `conv_wgrad`.

- **Enhanced Features**

  - Long-context causal SDPA performance, including the causal d128 backward path.
  - Performance tuning across convolution, matmul, normalization and binary operators.

## v0.2.0

- **Added Features**

  - **Graph Execution Engine** — New graph-mode execution path with IR capture, kernel fusion, auto-tuning, and multi-node planning. Supports graph-level operator dispatch and memory optimization.
  - **Neural Network Operators** — conv1d, conv2d, conv3d, conv_fprop, conv_dgrad, conv_wgrad, causal_conv1d, max_pool2d, max_pool3d, avg_pool1d, avg_pool2d, avg_pool3d, adaptive_avg_pool2d, adaptive_avg_pool3d, adaptive_max_pool2d, adaptive_max_pool3d, gelu_approx_tanh, silu, swish, leaky_relu, leaky_relu_, prelu, elu, elu_, rrelu, rrelu_, mish, softplus, softsign, softshrink, softmin, log_softmax, hardswish, relu6, selu, glu, celu, tanh, sigmoid, sigmoid_backward, logsigmoid, hardtanh, hardtanh_, threshold, threshold_.
  - **Normalization Operators** — batchnorm, batchnorm_inference, layernorm, rmsnorm, group_norm.
  - **Linear Algebra Operators** — mm, mv, dot, matmul.
  - **Math Operators** — exp, log, rsqrt, square, positive, isinf, isnan, max, min, scale, ge, gt, le, lt, maximum, minimum, fmax, fmin, bitwise_and, bitwise_or, bitwise_xor, bitwise_not, logical_and, logical_or, logical_not, unary.
  - **Reduction Operators** — cummin, cummax, any, all, reduction.
  - **Loss Operators** — kl_div, mse_loss, l1_loss.
  - **Tensor Operators** — embedding, one_hot, concatenate, gen_index, identity, reshape, slice, transpose, binary_select.
  - **Fused Operators** — add_square, rmsnorm_rht_amax.
  - **Other Operators** — interpolate.
  - **Attention Operators** — sdpa, sdpa_backward (graph mode).
  - **Iluvatar Backend** — Added Iluvatar GPU backend support with heuristics config and op blacklist.
  - **Operator Registry** — Added `conf/operators.yaml` for standardized operator metadata.
  - **Graph Benchmark Suite** — Comprehensive benchmark framework for graph-mode operators.

- **Enhanced Features**

  - Eager-mode operators underwent deep performance tuning and framework restructuring.
  - Triton kernel launch patterns optimized to reduce overhead.
  - Benchmark framework unified with standardized shape configurations.

## v0.1.0

Initial release of FlagDNN.

- **Added Features**

  - Deep neural network computing library with multi-backend support.
  - ReLU operator with Triton kernel implementation.
  - Flexible multi-backend support mechanism.
  - PyTorch integration via `flag_dnn.ops` API.

