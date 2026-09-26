# Run an inference task

With vLLM and vllm-plugin-FL [installed](install.md), you can run inference in two ways: offline batched inference (load the model directly in a Python script) or serving inference (start an API server and send requests). Choose the approach that fits your use case.

## Run an offline batched inference

Offline batched inference loads the model directly in a Python script and generates outputs for a batch of prompts in a single run — no server setup required.

```python
from vllm import LLM, SamplingParams


if __name__ == '__main__':
    prompts = [
        "Hello, my name is",
    ]
    # Create a sampling params object.
    sampling_params = SamplingParams(max_tokens=10, temperature=0.0)
    # Create an LLM.
    llm = LLM(model="Qwen/Qwen3-4B", max_num_batched_tokens=16384, max_num_seqs=2048)
    # Generate texts from the prompts.
    outputs = llm.generate(prompts, sampling_params)
    for output in outputs:
        prompt = output.prompt
        generated_text = output.outputs[0].text
        print(f"Prompt: {prompt!r}, Generated text: {generated_text!r}")
```

The following table lists the descriptions of the key parameters.

| Parameter | Description |
| :--- | :--- |
| `max_num_batched_tokens` | Caps the total number of tokens processed in a single forward pass. Helps prevent OOM on memory-constrained GPUs. |
| `max_num_seqs` | Limits how many concurrent prompts/sequences are batched together. |
| `temperature=0.0` | Makes generation deterministic (greedy decoding). |
| `max_tokens=10` | Hard limit on output length per prompt. |

(run-a-serving-inference-task)=
## Run a serving inference task

Serving inference starts a long-running vLLM API server that keeps the model loaded in memory, accepting requests via OpenAI-compatible HTTP endpoints — ideal for online services and concurrent clients.

Since this is a local deployment, no API key is required. Set `api_key` to any value (e.g. `"EMPTY"`) — no tokens are consumed.

For multimodal models (e.g. Qwen3.6 series) or when testing the full serving stack, use the serve-and-request workflow.

1. Start the vLLM service:

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

2. Send a text request:

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

3. Send an image request (multimodal):

```python
from PIL import Image, ImageDraw
import base64
from openai import OpenAI

# create local image
img = Image.new("RGB", (300, 200), color="white")

draw = ImageDraw.Draw(img)
draw.rectangle((50, 50, 250, 150), fill="blue")
draw.text((90, 80), "Hello VLM", fill="yellow")

image_path = "/tmp/test.jpg"
img.save(image_path)

# read local image
with open(image_path, "rb") as f:
    base64_image = base64.b64encode(f.read()).decode("utf-8")

# openai client
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

For examples with other models, see the [examples directory](https://github.com/flagos-ai/vllm-plugin-FL/tree/main/examples).

To validate accelerator adaptation or a vLLM plugin upgrade against the served models, run the [adaptation gate](adaptation-gate.md).