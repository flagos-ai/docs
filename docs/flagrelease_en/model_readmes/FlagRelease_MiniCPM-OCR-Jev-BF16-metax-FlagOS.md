---
license: apache-2.0
language:
- zh
- en
---

# Introduction
ModelBest, together with OpenBMB, has open-sourced the MiniCPM-OCR series for document parsing and text recognition, comprising two models: MiniCPM-OCR 1.0 (1.3B) and MiniCPM-OCR Jev (2B). Built on a unified multi-chip software stack, the FlagOS community provides Day-0 cross-chip adaptation for both models, covering 12 platforms in total: T-Head, NVIDIA, Huawei Ascend, Hygon, KUNLUNXIN, MetaX, Moore Threads, Tsingmicro, Iluvatar CoreX, Xiwang, Mac (ARM), and CIX. In this round of evaluation, the FlagOS build of Jev reached 98.7% of NVIDIA native compute throughput, while on the same platform OCR 1.0 delivered up to 1.69× native P50 throughput per unit of peak compute. On ARM edge devices, Jev completes a page-block assessment in an average of 1.20 seconds using the M5 CPU alone. Backed by FlagOS support for both multi-chip servers and ARM terminals, industry users can pick a document parsing and quality-inspection deployment that matches their business requirements and existing compute resources.

MiniCPM-OCR 1.0 targets real-world document scenarios — scans, photos, curved pages, and re-photographed screens — with support for text, formula, and complex table parsing as well as key information extraction. In official evaluations, this lightweight 1.3B-parameter model scored 93.68 on Real5-OmniDocBench, and with DSpark decoding acceleration its end-to-end processing efficiency improved by 55%. To address the problem that parsed output still needs manual verification, the 2B-parameter MiniCPM-OCR Jev acts as an "AI quality inspector" for documents: it scores the reliability of parsing results and can be plugged into different OCR models to help flag content that requires human review. Its overall AUROC on JevOCRBench reaches 0.936, close to the 0.938 of Qwen3.5-397B-A17B.

### Integrated Deployment
- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Metax** container image supporting deployment within minutes
### Consistency Validation
- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Evaluation Results
## Benchmark Result
| Metrics      | MiniCPM-OCR-Jev-Nvidia-Origin | MiniCPM-OCR-Jev-Metax-FlagOS |
|--------------|--------------------------------|--------------------------------------|
| ocr_rm_mini(12 entries) avg_prob_1 | 0.4817                         | 0.482337                             |
| omnidocbench-render-compare(60 entries) avg_prob_1 | 0.2397                         | 0.23971                              |
# User Guide
Environment Setup

| Item             | Version              |
|------------------|----------------------|
| Docker Version   | Docker version 29.3.1 |
| Operating System | 22.04 LTS |
| Python           | 3.12.13              |
| torch            | 2.10.0+cpu           |
| torch_fl         | 2.10.0+metax3.8.0    |
| FlagTree         | 0.7.0+metax3.6       |
| FlagGems         | 5.4.0                |
| FlagCX           | 0.14.0+maca3.8.1.3   |
| transformers     | 5.17.0               |
| accelerate       | 1.15.0               |
| MACA / driver    | 3.8.1.3 / 3.8.1      |

## Operation Steps

### Download FlagOS Image
```bash
docker pull harbor.baai.ac.cn/flagrelease-public/vllm0.24.0-metax-maca3.8.1.3:jev-ocr-rm-2b-torchfl

```

### Download Open-source Model Weights
```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-OCR-Jev-BF16-metax-FlagOS --local_dir /public-flash/models/Jev-OCR-RM-2B
```

### Start the Container
Inside the container the weights are at `/models/Jev-OCR-RM-2B`.
```bash
docker run -d --name jev-ocr-rm-2b --network host --shm-size 64g \
  --device /dev/dri:/dev/dri:rwm --device /dev/mxcd:/dev/mxcd:rwm \
  -v /public-flash/models:/models \
  harbor.baai.ac.cn/flagrelease-public/vllm0.24.0-metax-maca3.8.1.3:jev-ocr-rm-2b-torchfl \
  sleep infinity
```
### Start the Server
```bash
No need to start server.
```

