# 特性

## 插件系统

Megatron-LM-FL 引入了基于插件的架构，无需修改上游代码即可实现平台特定的实现：

- **`@overridable`** — 将 `megatron.core` 中的方法或函数标记为可被插件替换
- **`@override`** — 注册替换 `@overridable` 目标的插件实现
- **多供应商调度** — 通过 `MG_FL_PREFER` 环境变量进行运行时供应商选择，四级回退：首选供应商 → 默认供应商 → 唯一供应商 → 无

## 多平台支持

通过 `PlatformBase` 进行硬件抽象，支持多个平台的实现：

- **NVIDIA** — CUDA GPU（默认，完整功能支持）
- **MetaX** — MetaX GPU
- **Moore Threads** — MUSA GPU
- **TXDA** — Tsingmicro GPU
- **NPU** — Ascend NPU

## DeepSeek V4 支持

完整的 DeepSeek V4 架构训练支持（CSA/HCA、Hash Router、mHC、Engram、MTP）。

## 上游兼容性

- 保留完整的上游 Megatron-LM 功能
- Core 0.17.0 同步，包含 FlagScale 特定补丁（engram、异构流水线、平台插件）
- 高级并行策略：TP、PP、DP、EP、CP
- 混合精度：FP16、BF16、FP8
- GPU 优化内核

## CI/CD

- 多平台单元和功能测试（CUDA + MetaX）
- Qwen3 基准测试门禁，使用 A100 黄金值
- Lint 门禁：pylint >= 9.0
- 向 FlagCICD 平台上报覆盖率
