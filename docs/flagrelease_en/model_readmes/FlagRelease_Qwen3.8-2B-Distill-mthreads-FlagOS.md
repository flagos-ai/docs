---
license: apache-2.0
base_model: Qwen/Qwen3.5-2B
language:
  - en
library_name: transformers
pipeline_tag: text-generation
tags:
  - empero-ai
  - qwen3.5
  - qwen3.8
  - distillation
  - reasoning
  - function-calling
  - sft
  - edge
---

# Qwen3.8-2B

**Developed by [Empero](https://empero.org)**

> [!Note]
> This repository contains model weights and configuration files in the Hugging Face Transformers format.
>
> These artifacts are compatible with Hugging Face Transformers, vLLM, SGLang, and other standard runtimes with Qwen3.5 architecture support.

**Qwen3.8-2B** is a full-parameter distillation of **Qwen3.8 2.4T A95B** into the Qwen3.5-2B architecture — the smallest member of the family, trained on the **same curriculum** as its larger siblings. The student saw **~30,000 curated teacher traces** from our internal Qwen3.8 distillation datasets — dense chain-of-thought spanning mathematics, general reasoning, and instruction following, quality-filtered before training.

The objective: the same teacher, the same reasoning curriculum, in a model small enough for the edge. What changes across [Qwen3.8-9B](https://huggingface.co/empero-ai/Qwen3.8-9B), [Qwen3.8-4B](https://huggingface.co/empero-ai/Qwen3.8-4B) and this model is the student's capacity — not the quality or the character of what it was taught.

## Highlights

- **Distilled chain-of-thought** — every answer opens with a `<think>` block learned directly from Qwen3.8 2.4T A95B traces rather than synthetic self-generated reasoning.
- **Same curriculum as the larger siblings** — the same teacher and the same quality-filtered trace mix used for the 9B and 4B distills; only the student's capacity differs.
- **2B weight class** — bf16 in ~4 GB; quantized builds run on phones, single-board computers, and CPU-only machines.
- **Native function calling** per Qwen3.5's specification — no wrapper or tool-specific fine-tune required.
- **262,144-token native context**, inherited from the Qwen3.5 base.
- **Full fine-tune** — every parameter updated; not an adapter.

## Model Overview

- Type: Causal Language Model (text path of a vision-language base)
- Base: [Qwen/Qwen3.5-2B](https://huggingface.co/Qwen/Qwen3.5-2B)
- Number of Parameters: 2B
- Training: SFT (off-policy distillation) on ~30,000 teacher traces
- Teacher: Qwen3.8 2.4T A95B (internal distillation datasets)
- Context Length: 262,144 natively

## Benchmark Results

Measured with [`lm-evaluation-harness`](https://github.com/EleutherAI/lm-evaluation-harness), HF backend, identical settings for base and student. Both models are reasoning models and are evaluated with the CoT protocols (`gsm8k_cot`, `mmlu_flan_cot_zeroshot`); MMLU covers all 57 subjects (~1,700 questions). Flexible-extract is the primary metric; strict-match requires exact answer formatting.

| Task | Metric | Qwen3.5-2B (base) | **Qwen3.8-2B** | Δ |
|---|---|---:|---:|---:|
| gsm8k_cot | exact_match (flexible) | 0.330 | **0.640** | **+0.310** |
| gsm8k_cot | exact_match (strict) | 0.545 | **0.640** | **+0.095** |
| mmlu (CoT, 57 subjects) | acc (flexible-extract) | 0.283 | **0.548** | **+0.265** |
| mmlu (CoT, 57 subjects) | acc (strict-match) | 0.004 | **0.225** | **+0.221** |

Sampling for generation: `temperature=0.6, top_p=0.95, top_k=20` (Qwen3.5 recommended settings).

## Quickstart

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_id = "empero-ai/Qwen3.8-2B"
tok = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, dtype=torch.bfloat16, device_map="auto")

messages = [{"role": "user", "content": "A snail is at the bottom of a 10-meter well. Each day it climbs 3 meters, each night it slips back 2. How many days until it escapes?"}]
inputs = tok.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt").to(model.device)

out = model.generate(inputs, max_new_tokens=16384,
                     temperature=0.6, top_p=0.95, top_k=20, do_sample=True)
print(tok.decode(out[0][inputs.shape[1]:], skip_special_tokens=True))
```

A recent `transformers` release with Qwen3.5 support is required, along with the Gated DeltaNet kernels ([`flash-linear-attention`](https://github.com/fla-org/flash-linear-attention) and a CUDA-matched [`causal_conv1d`](https://github.com/Dao-AILab/causal-conv1d) build) — without them the linear-attention layers fall back to slow, memory-hungry PyTorch ops.

## Best Practices

- **Sampling**: `temperature=0.6, top_p=0.95, top_k=20`. Greedy decoding on long generations is a known repetition-loop failure mode for reasoning models in this class.
- **Output length**: allow generous `max_new_tokens` (16,384 recommended); every answer opens with a `<think>` block. Parse and strip the `<think>...</think>` span for end users.
- **Weight class, not curriculum**: the reasoning form transfers from the same teacher traces the larger siblings learned from; what 2B parameters bound is capacity — factual recall and very hard multi-step problems. For harder workloads, step up to [Qwen3.8-4B](https://huggingface.co/empero-ai/Qwen3.8-4B) or [Qwen3.8-9B](https://huggingface.co/empero-ai/Qwen3.8-9B).
- **Scope**: the trace mix emphasizes mathematics, reasoning, and instruction following; the 9B additionally trains on code, so use [Qwen3.8-9B](https://huggingface.co/empero-ai/Qwen3.8-9B) for code-heavy workloads. The fine-tune is text-only; vision behavior is inherited from the base and was not evaluated here.

## Stay in the loop

Sign up for the Empero newsletter at **[empero.org](https://empero.org)** for releases, evals, and research notes.

## Support / Donate

If this model helped you, consider supporting the project:

- **BTC**: `bc1qx6zepu6sfkvshgdmc4ewu6pk6rpadvpgffpp7v`
- **LTC**: `ltc1qv2mefzps2vtjcpwfx8xxdrpplrcvltswm68r7x`

---

## Provenance & licensing

Weights are released under **Apache-2.0**, inherited from the Qwen3.5-2B base. Shared for research and experimentation, as-is.

## Acknowledgements

- Developed and released by [Empero](https://empero.org)
- Base model: [Qwen3.5-2B](https://huggingface.co/Qwen/Qwen3.5-2B) (Alibaba Qwen team)
- Training: [TRL](https://github.com/huggingface/trl) + [Transformers](https://github.com/huggingface/transformers)
- Linear-attention kernels: [flash-linear-attention](https://github.com/fla-org/flash-linear-attention), [causal_conv1d](https://github.com/Dao-AILab/causal-conv1d)
- Evaluation: [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) (EleutherAI)
