
# 要求

本节包含硬件平台和模型的相关信息。

## 硬件平台

FlagScale 设计为与 FlagOS 插件协同工作。虽然 FlagScale 本身没有硬件平台要求，但您应查看计划使用的具体 FlagOS 插件的硬件要求。有关更多信息，请参见 [Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL)、[TransformerEngine-FL](https://github.com/flagos-ai/TransformerEngine-FL)、[VeRL-FL](https://github.com/flagos-ai/verl-FL) 和 [vllm-plugin-FL](https://github.com/flagos-ai/vllm-plugin-FL)。

训练已在以下平台上与 Megatron-LM-FL、TransformerEngine-FL 一起完成端到端验证：

| 平台 | 设备检查命令 | 可见设备环境变量 | FlagTree 后端 |
|------|--------------|------------------|---------------|
| NVIDIA | `nvidia-smi` | `CUDA_VISIBLE_DEVICES` | `cuda` |
| 沐曦 MetaX | `mx-smi` | `MACA_VISIBLE_DEVICES` | `metax` |
| 海光 Hygon | `hy-smi` | `HIP_VISIBLE_DEVICES` | `hcu` |
| 昇腾 Ascend | `npu-smi info` | `ASCEND_RT_VISIBLE_DEVICES` | `ascend` |
| 平头哥 PPU | `ppu-smi` | `CUDA_VISIBLE_DEVICES` | `ppu` |

分步操作请参见[多平台训练与测试](multi-platform-training.md)。

## 支持的模型

### 训练

| 模型                                                     | 示例配置文件                        |
| -------------------------------------------------------- | ------------------------------------------------------------- |
| [DeepSeek-V3](https://huggingface.co/deepseek-ai)        | [16b_a3b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/deepseek_v3/conf/train/16b_a3b.yaml)  |
| [Qwen2/2.5/3](https://huggingface.co/Qwen)               | [235b_a22b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/qwen3/conf/train/235b_a22b.yaml)    |
| [Qwen2.5-VL](https://huggingface.co/Qwen)                | [7b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/qwen2_5_vl/conf/train/7b.yaml)             |
| [QwQ](https://huggingface.co/Qwen)                       | [32b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/qwq/conf/train/32b.yaml)                  |
| [LLaMA2](https://huggingface.co/meta-llama)              | [7b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/llama2/conf/train/7b.yaml)                 |
| [LLaMA3/3.1](https://huggingface.co/meta-llama)          | [70b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/llama3/conf/train/70b.yaml)               |
| [LLaVA-OneVision](https://huggingface.co/lmms-lab)       | [7b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/llava_onevision/conf/train/7b.yaml)        |
| [LLaVA1.5](https://huggingface.co/llava-hf)              | [7b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/llava1_5/conf/train/7b.yaml)               |
| [Mixtral](https://huggingface.co/mistralai)              | [8x7b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/mixtral/conf/train/8x7b.yaml)            |
| [RWKV](https://huggingface.co/RWKV)                      | [7b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/rwkv/conf/train/7b.yaml)                   |
| [Aquila](https://huggingface.co/BAAI)                    | [7b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/aquila/conf/train/7b.yaml)                 |

### 服务 / 推理

| 模型                                                     | 示例配置文件                                                           |
| -------------------------------------------------------- | --------------------------------------------------------------------- |
| [DeepSeek-V3](https://huggingface.co/deepseek-ai)        | [671b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/deepseek_v3/conf/serve/671b.yaml)                |
| [DeepSeek-R1](https://huggingface.co/deepseek-ai)        | [671b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/deepseek_r1/conf/serve/671b.yaml)                |
| [Qwen2.5](https://huggingface.co/Qwen)                   | [72b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/qwen2_5/conf/serve/72b.yaml)                      |
| [Qwen3](https://huggingface.co/Qwen)                     | [8b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/qwen3/conf/serve/8b.yaml)                          |
| [Qwen2.5-VL](https://huggingface.co/Qwen)                | [32b_instruct.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/qwen2_5_vl/conf/serve/32b_instruct.yaml) |
| [Qwen3-Omni](https://huggingface.co/Qwen)                | [30b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/qwen3_o/conf/serve/30b.yaml)                      |
| [QwQ](https://huggingface.co/Qwen)                       | [32b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/qwq/conf/serve/32b.yaml)                          |
| [Grok2](https://huggingface.co/xai-org)                  | [270b.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/grok2/conf/serve/270b.yaml)                      |
| [Kimi-K2](https://huggingface.co/MoonshotAI)             | [1t.yaml](https://github.com/flagos-ai/FlagScale/tree/main/examples/kimi_k2/conf/serve/1t.yaml)                        |

完整列表请参见 https://github.com/flagos-ai/FlagScale/tree/main/examples
