# 特性

FlagScale 提供统一工具集，覆盖大语言模型、多模态模型和具身智能模型的完整生命周期。它在单一配置和 CLI 接口下集成了多个开源后端引擎，支持在不同芯片厂商间一致运行。主要特性包括：

- **统一 CLI**：以单一 `flagscale` 命令作为所有操作的入口——训练、推理、服务和强化学习——提供跨 NVIDIA GPU、昇腾 NPU、MetaX MUSA 等平台的统一多芯片支持。

- **训练**：通过与 Megatron-LM-FL 和 TransformerEngine-FL 协作，全面支持 DeepSeek-V3/V4、Qwen2/2.5/3、Qwen2.5-VL、QwQ、LLaMA2/3/3.1、LLaVA-OneVision/1.5、Mixtral、RWKV、Aquila 等模型的分布式训练。

- **推理与服务**：通过与 vllm-plugin-FL 协作，支持 DeepSeek-V3、DeepSeek-R1、Qwen2.5/3、Qwen2.5-VL、Qwen3-Omni、QwQ、Grok2、Kimi-K2 等模型的高性能推理与服务。

- **强化学习**：通过与 VeRL-FL 协作，支持 Qwen3-VL、Qwen2.5-VL、GR00T N1.5、DeepSeek Engram 等模型的强化学习工作流。

- **可扩展的跨芯片通信**：通过与 FlagCX 协作实现。

- **具身智能工作负载支持**：通过与 FlagOS-Robo 协作实现。

- **自动并行优化**：针对不同模型、集群配置和芯片架构，自动搜索并选择最优的并行策略、优化方法和内存配置组合——使用户能够以全自动、零投入的方式获得最佳的模型并行训练和推理性能。
