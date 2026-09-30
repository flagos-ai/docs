# FlagDNN 发布说明

## v0.3.0

- **新增特性**

  - 新增硬件后端：昇腾、海光 DCU、摩尔线程（MUSA）与 Iluvatar，并更新平头哥后端。
  - 新增卷积算子：`conv_dgrad`、`conv_wgrad`。

- **增强特性**

  - 长序列 causal SDPA 性能优化，包含 causal d128 反向路径。
  - 卷积、matmul、归一化与 binary 类算子的性能调优。

## v0.2.0

- **新增功能**

  - **图执行引擎** —— 新增图模式执行路径，支持 IR 捕获、内核融合、自动调优和多节点规划。支持图级算子调度和内存优化。
  - **神经网络算子** —— conv1d, conv2d, conv3d, conv_fprop, conv_dgrad, conv_wgrad, causal_conv1d, max_pool2d, max_pool3d, avg_pool1d, avg_pool2d, avg_pool3d, adaptive_avg_pool2d, adaptive_avg_pool3d, adaptive_max_pool2d, adaptive_max_pool3d, gelu_approx_tanh, silu, swish, leaky_relu, leaky_relu_, prelu, elu, elu_, rrelu, rrelu_, mish, softplus, softsign, softshrink, softmin, log_softmax, hardswish, relu6, selu, glu, celu, tanh, sigmoid, sigmoid_backward, logsigmoid, hardtanh, hardtanh_, threshold, threshold_。
  - **归一化算子** —— batchnorm, batchnorm_inference, layernorm, rmsnorm, group_norm。
  - **线性代数算子** —— mm, mv, dot, matmul。
  - **数学算子** —— exp, log, rsqrt, square, positive, isinf, isnan, max, min, scale, ge, gt, le, lt, maximum, minimum, fmax, fmin, bitwise_and, bitwise_or, bitwise_xor, bitwise_not, logical_and, logical_or, logical_not, unary。
  - **归约算子** —— cummin, cummax, any, all, reduction。
  - **损失算子** —— kl_div, mse_loss, l1_loss。
  - **张量算子** —— embedding, one_hot, concatenate, gen_index, identity, reshape, slice, transpose, binary_select。
  - **融合算子** —— add_square, rmsnorm_rht_amax。
  - **其他算子** —— interpolate。
  - **注意力算子** —— sdpa, sdpa_backward（图模式）。
  - **Iluvatar 后端** —— 新增 Iluvatar GPU 后端支持，包含启发式配置和算子黑名单。
  - **算子注册表** —— 新增 `conf/operators.yaml` 用于标准化算子元数据。
  - **图模式基准测试套件** —— 为图模式算子提供全面的基准测试框架。

- **增强功能**

  - Eager 模式算子经过深度性能调优和框架重构。
  - Triton 内核启动模式优化，减少开销。
  - 基准测试框架统一，采用标准化的 shape 配置。

## v0.1.0

FlagDNN 初始版本。

- **新增功能**

  - 支持多后端的深度神经网络计算库。
  - ReLU 算子，使用 Triton 内核实现。
  - 灵活的多后端支持机制。
  - 通过 `flag_dnn.ops` API 实现 PyTorch 集成。
