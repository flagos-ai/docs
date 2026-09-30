# 通过环境变量进行调度

所有插件行为都由带有 `SGLANG_FL_*` 前缀的环境变量控制。

<!-- NEW in v0.2.0 -->
有效配置优先级如下：

```{code-block} text
environment variables > explicit YAML (`SGLANG_FL_CONFIG`) > platform auto-detected YAML > code defaults
```

环境变量可以覆盖显式 YAML 和平台 YAML 中的值。平台特定后端名称和运行时默认值取决于目标平台；当部署需要本通用指南未定义的可接受值列表时，请使用 `[TODO: needs confirmation]`。
<!-- END NEW -->

## 第二层 — 融合算子调度

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `SGLANG_FL_OOT_ENABLED` | `1` | 总开关：`0` 禁用第二层（保留第一层 ATen） |
| `SGLANG_FL_PREFER` | `flagos` | 全局后端偏好：`flagos`、`vendor`、`reference` |
| `SGLANG_FL_PER_OP` | — | 逐算子后端优先级，例如 `rms_norm=vendor\|flagos;silu_and_mul=reference` |
| `SGLANG_FL_OOT_BLACKLIST` | — | 跳过列出的算子，不进行 OOT 调度（逗号分隔的类名） |
| `SGLANG_FL_OOT_WHITELIST` | — | 仅调度列出的算子（与 BLACKLIST 互斥） |
| `SGLANG_FL_STRICT` | `0` | `1` 禁用回退；首选或有序后端不可用时会报错 |
| `SGLANG_FL_DENY_VENDORS` | — | 拒绝指定厂商（逗号分隔） |
| `SGLANG_FL_ALLOW_VENDORS` | — | 仅允许列出的厂商（逗号分隔） |
| `SGLANG_FL_DISPATCH_LOG` | — | 调度日志文件路径（记录哪些算子被拦截） |
| `SGLANG_FL_DISPATCH_DEBUG` | [TODO: needs confirmation] | 启用额外调度诊断；可接受值为 [TODO: needs confirmation] |

## 第一层 — ATen 替换（FlagGems）

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `USE_FLAGGEMS` | `1` | 总开关：`0` 禁用所有 ATen 替换 |
| `SGLANG_FL_FLAGOS_WHITELIST` | — | 仅列出的 ATen 算子使用 FlagGems（逗号分隔） |
| `SGLANG_FL_FLAGOS_BLACKLIST` | — | 列出的 ATen 算子不使用 FlagGems（逗号分隔） |
| `SGLANG_FLAGGEMS_RECORD` | `0` | `1` = 记录哪些 ATen 算子被替换 |
| `SGLANG_FLAGGEMS_LOG_PATH` | — | ATen 替换日志文件路径 |
| `SGLANG_FLAGGEMS_LOG_ONCE` | `1` | `1` = 每个算子仅记录一次，`0` = 记录每次调用 |

> `SGLANG_FL_FLAGOS_WHITELIST` 和 `SGLANG_FL_FLAGOS_BLACKLIST` 互斥。`SGLANG_FL_FLAGOS_WHITELIST` 优先级高于 YAML `flagos_blacklist`。

## 第三层 — 分布式通信

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `SGLANG_FL_DIST_BACKEND` | 通用参考表中为 `nccl` | 分布式后端选择；平台运行时默认值可能映射到其他后端，且未设置显式覆盖时，`FLAGCX_PATH` 可以选择 FlagCX |
| `FLAGCX_PATH` | — | FlagCX 安装路径；使用 FlagCX collective communication 时必需 |

支持的运行时选项取决于平台和已安装库。对于目标运行时未覆盖的平台特定可接受值，请使用 `[TODO: needs confirmation]`。

## 系统 / 调试

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `SGLANG_FL_CONFIG` | — | YAML 配置文件路径（覆盖平台自动检测） |
| `SGLANG_FL_PLATFORM` | （自动） | 强制指定平台；可接受值为 [TODO: needs confirmation] |
| `SGLANG_FL_LOG_LEVEL` | `INFO` | 调度系统日志级别：`DEBUG`、`INFO`、`WARNING`、`ERROR` |
| `SGLANG_PLUGINS` | （全部） | SGLang 内置：筛选要加载的插件（逗号分隔） |

## 示例

```{code-block} shell
# 强制所有算子使用 reference 后端（纯 PyTorch，适用于精度调试）
SGLANG_FL_PREFER=reference python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# 逐算子：RMSNorm 使用 vendor，其他使用 flagos
SGLANG_FL_PER_OP="rms_norm=vendor|flagos;silu_and_mul=flagos" \
    python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# 跳过 RotaryEmbedding 的 OOT 调度（回退到 SGLang 原生 CUDA）
SGLANG_FL_OOT_BLACKLIST=RotaryEmbedding python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# 禁用 ATen 层，仅保留融合算子调度
USE_FLAGGEMS=0 python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph

# 使用 YAML 配置并通过环境变量覆盖
SGLANG_FL_CONFIG=./my_config.yaml SGLANG_FL_PREFER=reference \
    python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-0.5B-Instruct \
    --port 30000 --disable-piecewise-cuda-graph
```
