# 适配门禁测试

适配门禁（adaptation gate）是 vllm-plugin-FL 仓库中 `tools/adaptation-gate-cases` 下的一套小型手工测试，用于加速器适配和 vLLM 插件升级验证，覆盖必需模型在 eager 与 graph 两种模式下的文本、图像以及文本图像混合请求。

测试用例本身维护在仓库中：[tools/adaptation-gate-cases](https://github.com/flagos-ai/vllm-plugin-FL/tree/main/tools/adaptation-gate-cases)。

请在[安装](install.md) vllm-plugin-FL 之后、运行推理任务之前执行该门禁；所用模型与[运行推理任务](run-inference-task.md)一致。

## 测试矩阵

| 模型 | 模式 | 单条长文本用例 | 单条长图像用例 | 文本用例 | 图像用例 | 文本图像混合用例 | 用例总数 |
|-------|------|----------------------|------------------------|-----------|-------------|----------------------------|-------------|
| `Qwen3.6-27B` | eager | 1 | 1 | 8 | 8 | 4+4 | 26 |
| `Qwen3.6-27B` | graph | 1 | 1 | 8 | 8 | 4+4 | 26 |
| `Qwen3.6-35B-A3B` | eager | 1 | 1 | 8 | 8 | 4+4 | 26 |
| `Qwen3.6-35B-A3B` | graph | 1 | 1 | 8 | 8 | 4+4 | 26 |

矩阵统计的是 pytest 场景数；每个并发场景会发送八个请求。

每种模式运行以下场景：

| 测试文件 | 场景 |
|-----------|-----------|
| `test_text.py` | 单条文本用例；8 路并发文本用例 |
| `test_image.py` | 单条图像用例；8 路并发图像用例 |
| `test_mix_text_image.py` | 8 路并发文本图像混合用例 |

## 运行门禁测试

脚本位于插件仓库的 `tools/adaptation-gate-cases` 目录。在终端 1 启动 eager 服务：

```{code-block} shell
cd /vllm-workspace/vllm-plugin-FL/tools/adaptation-gate-cases
MODEL_PATH=/models/Qwen3.6-27B PORT=8000 ./run_serve_eager.sh
```

等待服务就绪后，在终端 2 运行全部测试：

```{code-block} shell
cd /vllm-workspace/vllm-plugin-FL/tools/adaptation-gate-cases
MODEL_PATH=/models/Qwen3.6-27B PORT=8000 ./run_test.sh
```

随后停止 eager 服务，在另一个端口上用 graph 模式重复：

```{code-block} shell
MODEL_PATH=/models/Qwen3.6-27B PORT=8001 ./run_serve_graph.sh
MODEL_PATH=/models/Qwen3.6-27B PORT=8001 ./run_test.sh
```

`run_test.sh` 即使前一个文件失败也会继续执行以下全部命令：

```{code-block} shell
pytest -sv test_text.py
pytest -sv test_image.py
pytest -sv test_mix_text_image.py
```

每个模型都必须分别以 eager 和 graph 各测一次；切换模式前需先停止当前服务。必需组合为：

- `/models/Qwen3.6-27B` —— `eager` 与 `graph`
- `/models/Qwen3.6-35B-A3B` —— `eager` 与 `graph`

启动脚本需要 `MODEL_PATH` 和 `PORT`。其 served model name 优先取 `SERVED_MODEL_NAME`，未设置时回退为 `MODEL_PATH`。`run_test.sh` 需要 `PORT`，以及 `SERVED_MODEL_NAME` 或 `MODEL_PATH` 之一。常用环境变量覆盖项有 `TENSOR_PARALLEL_SIZE`、`MAX_MODEL_LEN` 和 `SERVER_PID_FILE`；`run_test.sh` 还支持 `BASE_URL`、`SERVICE_TIMEOUT`、`REQUEST_TIMEOUT`、`SERVER_PID_FILE` 和 `RESULTS_DIR`。

也可以不用 `run_serve.sh` 而使用自定义命令。该命令必须提供 OpenAI 兼容端点、以 `qwen` 为 served model name，并允许加载本目录下的本地图片。例如：

```{code-block} shell
vllm serve /models/Qwen3.6-27B \
    --served-model-name /models/Qwen3.6-27B \
    --host 127.0.0.1 \
    --port 8000 \
    --tensor-parallel-size 2 \
    --max-model-len 32768 \
    --allowed-local-media-path "$PWD/images" \
    --trust-remote-code \
    --enforce-eager
```

eager 运行时使用 `--enforce-eager`，graph 运行时去掉该参数，然后对每个服务执行
`MODEL_PATH=/path/to/model PORT=8000 ./run_test.sh`。即使测试客户端不需要知道执行模式，两次运行都是必需的。

也可以直接运行单个 pytest 文件或用例。此时需要 `PORT`，以及 `SERVED_MODEL_NAME` 或 `MODEL_PATH` 之一。结果标签优先使用 `MODEL_PATH`，否则使用 `SERVED_MODEL_NAME`：

```{code-block} shell
MODEL_PATH=/models/Qwen3.6-27B PORT=8000 pytest -sv test_text.py
MODEL_PATH=/models/Qwen3.6-27B PORT=8000 pytest -sv test_image.py::test_image_single
```

## 结果与质量检查

每个 pytest 用例会在 `results/MODEL/port-PORT/SCENARIO.json` 下写入一个 JSON 文件。若需同时保留 eager 与 graph 的结果，请为两种服务使用不同端口；复用端口会覆盖该模型该端口上一次的结果。两模型、两端口的矩阵共产生 20 个 JSON 文件。每个文件都包含精确输入、API 输出、耗时、逐响应检查以及通过/失败汇总。失败时还会在终端打印简要的请求级错误汇总。

响应必须包含预期的语义答案，且不得包含空输出、`!!!`、乱码、控制字符、可疑字符连串或重复的词语或短语。详细的大模型介绍还必须不少于 256 个字符。数字词与阿拉伯数字视为等价。

重新生成图像素材：

```{code-block} shell
python3 generate_images.py
```
