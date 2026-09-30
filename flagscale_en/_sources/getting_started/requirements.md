
# Requirements 

This section includes information about the hardware platforms and models.

## Hardware platforms

FlagScale is designed to work collaboratively with FlagOS plugins. While FlagScale itself has no hardware platform requirements, you should review the hardware requirements of the specific FlagOS plugins you intend to use. For more information, see [Megatron-LM-FL](https://github.com/flagos-ai/Megatron-LM-FL), [TransformerEngine-FL](https://github.com/flagos-ai/TransformerEngine-FL), [VeRL-FL](https://github.com/flagos-ai/verl-FL), and [vllm-plugin-FL](https://github.com/flagos-ai/vllm-plugin-FL).

Training has been validated end to end on the following platforms together with Megatron-LM-FL and TransformerEngine-FL:

| Platform | Device check | Visible-devices env | FlagTree backend |
|----------|--------------|---------------------|------------------|
| NVIDIA | `nvidia-smi` | `CUDA_VISIBLE_DEVICES` | `cuda` |
| MetaX | `mx-smi` | `MACA_VISIBLE_DEVICES` | `metax` |
| Hygon | `hy-smi` | `HIP_VISIBLE_DEVICES` | `hcu` |
| Ascend | `npu-smi info` | `ASCEND_RT_VISIBLE_DEVICES` | `ascend` |
| T-Head PPU | `ppu-smi` | `CUDA_VISIBLE_DEVICES` | `ppu` |

For the step-by-step procedure, see [Multi-Platform Training and Testing](multi-platform-training.md).

## Supported models

### Training

| Model                                                    | Example config File                        |
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

### Serve / Inference

| Model                                                    | Example config File                                                   |
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

For the full list, see https://github.com/flagos-ai/FlagScale/tree/main/examples
