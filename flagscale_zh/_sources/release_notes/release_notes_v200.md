# FlagScale v2.0.0 发布说明

## 亮点

- **DeepSeek V4 与 Qwen3.5 支持** —— 支持 DeepSeek V4 训练及 Engram 优化，并新增 Qwen35 模型。
- **Megatron-LM Core 0.17.0 升级** —— FlagScale Train 同步上游 Megatron-LM Core 0.17.0，新增 `--mg-fl-prefer` 参数用于 Megatron-LM-FL 厂商选择。
- **FSDP2 checkpoint 恢复** —— 训练支持从 FSDP2 checkpoint 恢复。
- **机器人方向** —— 提供 `flagscale eval robo` CLI；qwen_gr00t 的训练与推理现已支持昇腾与 MUSA 平台。
