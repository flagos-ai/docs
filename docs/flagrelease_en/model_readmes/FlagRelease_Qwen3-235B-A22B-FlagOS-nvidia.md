# Introduction

Qwen3-235B-A22B-FlagOS-nvidia  provides an all-in-one deployment solution, enabling execution of Qwen3-235B-A22B on nvidia GPUs. As the first-generation release for the nvidia-H100, this package delivers two key features:

1. Comprehensive Integration:
   - Integrated with FlagScale (https://github.com/FlagOpen/FlagScale).
   - Open-source inference execution code, preconfigured with all necessary software and hardware settings.
   - Pre-built Docker image for rapid deployment on nvidia-H100.
3. Consistency Validation:
   - Evaluation tests verifying consistency of results between the official and ours.

# Technical Summary

## Serving Engine

We use FlagScale as the serving engine to improve the portability of distributed inference.

FlagScale is an end-to-end framework for large models across multiple chips, maximizing computational resource efficiency while ensuring model effectiveness. It ensures both ease of use and high performance for users when deploying models across different chip architectures:

- One-Click Service Deployment: FlagScale provides a unified and simple command execution mechanism, allowing users to fast deploy services seamlessly across various hardware platforms using the same command. This significantly reduces the entry barrier and enhances user experience.
- Automated Deployment Optimization: FlagScale automatically optimizes distributed parallel strategies based on the computational capabilities of different AI chips, ensuring optimal resource allocation and efficient utilization, thereby improving overall deployment performance.
- Automatic Operator Library Switching: Leveraging FlagScale's unified Runner mechanism and deep integration with FlagGems, users can seamlessly switch to the FlagGems operator library for inference by simply adding environment variables in the configuration file.

## Triton Support

We validate the execution of Qwen3-235B-A22B model with a Triton-based operator library as a PyTorch alternative.

We use a variety of Triton-implemented operation kernels  to run the Qwen3-235B-A22B model. These kernels come from two main sources:

- Most Triton kernels are provided by FlagGems (https://github.com/FlagOpen/FlagGems). You can enable FlagGems kernels by setting the environment variable USE_FLAGGEMS. 

- Also included are Triton kernels from vLLM, such as fused MoE.

# Evaluation Results

## Benchmark Result 

| Metrics            | Qwen3-235B-A22B-H100-CUDA | Qwen3-235B-A22B-FlagOS-nvidia |
|:-------------------|--------------------------|-----------------------------|
| livebench_new      | 0.751                       | 0.734 |
| aime               | 0.833                       | 0.833 |
| GPQA       | 0.650                        | 0.651 |
| MMLU              | 0.820                        | 0.820 |
| MUSR              | 0.661                       | 0.664 |
| TheoremQA         | 0.276                        | 0.266 |


# How to Run Locally
## 📌 Getting Started
### Download open-source weights

```bash

pip install modelscope
modelscope download --model Qwen/Qwen3-235B-A22B --local_dir /share/Qwen3-235B-A22B

```

### Download the FlagOS image

```bash
docker pull harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_qwen3-235b-a22b-tree_none-gems_2.2-scale_0.8.0-cx_none-python_3.12.10-torch_2.7.0-pcp_cuda12.8-gpu_nvidia003-arc_amd64-driver_570.158.01:2508011525
```

### Start the inference service

```bash
docker run --rm --init --detach \
  --net=host --uts=host --ipc=host \
  --security-opt=seccomp=unconfined \
  --privileged=true \
  --ulimit stack=67108864 \
  --ulimit memlock=-1 \
  --ulimit nofile=1048576:1048576 \
  --shm-size=32G \
  -v /share:/share \
  --gpus all \
  --name flagos \
  harbor.baai.ac.cn/flagrelease-public/flagrelease-nvidia-release-model_qwen3-235b-a22b-tree_none-gems_2.2-scale_0.8.0-cx_none-python_3.12.10-torch_2.7.0-pcp_cuda12.8-gpu_nvidia003-arc_amd64-driver_570.158.01:2508011525 \
  sleep infinity

docker exec -it flagos bash
```

### Serve

```bash
flagscale serve qwen3
```
# Service Invocation

## API-based Invocation Script

```
import openai
openai.api_key = "EMPTY"
openai.base_url = "http://<server_ip>:9010/v1/"
model = "Qwen3-235B-A22B-FlagOS-nvidia"
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What's the weather like today?"}
]
response = openai.chat.completions.create(
    model=model,
    messages=messages,
    stream=False,
)
for item in response:
    print(item)
```

# Contributing

We warmly welcome global developers to join us:
1. Submit Issues to report problems
2. Create Pull Requests to contribute code
3. Improve technical documentation
4. Expand hardware adaptation support

# 📞 Contact Us

Scan the QR code below to add our WeChat group
send "FlagRelease"

![WeChat](image/group.png)

# License

The weights of this model are based on Qwen/Qwen3-235B/A22B and are open-sourced under the Apache 2.0 License: https://www.apache.org/licenses/LICENSE-2.0.txt.
