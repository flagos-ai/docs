# Features

FlagScale provides a unified toolkit covering the complete lifecycle of large language models, multimodal models, and embodied AI models. It integrates multiple open-source backend engines under a single configuration and CLI interface, enabling consistent operation across diverse chip vendors. Key features include:

- **Unified CLI**: A single `flagscale` command as the entry point for all operations — training, inference, serving, and reinforcement learning — with unified multi-chip support across NVIDIA GPU, Ascend NPU, MetaX MUSA, and other platforms.

- **Training**: Full distributed training support for models including DeepSeek-V3/V4, Qwen2/2.5/3, Qwen2.5-VL, QwQ, LLaMA2/3/3.1, LLaVA-OneVision/1.5, Mixtral, RWKV, Aquila, and more — through collaboration with Megatron-LM-FL and TransformerEngine-FL.

- **Inference & Serving**: High-performance inference and serving for models including DeepSeek-V3, DeepSeek-R1, Qwen2.5/3, Qwen2.5-VL, Qwen3-Omni, QwQ, Grok2, Kimi-K2, and more — through collaboration with vllm-plugin-FL.

- **Reinforcement Learning**: Support for RL workflows with models including Qwen3-VL, Qwen2.5-VL, GR00T N1.5, and DeepSeek Engram — through collaboration with VeRL-FL.

- **Scalable cross-chip communication**: Through collaboration with FlagCX.

- **Embodied AI workload support**: Through collaboration with FlagOS-Robo.

- **Automatic parallelism optimization**: Searches and selects the optimal combination of parallelism strategies, optimization methods, and memory configurations for different models, cluster setups, and chip architectures — enabling users to achieve the best model parallel training and inference performance in a fully automated, zero-effort manner.
