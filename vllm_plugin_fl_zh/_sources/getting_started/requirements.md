# 要求

## 软件要求

下表汇总了各版本 vllm-plugin-FL 所需的软件及其版本：

| 要求 | v0.1.0（vLLM 0.13.0） | v0.2.2（vLLM 0.20.2） | v0.3.0（vLLM 0.24.0） | 备注 |
|-------------|----------------------|----------------------|----------------------|-------|
| Python | 3.10 - 3.13 | 3.10 - 3.13 | 3.10 - 3.13 | 必需 |
| PyTorch | >= 2.7.1 | >= 2.7.1 | >= 2.7.1 | 必需 |
| vLLM | 0.13.0 | 0.20.2 | 0.24.0 | NVIDIA 使用官方发布；非 NVIDIA 需以 `VLLM_TARGET_DEVICE=empty` 从源码安装 |
| FlagGems | >= v5.0.0 | >= v5.0.0 | v5.3.4；支持 >= v5.0.0 | 算子调度必需。[安装](install.md)步骤固定使用 `v5.3.4`（与上游 README 一致） |
| FlagCX | v0.13.0 | v0.13.0 | v0.13.0 | 可选，用于多芯片通信 |
| FlagTree | 0.4.0 | 0.4.0 | 0.7.0 | 从 `0.7.0` 发版分支配合对应厂商 backend 源码编译（见[安装](install.md)步骤） |

## 支持的硬件平台

下表汇总了支持的硬件及其验证状态：

| 芯片厂商 | 芯片型号 | v0.1.0（vLLM 0.13.0） | v0.2.2（vLLM 0.20.2） | v0.3.0（vLLM 0.24.0） | 备注 |
|-------------|------------|----------------------|----------------------|----------------------|-------|
| NVIDIA | — | 支持 | 支持 | 支持 | |
| ARM64 CPU | — | — | — | 支持 | ARM64 主机上的纯 CPU 推理 |
| Ascend | 910c | 支持 | — | 支持 | 需要 FlagTree 和 {ref}`eager 执行 <additional-setup-for-huawei-ascend>` |
| MetaX | MACA C550 | 支持 | — | 支持 | MetaX C550 已适配 vLLM 0.24.0 |
| T-Head | PPU | 支持 | — | 支持 | |
| Iluvatar | BI-V150 | 支持 | — | 支持 | BI-V150 已适配 vLLM 0.24.0；启用 CUDA graph |
| Moore Threads | MTT S5000 | 支持 | — | 支持 | MTT S5000 已适配 vLLM 0.24.0 |
| Tsingmicro | TX8110 | 合并中 | — | 支持 | 上游仍在推进 |
| Hygon DCU | BW1000 | 支持 | 支持 | 支持 | 需要 DTK 容器（参见[安装指南](install.md)） |
| Sunrise | S2 | 支持 | — | 支持 | |
| 燧原 | S60 | — | — | 支持 | 燧原 GCU 后端（`gcu`）；容器环境配置参见安装指南 |
| 阿里 PPU | PPU | — | — | 支持 | empty-mode 支持；FlagTree PPU backend 源码编译仍在进行中 |

## 支持的模型

理论上，如果不涉及不支持的算子，vllm-plugin-FL 可以支持 vLLM 中所有可用的模型。以下模型已经过端到端验证：

| 模型 | 状态 | 示例 |
|-------|--------|---------|
| Qwen3.5-397B-A17B | 支持 | [qwen3_5_offline_inference.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/examples/qwen3_5_offline_inference.py) |
| Qwen3-Next-80B-A3B | 支持 | [qwen3_next_offline_inference.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/examples/qwen3_next_offline_inference.py) |
| Qwen3-4B | 支持 | [offline_inference.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/examples/offline_inference.py) |
| MiniCPM-o 4.5 | 支持 | [examples/minicpm/](https://github.com/flagos-ai/vllm-plugin-FL/tree/main/examples/minicpm) |
| GLM-5 | 支持 | [glm_5_offline_inference.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/examples/glm_5_offline_inference.py) |
| Qwen3.5-35B-A3B | 支持 | [qwen3_5_offline_inference.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/examples/qwen3_5_offline_inference.py) |
| BAAI/bge-m3 | 支持 | [bge_m3.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/vllm_fl/models/bge_m3.py) |
| MiniMax-M2.7 | 支持 | [minimax_m27_offline_inference.py](https://github.com/flagos-ai/vllm-plugin-FL/blob/main/examples/minimax_m27_offline_inference.py) |
| Qwen3.6-35B-A3B | 支持 | {ref}`文本 + 图像推理/服务 <run-a-serving-inference-task>` |
| Qwen3.6-27B | 支持 | {ref}`文本 + 图像推理/服务 <run-a-serving-inference-task>` |
| Qwen2.5-1.5B | 支持 | [运行推理任务](run-inference-task.md) |

这些模型使用的调度 API 参见[调度 API 参考](../reference/dispatch-api-reference.md)。插件分支与 vLLM 版本的对应关系参见[安装指南](install.md)中的版本表。
