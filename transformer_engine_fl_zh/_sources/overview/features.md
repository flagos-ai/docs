# 特性

## 多后端架构

TransformerEngine-FL 引入了三层基于插件的算子调度系统，实现芯片无关的 FP8 训练和推理：

- **FlagOS 后端**（默认）— 使用 [FlagGems](https://github.com/flagos-ai/FlagGems) 进行统一算子调度，使用 [FlagCX](https://github.com/flagos-ai/FlagCX) 进行通信。在所有支持的硬件平台上提供基于 Triton 的优化内核。
- **Reference 后端** — 纯 PyTorch 实现，作为正确性验证和没有优化内核的平台的回退方案。
- **Vendor 后端** — 硬件特定的实现，利用供应商提供的库和自定义内核，在每个平台上实现最佳性能。

调度系统（`OpRegistry`、`OpManager`、`SelectionPolicy`）根据检测到的硬件、策略配置和运行时可用性自动选择最佳可用实现。

## 多供应商硬件支持

TransformerEngine-FL 通过插件系统支持跨多个硬件供应商的 FP8 训练和推理。新的供应商后端可以通过插件发现机制添加，无需修改核心代码。

## FP8 训练与推理

- 易于使用的模块，用于在 NVIDIA Hopper、Ada 和 Blackwell GPU 上构建支持 FP8 的 Transformer 层
- 针对注意力、归一化、激活、GEMM 等优化的融合内核
- 多精度支持：NVIDIA Ampere 架构及更高版本上的 FP8、FP16、BF16

## 框架支持

- PyTorch 和 JAX 集成
- 支持 Megatron-LM、NeMo、DeepSpeed、HF Accelerate、Lightning 等

## FP8 收敛性

FP8 已在不同模型架构和配置上进行了广泛测试，我们发现 FP8 和 BF16 训练损失曲线之间**没有显著差异**。FP8 在下游 LLM 任务（例如 LAMBADA 和 WikiText）上的准确性也已得到验证。

已验证的模型：T5（770M、11B）、MPT（1.3B、13B）、GPT（5B、22B、175B）、LLama2（7B、70B）。
