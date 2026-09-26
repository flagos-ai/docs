# 运行推理任务

[安装](install.md)好 vLLM 和 vllm-plugin-FL 后，您可以通过两种方式运行推理：离线批量推理（在 Python 脚本中直接加载模型）或服务推理（启动 API 服务器并发送请求）。请选择适合您用例的方式。

## 运行离线批量推理

离线批量推理在 Python 脚本中直接加载模型，并在单次运行中为一批提示词生成输出——无需设置服务器。

```python
from vllm import LLM, SamplingParams


if __name__ == '__main__':
    prompts = [
        "Hello, my name is",
    ]
    # 创建采样参数对象。
    sampling_params = SamplingParams(max_tokens=10, temperature=0.0)
    # 创建 LLM。
    llm = LLM(model="Qwen/Qwen3-4B", max_num_batched_tokens=16384, max_num_seqs=2048)
    # 从提示词生成文本。
    outputs = llm.generate(prompts, sampling_params)
    for output in outputs:
        prompt = output.prompt
        generated_text = output.outputs[0].text
        print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")
```

下表列出了关键参数的说明。

| 参数 | 说明 |
| :--- | :--- |
| `max_num_batched_tokens` | 限制单次前向传播中处理的 token 总数。有助于防止内存受限 GPU 上的 OOM。 |
| `max_num_seqs` | 限制同时批处理的并发提示词/序列数量。 |
| `temperature=0.0` | 使生成变为确定性（贪婪解码）。 |
| `max_tokens=10` | 每个提示词的输出长度硬限制。 |

(run-a-serving-inference-task)=
## 运行服务推理任务

服务推理启动一个长期运行的 vLLM API 服务器，将模型保持在内存中，通过兼容 OpenAI 的 HTTP 端点接受请求——非常适合在线服务和并发客户端。

由于这是本地部署，不需要 API 密钥。将 `api_key` 设置为任意值（例如 `"EMPTY"`）——不会消耗任何 token。

对于多模态模型（例如 Qwen3.6 系列）或测试完整的服务技术栈时，请使用服务-请求工作流。

1. 启动 vLLM 服务：

```{code-block} shell
export VLLM_PLUGINS='fl'
vllm serve /models/Qwen3.6-35B-A3B \
    --served-model-name "qwen" \
    --host 0.0.0.0 \
    --port 8000 \
    --tensor-parallel-size 2 \
    --max-model-len 32768 \
    --trust-remote-code \
    --limit-mm-per-prompt '{"image": 1}'
```

2. 发送文本请求：

```python
from openai import OpenAI

client = OpenAI(api_key="EMPTY", base_url="http://localhost:8000/v1")
chat_response = client.chat.completions.create(
    model="qwen",
    messages=[{"role": "user", "content": "Introduce LLM"}],
    max_tokens=512,
    temperature=1.0,
    top_p=0.95,
    presence_penalty=1.5,
    extra_body={"top_k": 20},
)
print("Chat response:", chat_response)
```

3. 发送图像请求（多模态）：

```python
from PIL import Image, ImageDraw
import base64
from openai import OpenAI

# 创建本地图像
img = Image.new("RGB", (300, 200), color="white")

draw = ImageDraw.Draw(img)
draw.rectangle((50, 50, 250, 150), fill="blue")
draw.text((90, 80), "Hello VLM", fill="yellow")

image_path = "/tmp/test.jpg"
img.save(image_path)

# 读取本地图像
with open(image_path, "rb") as f:
    base64_image = base64.b64encode(f.read()).decode("utf-8")

# openai 客户端
client = OpenAI(
    api_key="EMPTY",
    base_url="http://localhost:8000/v1",
)

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_image}"
                }
            },
            {
                "type": "text",
                "text": "Describe this image in detail."
            }
        ]
    }
]

chat_response = client.chat.completions.create(
    model="qwen",
    messages=messages,
    max_tokens=512,
    temperature=1.0,
    top_p=0.95,
    presence_penalty=1.5,
    extra_body={
        "top_k": 20,
    },
)
print("Chat response:", chat_response)
```

其他模型的示例请参见 [examples 目录](https://github.com/flagos-ai/vllm-plugin-FL/tree/main/examples)。

要针对所服务的模型验证加速器适配或 vLLM 插件升级，请运行[适配门禁测试](adaptation-gate.md)。