## Service Invocation
### Invocation Script
```bash
docker exec -i jev-ocr-rm-2b bash -lc \
  'source /opt/tfl-venv/bin/activate && MACA_VISIBLE_DEVICES=0 python3 - s02' <<'PY'
"""Jev (OCR-RM-2B) on Torch-FL (the `flagos` device) -- single-sample scoring
without going through vendor torch.

Key points:
1. **`import torch_fl` MUST come before `import torch`** (MetaX docs: CUDA / cu-bridge
   ABI compatibility)
2. The device string is **`flagos:0`**, not `cuda:0`
3. Build the model on CPU first, then `.to("flagos:0")`; transformers' `device_map=`
   does not accept the `flagos` device name

Usage (`python3 -` reads this block from stdin; the arguments after `-` are sample
names):
    python3 - s02             # run the default single sample s02
    python3 - s01 s03 s12     # run the given samples
"""
import json
import os
import sys

import torch_fl  # noqa: F401  WARNING: must be imported first
import torch
from PIL import Image

from transformers import AutoProcessor, Qwen3_5ForSequenceClassification

CKPT = os.environ.get("CKPT", "/models/Jev-OCR-RM-2B/qwen35_2b_l2_triple_value_checkpoint-3000")
DEMO = os.environ.get("DEMO", "/models/Jev-OCR-RM-2B/rm_hf_infer_demo_v1_20261015")
DEV = "flagos:0"

# NOTE: the prompt below is intentionally kept verbatim in Chinese -- it is the exact
# text used to produce every number reported in this README, so translating it would
# break reproducibility.
PROMPT = (
    "<|im_start|>user\n"
    "<|vision_start|><|image_pad|><|vision_end|>OCR文本：\n{ocr}\n"
    "<|vision_start|><|image_pad|><|vision_end|>"
    "第一张图是原图，第二张图是上述 OCR 文本渲染得到的图片。\n"
    "请判断该 OCR 文本及其对应渲染图是否与原图内容一致。\n"
    "这是一个二分类任务：一致标为 1，不一致标为 0。<|im_end|>\n"
)


DTYPE = getattr(torch, os.environ.get("DTYPE", "bfloat16"))


def describe_backend() -> None:
    """Print hard evidence that we run on the device provided by Torch-FL and not on
    vendor torch."""
    import torch_fl as tfl

    print("=" * 70)
    print("torch.__version__ :", torch.__version__, "   <- must have no +metax suffix")
    print("torch.__file__    :", torch.__file__)
    print("torch_fl.__file__ :", tfl.__file__)
    print("torch_fl version  :", getattr(tfl, "__version__", "<none>"))
    print("flagos available  :", torch.flagos.is_available())
    print("flagos devices    :", torch.flagos.device_count())
    try:
        props = torch.flagos.get_device_properties(0)
        print("flagos dev0       :", props.name, f"{props.total_memory / 1024**3:.1f} GiB")
    except Exception as e:  # noqa: BLE001
        print("flagos dev0 props : <error>", repr(e)[:160])
    print("=" * 70)
    assert "metax" not in torch.__version__, (
        f"torch is still the vendor build ({torch.__version__}), not the Torch-FL target torch"
    )
    assert getattr(torch, "flagos", None) is not None, "torch has no flagos namespace"
    assert torch.flagos.is_available(), "flagos device is not available"


def main() -> None:
    describe_backend()

    names = sys.argv[1:] or ["s02"]
    manifest = json.load(open(f"{DEMO}/samples/manifest.json"))["samples"]
    by_name = {s["name"]: s for s in manifest}

    proc = AutoProcessor.from_pretrained(CKPT)
    model = Qwen3_5ForSequenceClassification.from_pretrained(
        CKPT, dtype=DTYPE, attn_implementation="sdpa", device_map=None
    )
    model = model.to(DEV).eval()
    print(f"[info] model on {DEV}  dtype={DTYPE}", flush=True)

    for name in names:
        s = by_name[name]
        ocr = open(f"{DEMO}/{s['ocr_text_file']}", encoding="utf-8").read().rstrip("\r\n")
        images = [
            Image.open(f"{DEMO}/{s['orig_image']}").convert("RGB"),
            Image.open(f"{DEMO}/{s['render_image']}").convert("RGB"),
        ]
        inputs = proc(text=[PROMPT.format(ocr=ocr)], images=images, return_tensors="pt")
        inputs = {k: v.to(DEV) for k, v in inputs.items() if hasattr(v, "to")}

        with torch.inference_mode():
            logits = model(**inputs).logits.float()

        prob_1 = torch.softmax(logits, dim=-1)[0, 1].item()
        ref = s["ref_prob_1"]
        print(
            f"{name}: prob_1={prob_1:.8f}  ref={ref:.8f}  delta={prob_1 - ref:+.2e}  "
            f"n_tokens={inputs['input_ids'].shape[1]}",
            flush=True,
        )


if __name__ == "__main__":
    main()
PY
```


