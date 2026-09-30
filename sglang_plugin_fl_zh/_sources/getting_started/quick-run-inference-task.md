# 快速运行推理任务

本节介绍如何通过 sglang-plugin-FL 快速启动推理任务。

## 安装

### 1. 安装 SGLang v0.5.11

```{code-block} shell
pip install "sglang[all]==0.5.11"
```

### 2. 安装 [FlagGems](https://github.com/flagos-ai/FlagGems)

```{code-block} shell
git clone https://github.com/flagos-ai/FlagGems
cd FlagGems && pip install .
```

### 3. 安装 sglang-plugin-FL

```{code-block} shell
git clone https://github.com/flagos-ai/sglang-plugin-FL
cd sglang-plugin-FL && pip install .
```

### 4. （可选）安装 [FlagCX](https://github.com/flagos-ai/FlagCX) 以支持多芯片通信

```{code-block} shell
git clone https://github.com/flagos-ai/FlagCX.git
cd FlagCX && make USE_NVIDIA=1
export FLAGCX_PATH="$PWD"
```

<!-- NEW in v0.2.0 -->
厂商专属 Empty mode 安装、运行时镜像、框架软件包和验证前置条件请参阅厂商/框架/镜像选择集中页面：[厂商/框架/镜像选择集中页面](https://flagos.io/resourcedownload?lang=en)。Empty mode 不是无设备模式；目标平台必须提供其厂商 torch、驱动、固件、设备运行时、通信库、注意力后端，以及未覆盖的算子。
<!-- END NEW -->

## 下载模型

```{code-block} shell
# 用于快速测试的小模型（单 GPU）
huggingface-cli download Qwen/Qwen2.5-0.5B-Instruct

# 用于多 GPU 的较大模型（tp=8）
huggingface-cli download Qwen/Qwen2.5-14B-Instruct
```

如果无法访问 HuggingFace，可使用镜像：

```{code-block} shell
HF_ENDPOINT=https://hf-mirror.com huggingface-cli download Qwen/Qwen2.5-0.5B-Instruct
```

模型默认缓存在 `~/.cache/huggingface/hub/` 中。您也可以将本地路径传递给 `--model-path`。

## 运行推理任务

### 1. 启动 sglang 服务器

#### 单 GPU

```{code-block} shell
python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 \
    --disable-piecewise-cuda-graph
```

#### 使用张量并行的多 GPU

```{code-block} shell
python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-14B-Instruct \
    --tp 8 --port 30000 \
    --disable-piecewise-cuda-graph
```

```{note}
FlagGems Triton 内核包含 `logging.Logger` 调用，与 `torch.compile`（SGLang 的分段 CUDA 图使用该功能）不兼容。启动服务器时请始终使用 `--disable-piecewise-cuda-graph`。常规 CUDA 图捕获可正常工作。
```

<!-- NEW in v0.2.0 -->
### 多节点与流水线并行

对于多节点推理，请为目标平台配置分布式后端和网络接口，然后使用相应的 SGLang 张量并行和流水线并行参数。仓库中的多节点示例是起点，而不是通用硬件配方；请将地址、设备可见性变量、通信路径和接口名称替换为目标部署环境中的值。

流水线并行工作流可通过 `CommunicatorFL` 使用 FlagCX 或 `torch.distributed`。后端选择请参阅调度环境变量指南。平台专属镜像、框架构建版本和验证状态统一维护在集中页面：[厂商/框架/镜像选择集中页面](https://flagos.io/resourcedownload?lang=en)。

### Qwen3.6 MTP

v0.2.0 示例包含 Qwen3.6 多词元预测（MTP）工作流覆盖。请使用模型支持的 SGLang 启动参数以及目标平台已验证的运行时选择；本页面不宣称提供通用模型或硬件支持。

### 吞吐量基准测试

推理路径工作正常后，可使用仓库中的 serving benchmark 工具。请在不同输入/输出长度和请求速率下比较吞吐量、首词元延迟和解码延迟。不要从通用工作流中推断普适性能特征。
<!-- END NEW -->

### 2. 发送请求

服务器就绪后（显示 `The server is fired up and ready to roll`），发送请求：

```{code-block} shell
curl -s http://localhost:30000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "default",
    "messages": [{"role": "user", "content": "List the first 5 prime numbers."}],
    "temperature": 0
  }' | python -m json.tool
```

## 使用原生 CUDA 算子

要禁用插件并使用 SGLang 的原始 CUDA 路径：

```{code-block} shell
SGLANG_PLUGINS="__none__" python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph
```

仅禁用 ATen 层（保留融合算子调度）：

```{code-block} shell
USE_FLAGGEMS=0 python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph
```

更多调度配置选项，请参阅[算子调度用户指南](../dispatch_user_guide/dispatch-user-guide.md)。
