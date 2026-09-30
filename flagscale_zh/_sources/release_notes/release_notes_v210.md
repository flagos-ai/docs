# FlagScale v2.1.0 发布说明

## 亮点

- **新模型支持** —— 新增 GLM5 与 Qwen36 LLM 主干训练支持（含 checkpoint 转换）、KERV 训练与推理集成、qwen_gr00t 的 Orca 模型新特性，以及 DeepSeek-V4 的 TFLOPs 统计。
- **多平台训练** —— MegatronAdaptor FlagScale 模块在昇腾上原生集成，并新增清微 TXDA 后端；Qwen3 训练已在下列平台完成端到端验证。
- **可观测性** —— 性能监控集成、straggler 检测、低开销 GPU 进度心跳监控，以及 profiler kernel 报告。
- **训练引擎升级** —— 升级至 Megatron v0.18.2，采用新的 Override 机制。

## 多平台验证

与 Megatron-LM-FL v0.3.0、TransformerEngine-FL v0.3.0 一起完成端到端验证：

| 平台 | FlagTree 后端 | 可见设备环境变量 | 已验证内容 |
|------|---------------|------------------|------------|
| 沐曦 MetaX | `metax` | `MACA_VISIBLE_DEVICES` | Qwen3 训练，八卡 |
| 海光 Hygon | `hcu` | `HIP_VISIBLE_DEVICES` | Qwen3 训练，单机 |
| 昇腾 Ascend | `ascend` | `ASCEND_RT_VISIBLE_DEVICES` | Qwen3 训练，单卡与多卡 |
| 平头哥 PPU | `ppu` | `CUDA_VISIBLE_DEVICES` | Qwen3 训练，八卡，已启用 FlagOS 算子栈 |

分步操作请参见[多平台训练与测试](../getting_started/multi-platform-training.md)。
