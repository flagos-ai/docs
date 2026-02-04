---
frameworks:
- ""
---
# Introduction

**FlagOS** is a unified heterogeneous computing software stack for large models, co-developed with leading global chip manufacturers. With core technologies such as the **FlagScale**, together with vllm-plugin-fl, distributed training/inference framework, **FlagGems** universal operator library, **FlagCX** communication library, and **FlagTree** unified compiler, the **FlagRelease** platform leverages the **FlagOS** stack to automatically produce and release various combinations of \<chip + open-source model\>. This enables efficient and automated model migration across diverse chips, opening a new chapter for large model deployment and application.

Based on this, the **MiniCPM-o-4.5-nvidia-FlagOS** model is adapted for the Nvidia chip using the FlagOS software stack, enabling:

### Integrated Deployment

- Out-of-the-box inference scripts with pre-configured hardware and software parameters
- Released **FlagOS-Nvidia** container image supporting deployment within minutes

### Consistency Validation

- Rigorously evaluated through benchmark testing: Performance and results from the FlagOS software stack are compared against native stacks on multiple public.

# Technical Overview

## FlagGems

FlagGems is a high-performance, generic operator library implemented in [Triton](https://github.com/openai/triton) language. It is built on a collection of backend-neutral kernels that aims to accelerate LLM (Large-Language Models) training and inference across diverse hardware platforms.

## FlagTree

FlagTree is an open source, unified compiler for multiple AI chips project dedicated to developing a diverse ecosystem of AI chip compilers and related tooling platforms, thereby fostering and strengthening the upstream and downstream Triton ecosystem. Currently in its initial phase, the project aims to maintain compatibility with existing adaptation solutions while unifying the codebase to rapidly implement single-repository multi-backend support. For upstream model users, it provides unified compilation capabilities across multiple backends; for downstream chip manufacturers, it offers examples of Triton ecosystem integration.

## FlagScale and vllm-plugin-fl

FlagScale is a comprehensive toolkit designed to support the entire lifecycle of large models. It builds on the strengths of several prominent open-source projects, including [Megatron-LM](https://github.com/NVIDIA/Megatron-LM) and [vLLM](https://github.com/vllm-project/vllm), to provide a robust, end-to-end solution for managing and scaling large models.
vllm-plugin-fl is a vLLM plugin built on the FlagOS unified multi-chip backend, to help flagscale support multi-chip on vllm framework.

## **FlagCX**

FlagCX is a scalable and adaptive cross-chip communication library. It serves as a platform where developers, researchers, and AI engineers can collaborate on various projects, contribute to the development of cutting-edge AI solutions, and share their work with the global community.

## **FlagEval Evaluation Framework**

FlagEval is a comprehensive evaluation system and open platform for large models launched in 2023. It aims to establish scientific, fair, and open benchmarks, methodologies, and tools to help researchers assess model and training algorithm performance. It features:
  - **Multi-dimensional Evaluation**: Supports 800+ model evaluations across NLP, CV, Audio, and Multimodal fields, covering 20+ downstream tasks including language understanding and image-text generation.
  - **Industry-Grade Use Cases**: Has completed horizontal evaluations of mainstream large models, providing authoritative benchmarks for chip-model performance validation.

# Evaluation Results

## Transformers version

Accuracy Difference between USE_FLAGOS=1 and USE_FLAGOS=0 on Nvidia-CUDA

| Metrics                | Difference with Nvidia-CUDA  |
| ---------------------- | ---------------------  |
| Video-MME 0-shot avg@1 ↑ | 0.33%                 |

## VLLM version

Accuracy Difference between USE_FLAGGEMS=1 FLAGCX_PATH=/workspace/FlagCX on Nvidia and launch vllm server directly on Nvidia。

| Metrics(avg@1)                | Difference with Nvidia-CUDA |
| ---------------------- | ---------------------  |
| CMMMU ↑ | 0.72%                  |
| MMMU ↑ | 1.44%                  |
| MMMU_Pro_standard ↑ | 0.83%                  |
| MMMU_Pro_vision ↑ | 0.38%                 |
| MM-Vet v2 ↑ | 0.46%                  |
| OCRBench ↑ | 0.10%                  |
| MathVision ↑ | 0.41%                  |
| CII-Bench ↑ | 0.40%                 |
| Blink ↑ | 1.90%                 |
| MathVista ↑ |       0.70%            |

# User Guide

## Environment Setup

| Accelerator Card Driver Version | Driver Version: 570.158.01               |
| ------------------------------- | ---------------------------------------- |
| CUDA SDK Build                  | Build cuda_13.0.r13.0/compiler.36424714_0 |
| FlagTree                        | Version: 0.4.0+3.5                       |
| FlagGems                        | Version: 4.2.1rc0                        |
| vllm & vllm-plugin-fl           | Version: 0.13.0 + vllm_fl 0.0.0                        |
| FlagCX                        | Version: 0.1.0                       |

## Transformers version

### Download Open-source Model Weights

```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-o-4.5-nvidia-FlagOS --local_dir /share/MiniCPMO45
```

### Download FlagOS Image

```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-gems_4.2.1rc0-tree_0.4-flagos_1.6-amd64
```

### Start the Container

```bash
#Container Startup
docker run --init --detach --net=host --user 0 --ipc=host \
           -v /share:/share --security-opt=seccomp=unconfined \
           --privileged --ulimit=stack=67108864 --ulimit=memlock=-1 \
           --shm-size=512G --gpus all \
           --name flagos harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-gems_4.2.1rc0-tree_0.4-flagos_1.6-amd64
docker exec -it flagos bash
```

### Use MiniCPM-o-4.5

You can refers to OpenBMB/MiniCPM-o-4.5 to use the model as you want. For FlagOS, you can follow these steps to get better performance than CUDA:

1. Write your own task script like generate_speech_from_video.py
2. execute 

```bash
python3 generate_speech_from_video.py
```

to launch your job, just the same as openBMB/MiniCPM-o-4.5

3. execute 

```bash
USE_FLAGOS=1 python3 generate_speech_from_video.py
```

to get better performance!

For example, you can write your generate_speech_from_video.py refers to the following codes, which are from openBMB/MiniCPM-o-4.5's README:

```python3
import json
import os

import librosa
import torch
from transformers import AutoTokenizer, AutoProcessor

from MiniCPMO45.modeling_minicpmo import MiniCPMO
from MiniCPMO45.modeling_minicpmo import TTSSamplingParams
from MiniCPMO45.processing_minicpmo import MiniCPMOProcessor
from MiniCPMO45.utils import get_video_frame_audio_segments


def gen(stack_frames=1, max_slice_nums=None):
    ref_audio_path = "haitian_ref_audio.wav"
    ref_name = "haitian_ref_audio"

    ckpt_name = "job_79706_ckpt_2000"

    save_dir = "./outputs"
    os.makedirs(save_dir, exist_ok=True)
    os.makedirs(os.path.join(save_dir, ckpt_name), exist_ok=True)

    name_or_path = "./MiniCPMO45"
    model = MiniCPMO.from_pretrained(name_or_path, trust_remote_code=True, _attn_implementation="flash_attention_2")

    model.bfloat16()
    model.eval().cuda()

    model.init_tts(streaming=False)

    filenames = {
        "record_cases_info": "record_cases_info.jsonl",
    }

    use_sys_modes = {
        "omni",
        "audio_assistant",
        "audio_roleplay",
        "voice_cloning",
        "voice_cloning_new",
    }
    use_sys_mode = os.environ.get("USE_SYS_MODE", "default")
    if use_sys_mode not in use_sys_modes:
        use_sys_mode = None

    sys_msg = None
    if use_sys_mode:
        ref_audio, _ = librosa.load(ref_audio_path, sr=16000, mono=True)
        sys_msg = model.get_sys_prompt(ref_audio=ref_audio, mode=use_sys_mode, language="en")

    error_stat = {}
    for name, filename in filenames.items():
        datas = [json.loads(line) for line in open(filename, encoding="utf-8")]
        n_datas = len(datas)
        error_stat[name] = {}

        results = []
        identity_prefix = name
        if use_sys_mode:
            identity_prefix = f"{identity_prefix}_{use_sys_mode}_{ref_name}"

        for id_item, item in enumerate(datas):
            print(f"{id_item}/{n_datas}: {filename}")
            try:
                video_path = item["video_path"]
                if item["source"] == "record_cases":
                    last_vad_timestamp = item["last_vad_timestamp"]
                    video_segments, audio_segments, stack_segments = get_video_frame_audio_segments(
                        video_path, last_vad_timestamp=last_vad_timestamp, stack_frames=stack_frames
                    )
                else:
                    mix_origin_question = item["mix_origin_question"]
                    video_segments, audio_segments, stack_segments = get_video_frame_audio_segments(
                        video_path, audio_path=mix_origin_question, stack_frames=stack_frames
                    )
            except:
                import traceback

                traceback.print_exc()
                print(f"video get frame error, item={item}")
                error_items = error_stat.get(name, {}).get("get_video_frame_audio_segments", [])
                error_items.append(id_item)
                error_stat[name]["get_video_frame_audio_segments"] = error_items
                continue

            omni_segments = []
            for i in range(len(video_segments)):
                omni_segments.append(video_segments[i])
                omni_segments.append(audio_segments[i])
                if stack_segments is not None and stack_segments[i] is not None:
                    omni_segments.append(stack_segments[i])

            msgs = []
            if sys_msg:
                msgs.append(sys_msg)

            msgs.append({"role": "user", "content": omni_segments})

            try:
                identity = f"{identity_prefix}_{id_item}"
                output_audio_path = f"{save_dir}/{ckpt_name}/{identity}___generated.wav"

                with torch.no_grad():
                    res, prompt = model.chat(
                        image=None,
                        msgs=msgs,
                        do_sample=True,
                        max_new_tokens=512,
                        max_inp_length=8192,
                        stream=False,
                        stream_input=False,
                        use_tts_template=True,
                        enable_thinking=False,
                        generate_audio=False,
                        output_audio_path=output_audio_path,
                        output_tts_inputs_embeds_path=None,
                        omni_mode=True,
                        max_slice_nums=max_slice_nums,
                        use_image_id=False,
                        teacher_forcing=False,
                        return_prompt=True,
                        tts_proj_layer=-1,
                    )
                print(f"prompt: {prompt}")
                result = {
                    "idx": id_item,
                    "item": item,
                    "prompt": prompt,
                    "answer": res,
                    "gen_audio_path": output_audio_path,
                }

                if use_sys_mode:
                    result["ref_audio_path"] = ref_audio_path

                results.append(result)
            except:
                import traceback

                traceback.print_exc()
                print(f"error: msgs={msgs}")
                error_items = error_stat.get("items", [])
                error_items.append(id_item)
                error_stat[name]["items"] = error_items

        if results:
            print(f"save into: {save_dir}/{identity_prefix}_{ckpt_name}.jsonl")
            with open(f"{save_dir}/{identity_prefix}_{ckpt_name}.jsonl", "w") as fd:
                for line in results:
                    fd.write(json.dumps(line, ensure_ascii=False) + "\n")
        else:
            print("no data")

        print(error_stat)


if __name__ == "__main__":
    stack_frames = 5  # 1 - 常规, >1: 高刷 (=5, 额外 4帧合一张图)
    max_slice_nums = 1  # 1 - 常规, >1: 高清

    gen(stack_frames=stack_frames, max_slice_nums=max_slice_nums)
```

## VLLM version

### Download Open-source Model Weights

```bash
pip install modelscope
modelscope download --model FlagRelease/MiniCPM-o-4.5-nvidia-FlagOS --local_dir /share/MiniCPMO45
```

### Download FlagOS Image

```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-gems_4.2.1rc0-tree_0.4-flagos_1.6-vllmpluginfl_0.0.0-flagcx_0.1.0-vllm_0.13.0-amd64
```

### Start the Container

```bash
#Container Startup
docker run --init --detach --net=host --user 0 --ipc=host \
           -v /share:/share --security-opt=seccomp=unconfined \
           --privileged --ulimit=stack=67108864 --ulimit=memlock=-1 \
           --shm-size=512G --gpus all \
           --name flagos harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-gems_4.2.1rc0-tree_0.4-flagos_1.6-vllmpluginfl_0.0.0-flagcx_0.1.0-vllm_0.13.0-amd64
docker exec -it flagos bash
```

### Serve and use MiniCPM-o-4.5 with vllm

Notes: you can refers to https://github.com/vllm-project/vllm to know how to use vllm

You can use 

```bash
vllm serve /share/MiniCPMO45 --trust-remote-code
```
to launch server without FlagOS, and use

```bash
USE_FLAGGEMS=1 FLAGCX_PATH=/workspace/FlagCX vllm serve /share/MiniCPMO45 --trust-remote-code
```
to launch server with FlagOS.

After that, you can do whatever you want with the vllm's server at 0.0.0.0:8000!


# Contributing

We warmly welcome global developers to join us:

1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support


# License

The weight files are from https://github.com/OpenBMB/MiniCPM-o, open source with apache2.0 licensehttps://www.apache.org/licenses/LICENSE-2.0.txt.
