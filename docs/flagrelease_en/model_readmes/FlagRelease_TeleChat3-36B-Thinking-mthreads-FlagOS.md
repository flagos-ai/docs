---
base_model:
- ""
---

# Model Introduction

TeleChat3-36B-Thinking-mthreads-FlagOS is optimized by TeleAI based on the TeleChat3-36B-Thinking base model, deeply adapted to the full-stack software environment of FlagOS and the Moore mthreads multi-threaded inference framework, focusing on high-performance large language models with chain-of-thought reasoning capabilities.

Leveraging the FlagScale distributed training/inference framework, FlagGems general operator library, FlagCX communication acceleration library, and the Moore mthreads multi-threaded engine, it enhances core capabilities such as complex problem decomposition, multi-step logical reasoning, and precise analysis. It achieves high-throughput, low-latency, stable and reliable concurrent inference services, and can be directly containerized and deployed for business implementation in the FlagOS environment with mthreads. It is suitable for various question-answering, reasoning, and decision-making scenarios that require in-depth thinking and high-concurrency calls.

# Series Repositories

- FlagScale Distributed Framework: https://github.com/flagos-ai/FlagScale

- FlagGems General Operator Library: https://github.com/flagos-ai/FlagGems

- Model Base: https://modelscope.cn/models/TeleAI/TeleChat3-36B-Thinking

# Evaluation Results

## Benchmark Test Results

| Metrics       | TeleChat3-36B-Thinking-H100-CUDA | TeleChat3-36B-Thinking-mthreads-FlagOS |
|---------------|----------------------------------|----------------------------------------|
| AIME2024      |  73.3                            | 76.6                                   |
| GPQA-Diamond  |  70.56                           | 68.69                                  |

# Quick Start

## Environment Requirements

| Item               | Value                                  |
|--------------------|----------------------------------------|
| Hardware           | Server                                 |
| Operating System   | Ubuntu 22.04                           |
| Python Version     | 3.10                                   |
| Chip Model         | S5000                                  |
| FlagScale          | 0.3.0                                  |
| FlagGems           | 4.1                                    |
| torch_musa         | 2.5.0                                  |
| transformers       | 4.53.2                                 |
| vllm               | 0.9.3                                  |
| Hardware Driver    | 3.3.4-server                           |

## Steps

### Pull FlagOS Image

```bash
docker pull harbor.baai.ac.cn/external-cooperation/teleai_telechat3-36b-thinking_mthreads_mtt-s5000_tp2:202603240910
```

### Download the Model

```bash
modelscope download --model FlagRelease/TeleChat3-36B-Thinking-FlagOS --local_dir /data/TeleChat3-36B-Thinking
```

### Start Inference Container
```bash
docker run -it \
  --privileged \
  --network=host \
  --name telechat_flagos \
  -e MTHREADS_VISIBLE_DEVICES=all \
  -e VLLM_USE_V1=0 \
  -e MTHREADS_DRIVER_CAPABILITIES=all \
  --shm-size 16g \
  -e USE_FLAGGEMS=1 \
  --cap-add=SYS_PTRACE \
  --security-opt seccomp=unconfined \
  --tmpfs /tmp:exec \
  -v /data/TeleChat3-36B-Thinking/:/data/TeleChat3-36B-Thinking \
  harbor.baai.ac.cn/external-cooperation/teleai_telechat3-36b-thinking_mthreads_mtt-s5000_tp2:202603240910  \
  sleep infinity

docker exec -it telechat_flagos /bin/bash
```

### Launch Service
```bash
rm -r /root/.triton/cache
flagscale serve --model-path /data/TeleChat3-36B-Thinking --port 9001 telechat
```

## Service Invocation

### API-Based Invocation Script
```python
import openai
openai.api_key = "EMPTY"
openai.base_url = "http://<server_ip>:9001/v1/"
model = "telechat"
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What's the weather like today?"}
]
response = openai.chat.completions.create(
    model=model,
    messages=messages,
    temperature=0.7,
    top_p=0.95,
    stream=False,
)
for item in response:
    print(item)
```
### curl Invocation
```python
curl -X POST  http://<server_ip>:9001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \
  -d '{
    "model": "telechat",
    "messages": [
      {"role": "user", "content": "Please write a simple bubble sort function in Python"}
    ],
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

# Technical Overview

## FlagScale Distributed Training and Inference Framework

FlagScale is an end-to-end large model framework for heterogeneous computing resources, maximizing computing efficiency and ensuring model effectiveness through core technologies. Its main advantages include:

- Unified deployment interface: Standardized command-line tools support one-click service deployment across multiple hardware platforms, significantly reducing adaptation costs in heterogeneous environments.

- Intelligent parallel optimization: Automatically generates optimal distributed parallel strategies based on chip computing characteristics, achieving dynamic load balancing of computing/communication resources.

- Seamless operator switching: Deeply integrated with the FlagGems operator library, enabling high-performance operator calls via environment variables without modifying model code.

## FlagGems General Large Model Operator Library

FlagGems is a cross-architecture operator library based on Triton, co-developed by industry partners. Its core strengths include:

- Full-stack coverage: Provides over 100 operators, with a broader coverage of operator types than competing libraries.

- Ecosystem compatibility: Supports 7 accelerator backends, with continuous optimization delivering significant performance improvements.

- High efficiency: Adopts unique code generation and runtime optimization techniques, outperforming alternative solutions in both secondary development speed and runtime performance.

# Contribution

We sincerely welcome developers worldwide to join us:

1. Submit Issues to report problems

2. Create Pull Requests to contribute code

3. Improve technical documentation

4. Extend hardware adaptation support

# License

本模型的权重来源于TeleAI/TeleChat3-36B-Thinking，如需引用我们的工作，请使用如下 reference:
```
@misc{wang2025technicalreporttelechat2telechat25,
      title={Technical Report of TeleChat2, TeleChat2.5 and T1}, 
      author={Zihan Wang and Xinzhang Liu and Yitong Yao and Chao Wang and Yu Zhao and Zhihao Yang and Wenmin Deng and Kaipeng Jia and Jiaxin Peng and Yuyao Huang and Sishi Xiong and Zhuo Jiang and Kaidong Yu and Xiaohui Hu and Fubei Yao and Ruiyu Fang and Zhuoru Jiang and Ruiting Song and Qiyi Xie and Rui Xue and Xuewei He and Yanlei Xue and Zhu Yuan and Zhaoxi Zhang and Zilu Huang and Shiquan Wang and Xin Wang and Hanming Wu and Mingyuan Wang and Xufeng Zhan and Yuhan Sun and Zhaohu Xing and Yuhao Jiang and Bingkai Yang and Shuangyong Song and Yongxiang Li and Zhongjiang He and Xuelong Li},
      year={2025},
      eprint={2507.18013},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2507.18013}, 
}
```

