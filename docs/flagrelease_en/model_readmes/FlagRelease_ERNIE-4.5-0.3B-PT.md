---
license: apache-2.0
language:
- en
- zh
pipeline_tag: text-generation
tags:
- ERNIE4.5
library_name: transformers
---

<div align="center" style="line-height: 1;">
  <a href="https://ernie.baidu.com/" target="_blank" style="margin: 2px;">
    <img alt="Chat" src="https://img.shields.io/badge/🤖_Chat-ERNIE_Bot-blue" style="display: inline-block; vertical-align: middle;"/>
  </a>
  <a href="https://huggingface.co/baidu" target="_blank" style="margin: 2px;">
    <img alt="Hugging Face" src="https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Baidu-ffc107?color=ffc107&logoColor=white" style="display: inline-block; vertical-align: middle;"/>
  </a>
  <a href="https://github.com/PaddlePaddle/ERNIE" target="_blank" style="margin: 2px;">
    <img alt="Github" src="https://img.shields.io/badge/GitHub-ERNIE-000?logo=github&color=0000FF" style="display: inline-block; vertical-align: middle;"/>
  </a>
  <a href="https://ernie.baidu.com/blog/ernie4.5" target="_blank" style="margin: 2px;">
    <img alt="Blog" src="https://img.shields.io/badge/🖖_Blog-ERNIE4.5-A020A0" style="display: inline-block; vertical-align: middle;"/>
  </a>
</div>

<div align="center" style="line-height: 1;">
  <a href="#license" style="margin: 2px;">
    <img alt="License" src="https://img.shields.io/badge/License-Apache2.0-A5de54" style="display: inline-block; vertical-align: middle;"/>
  </a>
</div>

# ERNIE-4.5-0.3B

> [!NOTE]
> Note: "**-Paddle**" models use [PaddlePaddle](https://github.com/PaddlePaddle/Paddle) weights, while "**-PT**" models use Transformer-style PyTorch weights.

## ERNIE 4.5 Highlights

The advanced capabilities of the ERNIE 4.5 models, particularly the MoE-based A47B and A3B series, are underpinned by several key technical innovations:

1. **Multimodal Heterogeneous MoE Pre-Training:** Our models are jointly trained on both textual and visual modalities to better capture the nuances of multimodal information and improve performance on tasks involving text understanding and generation, image understanding, and cross-modal reasoning. To achieve this without one modality hindering the learning of another, we designed a *heterogeneous MoE structure*, incorporated *modality-isolated routing*, and employed *router orthogonal loss* and *multimodal token-balanced loss*. These architectural choices ensure that both modalities are effectively represented, allowing for mutual reinforcement during training.

2. **Scaling-Efficient Infrastructure:** We propose a novel heterogeneous hybrid parallelism and hierarchical load balancing strategy for efficient training of ERNIE 4.5 models. By using intra-node expert parallelism, memory-efficient pipeline scheduling, FP8 mixed-precision training and finegrained recomputation methods, we achieve remarkable pre-training throughput. For inference, we propose *multi-expert parallel collaboration* method and *convolutional code quantization* algorithm to achieve 4-bit/2-bit lossless quantization. Furthermore, we introduce PD disaggregation with dynamic role switching for effective resource utilization to enhance inference performance for ERNIE 4.5 MoE models. Built on [PaddlePaddle](https://github.com/PaddlePaddle/Paddle), ERNIE 4.5 delivers high-performance inference across a wide range of hardware platforms.

3. **Modality-Specific Post-Training:** To meet the diverse requirements of real-world applications, we fine-tuned variants of the pre-trained model for specific modalities. Our LLMs are optimized for general-purpose language understanding and generation. The VLMs focuses on visuallanguage understanding and supports both thinking and non-thinking modes. Each model employed a combination of *Supervised Fine-tuning (SFT)*, *Direct Preference Optimization (DPO)* or a modified reinforcement learning method named *Unified Preference Optimization (UPO)* for post-training.

## Model Overview

ERNIE-4.5-0.3B is a text dense Post-trained model. The following are the model configuration details:

| Key            | Value        |
| -------------- | ------------ |
| Modality       | Text         |
| Training Stage | Posttraining |
| Params         | 0.36B        |
| Layers         | 18           |
| Heads(Q/KV)    | 16 / 2       |
| Context Length | 131072       |

## Quickstart

### Using `transformers` library

**Note**: Before using the model, please ensure you have the `transformers` library installed
(upcoming version 4.54.0 or [the latest version](https://github.com/huggingface/transformers?tab=readme-ov-file#installation))

The following contains a code snippet illustrating how to use the model generate content based on given inputs.

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "baidu/ERNIE-4.5-0.3B-PT"

# load the tokenizer and the model
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    torch_dtype=torch.bfloat16,
)

# prepare the model input
prompt = "Give me a short introduction to large language model."
messages = [
    {"role": "user", "content": prompt}
]
text = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True
)
model_inputs = tokenizer([text], add_special_tokens=False, return_tensors="pt").to(model.device)

# conduct text completion
generated_ids = model.generate(
    **model_inputs,
    max_new_tokens=1024
)
output_ids = generated_ids[0][len(model_inputs.input_ids[0]):].tolist()

# decode the generated ids
generate_text = tokenizer.decode(output_ids, skip_special_tokens=True)
print("generate_text:", generate_text)
```

### vLLM inference

[vllm](https://github.com/vllm-project/vllm/tree/main) github library. Python-only [build](https://docs.vllm.ai/en/latest/getting_started/installation/gpu.html#set-up-using-python-only-build-without-compilation).

```bash
vllm serve baidu/ERNIE-4.5-0.3B-PT
```

## License

The ERNIE 4.5 models are provided under the Apache License 2.0. This license permits commercial use, subject to its terms and conditions. Copyright (c) 2025 Baidu, Inc. All Rights Reserved.

## Citation

If you find ERNIE 4.5 useful or wish to use it in your projects, please kindly cite our technical report:

```bibtex
@misc{ernie2025technicalreport,
      title={ERNIE 4.5 Technical Report},
      author={Baidu ERNIE Team},
      year={2025},
      eprint={},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={}
}
```