### AnythingLLM Integration Guide

#### 1. Download & Install

- Visit the official site: https://anythingllm.com/
- Choose the appropriate version for your OS (Windows/macOS/Linux)
- Follow the installation wizard to complete the setup

#### 2. Configuration

- Launch AnythingLLM
- Open settings (bottom left, fourth tab)
- Configure core LLM parameters
- Click "Save Settings" to apply changes

#### 3. Model Interaction

- After model loading is complete:
- Click **"New Conversation"**
- Enter your question (e.g., "Explain the basics of quantum computing")
- Click the send button to get a response
# Technical Overview
**FlagOS** is a fully open-source system software stack designed to unify the "model–system–chip" layers and foster an open, collaborative ecosystem. It enables a "develop once, run anywhere" workflow across diverse AI accelerators, unlocking hardware performance, eliminating fragmentation among vendor-specific software stacks, and substantially lowering the cost of porting and maintaining AI workloads. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of <chip + open-source model>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.
## FlagGems
FlagGems is a high-performance, generic operator libraryimplemented in [Triton](https://github.com/openai/triton) language. It is built on a collection of backend-neutralkernels that aims to accelerate LLM (Large-Language Models) training and inference across diverse hardware platforms.
## FlagTree
FlagTree is an open source, unified compiler for multipleAI chips project dedicated to developing a diverse ecosystem of AI chip compilers and related tooling platforms, thereby fostering and strengthening the upstream and downstream Triton ecosystem. Currently in its initial phase, the project aims to maintain compatibility with existing adaptation solutions while unifying the codebase to rapidly implement single-repository multi-backend support. Forupstream model users, it provides unified compilation capabilities across multiple backends; for downstream chip manufacturers, it offers examples of Triton ecosystem integration.
## FlagScale and vllm-plugin-fl
Flagscale is a comprehensive toolkit designed to supportthe entire lifecycle of large models. It builds on the strengths of several prominent open-source projects, including [Megatron-LM](https://github.com/NVIDIA/Megatron-LM) and [vLLM](https://github.com/vllm-project/vllm), to provide a robust, end-to-end solution for managing and scaling large models.
vllm-plugin-fl is a vLLM plugin built on the FlagOS unified multi-chip backend, to help flagscale support multi-chip on vllm framework.
## **FlagCX**
FlagCX is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.

## **FlagEval Evaluation Framework**
 FlagEval is a comprehensive evaluation system and open platform for large models launched in 2023. It aims to establish scientific, fair, and open benchmarks, methodologies, and tools to help researchers assess model and training algorithm performance. It features:
 - **Multi-dimensional Evaluation**: Supports 800+ modelevaluations across NLP, CV, Audio, and Multimodal fields,covering 20+ downstream tasks including language understanding and image-text generation.
 - **Industry-Grade Use Cases**: Has completed horizonta1 evaluations of mainstream large models, providing authoritative benchmarks for chip-model performance validation.

# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support
# License
The model weights are derived from OpenBMB/MiniCPM-OCR-Jev and are open‑sourced under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
