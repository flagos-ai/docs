# 发布说明

<!-- NEW in v0.2.0 -->
## v0.2.0

本次发布扩展了 sglang-plugin-FL 的调度、平台配置和运行时配置能力，完成了从 `v0.1.0` 到 `v0.2.0` 的演进。

- 新增功能
  - 通过 `sglang_fl/dispatch/config/` 下的平台 YAML 默认配置扩展平台配置。
  - 扩展调度策略控制，包括全局后端偏好、逐算子后端顺序、厂商允许/拒绝过滤、严格模式、回退行为以及调度缓存失效。
  - 为厂商特定运行时栈提供空模式安装与运行时组装边界。空模式不是无设备模式；目标平台仍需提供厂商 torch、驱动、固件、设备运行时、通信库以及插件未覆盖的算子。
  - 提供多节点和流水线并行推理示例、Qwen3.6 MTP 工作流覆盖以及吞吐量基准测试基础设施。

- 文档范围

  - 厂商特定的框架选择、运行时镜像、验证状态、安装命令和适配流程统一在本英文插件文档之外进行维护：[集中式厂商/框架/镜像选择页面](https://flagos.io/resourcedownload?lang=en)。
  - 本文档仅保留通用插件架构、调度配置和工作流形态，不维护完整的厂商支持或镜像矩阵。
<!-- END NEW -->

## v0.1.0


sglang-plugin-FL 初始版本。

- 新增功能

  - SGLang 的三层算子替换架构：
    - **第一层**：通过 FlagGems Triton 内核进行 ATen 算子替换
    - **第二层**：SGLang 融合内核调度（SiluAndMul、RMSNorm、RotaryEmbedding）
    - **第三层**：通过 CommunicatorFL（FlagCX / torch.distributed）进行分布式通信
  - 使用 SGLang entry_points 的非侵入式插件架构
  - 逐算子后端选择，支持自动回退
  - YAML 配置和环境变量控制
  - 桥接层将框架特定参数与标准化算子签名解耦
  - 厂商自动发现机制——同一后端可同时用于 sglang-plugin-FL 和 vllm-plugin-FL
  - 支持 NVIDIA CUDA、华为昇腾，并可扩展到其他硬件
  - 已验证模型：Qwen3.6-27B、Qwen3.6-35B-A3B、Qwen2.5-14B-Instruct
  - 调度日志和 ATen 替换日志用于调试
  - 用于数值调试的精度二分法工作流
